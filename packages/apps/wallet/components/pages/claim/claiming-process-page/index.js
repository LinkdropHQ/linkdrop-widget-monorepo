import React from 'react'
import { translate, actions } from 'decorators'
import commonStyles from '../styles.module'
import { getHashVariables } from '@linkdrop/commons'
import { TokensAmount, AccountBalance } from 'components/common'
import { getCurrentAsset } from 'helpers'
import styles from './styles.module'
import { Alert, Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'

@actions(({ user: { chainId }, tokens: { transactionId, transactionStatus } }) => ({ transactionId, chainId, transactionStatus }))
@translate('pages.claim')
class ClaimingProcessPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      iconType: 'default'
    }
  }

  componentDidMount () {
    const {
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      nftAddress,
      tokenId,
      weiAmount,
      campaignId
    } = getHashVariables()

    if (nftAddress && tokenId) {
      return this.actions().tokens.claimTokensERC721({ campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropModuleAddress })
    }
    return this.actions().tokens.claimTokensERC20({ campaignId, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature })
  }

  componentWillReceiveProps ({ transactionId: id, transactionStatus: status, chainId }) {
    const { transactionId: prevId, transactionStatus: prevStatus } = this.props
    if (id != null && prevId === null) {
      this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId: id, chainId, statusToAdd: 'claimed' }), 3000)
    }
    if (status != null && status === 'claimed' && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.actions().tokens.setTransactionStatus({ transactionStatus: null })
      this.setState({
        loading: false
      }, _ => this.actions().assets.saveClaimedAssets())
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
      const { iconType } = this.state
      const { image, name, symbol } = mainAsset
      const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={image} /> : <Icons.Star />
      return <div className={styles.tokenPreview}>
        <Alert
          noBorder={iconType === 'default' && symbol !== 'ETH'} className={classNames(styles.tokenIcon, {
            [styles.tokenIconNft]: iconType === 'default'
          })} icon={finalIcon}
        />
        <div className={styles.tokenPreviewTitle}>
          {name}
        </div>
      </div>
    }

    return <AccountBalance items={itemsToClaim} loading={loading} />
  }
}

export default ClaimingProcessPage
