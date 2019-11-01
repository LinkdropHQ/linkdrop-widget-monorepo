import React from 'react'
import { Header } from '@linkdrop/ui-kit'
import { WalletHeader, MoonpayWidget, Note } from 'components/common'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import classNames from 'classnames'

@actions(({ user: { showNote, moonpayShow, privateKey } }) => ({ showNote, moonpayShow, privateKey }))
@translate('pages.page')
class Page extends React.Component {
  componentDidMount () {
    const { privateKey } = this.props

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

  componentWillReceiveProps ({ privateKey }) {
    const { privateKey: prevPrivateKey } = this.props
    if (privateKey && !prevPrivateKey) {
      this.actions().assets.getItems()
    }
  }

  render () {
    const { disableFlex, dynamicHeader, moonpayShow, children, hideHeader, disableProfile, note } = this.props
    return <div className={classNames(styles.container, {
      [styles.hideHeader]: hideHeader
    })}
    >
      {this.renderHeader({ hideHeader, dynamicHeader, disableProfile })}
      <div
        className={classNames(styles.main, {
          [styles.disableFlex]: disableFlex
        })}
        style={{ height: 'calc(100vh - 90px)' }}
      >
        {children}
      </div>
      {moonpayShow && <MoonpayWidget onClose={_ => this.actions().user.setMoonpayShow({ moonpayShow: false })} />}
    </div>
  }

  renderHeader ({ hideHeader, dynamicHeader, disableProfile }) {
    if (hideHeader) { return null }
    if (dynamicHeader) { return <WalletHeader disableProfile={disableProfile} /> }
    return <Header title={this.t('titles.getTokens')} />
  }
}

export default Page
