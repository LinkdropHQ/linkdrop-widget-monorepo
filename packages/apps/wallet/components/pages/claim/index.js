import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { actions, translate, platform } from 'decorators'
import InitialPage from './initial-page'
import { Page } from 'components/pages'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'
import { getHashVariables } from '@linkdrop/commons'

@actions(({ user: { errors, step, loading: userLoading, readyToClaim, alreadyClaimed, contractAddress }, tokens: { transactionId }, assets: { loading, itemsToClaim } }) => ({
  userLoading,
  loading,
  itemsToClaim,
  step,
  transactionId,
  errors,
  alreadyClaimed,
  readyToClaim,
  contractAddress
}))
@platform()
@translate('pages.claim')
class Claim extends React.Component {
  componentDidMount () {
    const {
      linkKey,
      linkdropModuleAddress
    } = getHashVariables()
    this.actions().tokens.checkIfClaimed({ linkKey, linkdropModuleAddress })
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed }) {
    const { readyToClaim: prevReadyToClaim } = this.props
    if (
      (readyToClaim === true && prevReadyToClaim === true) ||
      readyToClaim == null ||
      readyToClaim === false ||
      alreadyClaimed == null
    ) { return }
    const {
      tokenAddress,
      weiAmount,
      tokenAmount,
      expirationTime,
      nftAddress,
      tokenId
    } = getHashVariables()
    if (Number(expirationTime) < (+(new Date()) / 1000)) {
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }
    this.getAssetsData({ nftAddress, tokenId, weiAmount, tokenAddress, tokenAmount })
  }

  getAssetsData ({ nftAddress, tokenId, weiAmount, tokenAddress, tokenAmount }) {
    if (nftAddress && tokenId) {
      return this.actions().assets.getTokenERC721Data({ nftAddress, tokenId, weiAmount })
    }

    if (tokenAddress) {
      return this.actions().assets.getTokenERC20Data({ tokenAddress, tokenAmount, weiAmount })
    }
  }

  render () {
    const { step, itemsToClaim, userLoading, errors, alreadyClaimed, contractAddress, loading } = this.props
    return <Page dynamicHeader disableFlex>
      {this.renderCurrentPage({ step, itemsToClaim, userLoading, errors, alreadyClaimed, contractAddress, loading })}
    </Page>
  }

  renderCurrentPage ({ step, widgetShow, itemsToClaim, userLoading, errors, alreadyClaimed, contractAddress, loading }) {
    const {
      linkdropMasterAddress
    } = getHashVariables()
    const commonData = { linkdropMasterAddress, itemsToClaim, loading: userLoading || loading, wallet: contractAddress }
    if (errors && errors.length > 0) {
      // if some errors occured and can be found in redux store, then show error page
      return <ErrorPage error={errors[0]} />
    }

    if (alreadyClaimed) {
      // if tokens we already claimed
      return <ClaimingFinishedPage
        {...commonData}
        alreadyClaimed
      />
    }

    switch (step) {
      case 1:
        return <InitialPage
          {...commonData}
          onClick={_ => this.actions().user.setStep({ step: 2 })}
        />
      case 2:
        // claiming is in process
        return <ClaimingProcessPage
          {...commonData}
        />
      case 3:
        // claiming finished successfully
        return <ClaimingFinishedPage
          {...commonData}
          claimingFinished
        />
      default:
        // loading
        return <Loading />
    }
  }
}

export default Claim
