import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { TokensAmount, Button } from 'components/common'
import { AssetsList } from 'components/pages/common'
import InviteFriend from './invite-friend'

@actions(({ tokens: { transactionData, transactionId, transactionStatus }, user: { chainId, loading, contractAddress, ens }, assets: { items } }) => ({
  transactionData,
  items,
  loading,
  contractAddress,
  ens,
  chainId,
  transactionId,
  transactionStatus
}))
@translate('pages.wallet')
class Wallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingAssets: {},
      showInviteFriend: false
    }
  }

  componentDidMount () {
    const { transactionData, items, transactionId, chainId } = this.props
    if (transactionData && transactionData.tokenAddress) {
      const currentItem = items.find(item => item.tokenAddress === transactionData.tokenAddress)
      if (!currentItem) { return }
      const { symbol } = currentItem
      this.setState({
        sendingAssets: {
          symbol,
          status: transactionData.status,
          amount: transactionData.value
        }
      }, _ => {
        // search for transaction only if status is not loading
        if (transactionData.status === 'finished') {
          this.hideLoader = window.setTimeout(_ => this.setState({
            sendingAssets: {}
          }, _ => {
            this.actions().tokens.setTransactionData({ transactionData: {} })
          }), 3000)
          return
        }
        this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ statusToAdd: 'sent' }), 3000)
      })
    }
  }

  componentWillReceiveProps ({ contractAddress, chainId, transactionId: id, transactionStatus: status }) {
    const { transactionId: prevId, transactionStatus: prevStatus } = this.props
    const { sendingAssets } = this.state
    if (status != null && status === 'sent' && prevStatus === null) {
      this.actions().assets.getItems()
    }

    if (status != null && status === 'failed' && prevStatus === null) {
      alert(`unfortunately your transaction was failed, check txhash: ${id}`)
      this.actions().tokens.setTransactionId({ transactionId: null })
    }

    if (status != null && (status === 'failed' || status === 'sent') && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.setState({
        sendingAssets: {
          ...sendingAssets,
          status: status === 'failed' ? 'failed' : 'finished'
        }
      }, _ => {
        this.hideLoader = window.setTimeout(_ => this.setState({
          sendingAssets: {}
        }, _ => {
          this.actions().tokens.setTransactionData({ transactionData: {} })
          this.actions().tokens.setTransactionStatus({ transactionStatus: null })
        }), 3000)
      })
    }
  }

  componentWillUnmount () {
    const { items, chainId } = this.props
    if (items === null) {
      this.actions().assets.getItems()
    }
    this.hideLoader && window.clearTimeout(this.hideLoader)
    this.statusCheck && window.clearInterval(this.statusCheck)
  }

  render () {
    const { sendingAssets, showInviteFriend } = this.state
    const { items, loading, chainId } = this.props
    return <Page disableFlex dynamicHeader>
      <div className={styles.container}>
        {this.renderLoader({ sendingAssets })}
        <InviteFriend
          show={showInviteFriend}
          onClose={_ => this.setState({
            showInviteFriend: false
          })}
        />
        <AssetsList />
        <Button
          inverted
          className={styles.button}
          onClick={_ => this.setState({
            showInviteFriend: true
          })}
        >
          {this.t('titles.inviteFriends')}
        </Button>
      </div>
    </Page>
  }

  renderLoader ({ sendingAssets, chainId, transactionId }) {
    const { symbol, amount, status } = sendingAssets
    if (!amount || !symbol) { return null }
    return <TokensAmount
      chainId={chainId}
      transactionId={transactionId}
      sendLoading={status === 'loading'}
      symbol={symbol}
      sendingFinished={status === 'finished'}
      amount={amount}
    />
  }
}

export default Wallet
