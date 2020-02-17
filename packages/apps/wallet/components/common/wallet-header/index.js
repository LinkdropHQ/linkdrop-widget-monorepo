import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Icons } from '@linkdrop/ui-kit'
import CloseArrow from 'components/common/icons/close-arrow'
import classNames from 'classnames'
import Menu from './menu'
import Footer from './footer'
import Name from './name'
import { AvatarIcon } from 'components/common'
import { Scrollbars } from 'react-custom-scrollbars'
import variables from 'variables'
import { prepareRedirectUrl } from 'helpers'

@actions(({ user: { email, avatar, chainId } }) => ({ chainId, email, avatar }))
@translate('common.walletHeader')
class WalletHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  render () {
    const { opened } = this.state
    const { avatar, email, chainId, disableProfile } = this.props

    return <div className={classNames(styles.container, {
      [styles.opened]: opened
    })}
    >
      <div className={styles.header}>
        {!disableProfile && <div
          className={styles.headerIcon} onClick={_ => this.setState({
            opened: !opened
          })}
        >
          {this.renderProfileIcon({ avatar })}
        </div>}
        <a href={prepareRedirectUrl({ link: '/#/' })}>{this.t('titles.wallet')}</a>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyHeader}>
          <div className={styles.bodyHeaderQrIcon} onClick={_ => { window.location.href = prepareRedirectUrl({ link: '/#/get' }) }}>
            <Icons.Qr />
          </div>
          <div className={styles.email}>
            {email}
          </div>
          <div
            className={styles.bodyHeaderCloseIcon} onClick={_ => this.setState({
              opened: !opened
            })}
          >
            <CloseArrow />
          </div>
        </div>
        <div className={styles.bodyMain}>
          <Scrollbars style={{
            height: 'calc(100vh - 90px)',
            width: '100%'
          }}
          >
            <Menu />
            <Footer />
          </Scrollbars>
        </div>
      </div>
    </div>
  }

  renderProfileIcon ({ avatar }) {
    if (!avatar || avatar === 'undefined') {
      return <AvatarIcon fill={variables.dbBlue} />
    }
    return <div
      className={classNames(styles.avatar, styles.avatarSmall)}
      style={{ backgroundImage: `url(${avatar})` }}
    />
  }

  renderName ({ ens, chainId }) {
    if (ens) { return <Name ens={ens} chainId={chainId} /> }
  }
}

export default WalletHeader
