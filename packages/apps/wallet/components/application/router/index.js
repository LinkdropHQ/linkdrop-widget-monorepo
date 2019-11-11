import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Claim, NotFound, Wallet, Confirm, Send, Receive, BuyTokens } from 'components/pages'
import './styles'
import { getHashVariables } from '@linkdrop/commons'

import { actions } from 'decorators'
@actions(({ user: { sdk, privateKey, loading, loacale } }) => ({
  sdk,
  loading,
  loacale,
  privateKey
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ privateKey }) {
    const { privateKey: prevPrivateKey } = this.props
    if (privateKey && !prevPrivateKey) {
      this.actions().assets.getItems()
    }
  }

  componentDidMount () {
    const { sdk, privateKey } = this.props
    if (!sdk) {
      const {
        linkdropMasterAddress
      } = getHashVariables()
      this.actions().user.createSdk({ linkdropMasterAddress })
    }
    const interval = window.checkAssets
    if (interval) {
      interval && window.clearInterval(interval)
    }
    if (privateKey) {
      this.actions().assets.getItems()
    }
    window.checkAssets = window.setInterval(_ => {
      const { privateKey } = this.props
      if (!privateKey) { return }
      this.actions().assets.getItems()
    }, 10000)
  }

  componentWillUnmount () {
    const interval = window.checkAssets
    if (interval) {
      interval && window.clearInterval(interval)
    }
  }

  render () {
    return <Switch>
      <Route path='/receive' component={Claim} />
      <Route path='/confirm' component={Confirm} />
      <Route path='/get' component={Receive} />
      <Route path='/send' component={Send} />
      <Route path='/buy-tokens' component={BuyTokens} />
      <Route path='/' component={Wallet} />
      <Route path='*' component={NotFound} />
    </Switch>
  }
}

export default AppRouter
