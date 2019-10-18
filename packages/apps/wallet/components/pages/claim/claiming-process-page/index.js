import React from 'react'
import { translate, actions } from 'decorators'
import commonStyles from '../styles.module'
import { getHashVariables } from '@linkdrop/commons'
import { TokensAmount, AssetBalance, AccountBalance } from 'components/common'
import { getCurrentAsset } from 'helpers'
import styles from './styles.module'
import { Alert } from '@linkdrop/ui-kit'

@actions(({ user: { chainId }, tokens: { transactionId, transactionStatus } }) => ({ transactionId, chainId, transactionStatus }))
@translate('pages.claim')
class ClaimingProcessPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    const {
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      nftAddress,
      tokenId,
      weiAmount,
      campaignId
    } = getHashVariables()

    if (nftAddress && tokenId) {
      return this.actions().tokens.claimTokensERC721({ campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropMasterAddress })
    }
    return this.actions().tokens.claimTokensERC20({ campaignId, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature })
  }

  componentWillReceiveProps ({ transactionId: id, transactionStatus: status, chainId }) {
    const { transactionId: prevId, transactionStatus: prevStatus } = this.props
    if (id != null && prevId === null) {
      this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId: id, chainId, statusToAdd: 'claimed' }), 3000)
    }
    if (status != null && status === 'claimed' && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.actions().tokens.setTransactionStatus({ transactionStatus: null })
      window.setTimeout(_ => {
        this.setState({
          loading: false
        }, _ => this.actions().assets.saveClaimedAssets())
      }, 1000)
    }
  }

  render () {
    const { itemsToClaim, transactionId, chainId } = this.props
    const { loading } = this.state
    const mainAsset = getCurrentAsset({ itemsToClaim })
    if (!mainAsset) { return null }
    const { balanceFormatted, symbol } = mainAsset
    return <div className={commonStyles.container}>
      {this.renderPreview({ mainAsset, loading, itemsToClaim })}
      <div className={styles.loading}>
        <TokensAmount chainId={chainId} transactionId={transactionId} claimingFinished={!loading} loading={loading} symbol={symbol} amount={balanceFormatted} />
      </div>
    </div>
  }

  renderPreview ({ mainAsset, loading, itemsToClaim }) {
    if (mainAsset.type === 'erc721') {
      const { image, name } = mainAsset
      return <div className={styles.tokenPreview}>
        <div className={styles.tokenPreviewImage}>
          <img src={image} />
        </div>
        <div className={styles.tokenPreviewTitle}>
          {name}
        </div>
      </div>
    }

    return <AccountBalance items={itemsToClaim} loading={loading} />
  }
}

export default ClaimingProcessPage
