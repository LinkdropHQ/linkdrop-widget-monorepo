import React from 'react'
import { Header } from '@linkdrop/ui-kit'
import { WalletHeader, MoonpayWidget } from 'components/common'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import classNames from 'classnames'

@actions(({ user: { moonpayShow } }) => ({ moonpayShow }))
@translate('pages.page')
class Page extends React.Component {
  render () {
    const { disableFlex, dynamicHeader, moonpayShow, children, hideHeader, disableProfile } = this.props
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
