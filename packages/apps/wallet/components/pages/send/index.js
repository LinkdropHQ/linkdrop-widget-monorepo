import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import Header from './header'
import Assets from './assets'
import Input from './input'
import Contacts from './contacts'
import LinkPay from './link-pay'
import { defineEtherscanUrl } from '@linkdrop/commons'
import { Scrollbars } from 'react-custom-scrollbars'
import { ethers } from 'ethers'
import classNames from 'classnames'

@actions(({ tokens: { transactionId, transactionStatus }, user: { chainId, loading, contractAddress, errors }, assets: { items } }) => ({ errors, transactionId, transactionStatus, items, loading, contractAddress, chainId }))
@translate('pages.send')
class Send extends React.Component {
  constructor (props) {
    super(props)
    const initialAsset = ((props.items || [])[0]) || {}
    this.state = {
      sendTo: '',
      tokenType: initialAsset.type,
      currentAsset: initialAsset.tokenAddress,
      amount: null,
      tokenId: initialAsset.tokenId,
      showTx: false,
      error: null
    }
  }

  componentWillReceiveProps ({ chainId, items, transactionId: id, transactionStatus: status }) {
    const { contractAddress, items: prevItems, transactionId: prevId, transactionStatus: prevStatus } = this.props
    if (id != null && prevId === null) {
      this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ statusToAdd: 'sent' }), 3000)
      this.showTxHash = window.setTimeout(_ => this.setState({
        showTx: true
      }), 2000)
    }
    if (items != null && (items || {}).length !== 0 && (prevItems || {}).length === 0) {
      const currentAsset = items[0] || {}
      this.setState({
        currentAsset: currentAsset.tokenAddress,
        tokenType: currentAsset.type,
        tokenId: currentAsset.tokenId
      })
    }
    if (status != null && status === 'sent' && prevStatus === null) {
      this.actions().assets.getItems()
    }
    if (status != null && status === 'failed' && prevStatus === null) {
      alert(`unfortunately your transaction was failed, check txhash: ${id}`)
      this.actions().tokens.setTransactionId({ transactionId: null })
    }

    if (status != null && (status === 'failed' || status === 'sent') && prevStatus === null) {
      this.setState({
        sendTo: '',
        amount: null,
        showTx: false,
        error: null
      })
      this.statusCheck && window.clearInterval(this.statusCheck)
    }
  }

  componentWillUnmount () {
    this.actions().user.setLoading({ loading: false })
    this.actions().tokens.setTransactionId({ transactionId: null })
    this.statusCheck && window.clearInterval(this.statusCheck)
    this.showTxHash && window.clearTimeout(this.showTxHash)
  }

  render () {
    const { sendTo, currentAsset, amount, showTx, error, tokenType } = this.state
    const { loading, transactionId, chainId, errors } = this.props
    return <Page hideHeader>
      <div className={styles.container}>
        <Header
          sendTo={sendTo}
          error={error}
          tokenType={tokenType}
          amount={amount}
          onChange={({ amount }) => this.changeAmount({ amount })}
          onSend={_ => this.onSend()}
        />
        <Scrollbars style={{
          height: 'calc(100% - 90px)',
          width: '100%'
        }}
        >
          <div className={styles.content}>
            <Assets
              onChange={({ currentAsset, tokenType, tokenId }) => {
                this.changeAsset({
                  asset: currentAsset,
                  tokenType,
                  tokenId
                })
              }} currentAsset={currentAsset}
            />
            <Input
              onChange={({ value }) => this.setState({
                sendTo: value
              })}
              className={classNames(styles.input, {
                [styles.inputErrored]: errors && errors[0]
              })}
              disabled={loading}
              value={sendTo}
              title={this.t('titles.to')}
              placeholder={this.t('titles.toPlaceholder')}
            />
            {false && <Input title={this.t('titles.for')} placeholder={this.t('titles.forPlaceholder')} />}
            {false && <Contacts />}
            {false && <LinkPay title={this.t('titles.payViaLink')} disabled={!amount || !Number(amount) || loading} />}
            {showTx && transactionId && <div
              className={styles.note}
              dangerouslySetInnerHTML={{
                __html: this.t('texts.details', { link: `${defineEtherscanUrl({ chainId })}tx/${transactionId}` })
              }}
            />}
            {this.renderErrors({ error, errors })}
          </div>
        </Scrollbars>
      </div>
    </Page>
  }

  renderErrors ({ error, errors }) {
    if (error) {
      return <div className={styles.error}>{error}</div>
    }

    if (errors && errors[0]) {
      return <div className={styles.error}>{this.t(`errors.${errors[0]}`)}</div>
    }
  }

  changeAmount ({ amount }) {
    this.setState({
      amount
    }, _ => this.checkBalance({ amount }))
  }

  changeAsset ({ asset, tokenType, tokenId }) {
    const { amount } = this.state
    this.setState({
      currentAsset: asset,
      tokenType,
      tokenId
    }, _ => this.checkBalance({ amount }))
  }

  checkBalance ({ amount }) {
    const { items } = this.props
    const { currentAsset } = this.state
    const { balanceFormatted } = items.find(item => item.tokenAddress === currentAsset)
    this.setState({
      error: Number(balanceFormatted) < Number(amount) ? this.t('errors.balance') : null
    })
  }

  onSend () {
    const { items } = this.props
    const { sendTo, currentAsset, amount, tokenId, tokenType } = this.state
    const { decimals } = items.find(item => item.tokenAddress === currentAsset)
    if (currentAsset === ethers.constants.AddressZero) {
      this.actions().assets.sendEth({ to: sendTo, amount })
    } else {
      if (tokenType === 'erc721') {
        this.actions().assets.sendErc721({ to: sendTo, tokenId, tokenAddress: currentAsset })
      } else {
        this.actions().assets.sendErc20({ to: sendTo, amount, tokenAddress: currentAsset, decimals })
      }
    }
  }
}

export default Send
