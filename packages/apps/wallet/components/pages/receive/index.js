import React from 'react'
import { actions, translate } from 'decorators'
import { Icons, Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import classNames from 'classnames'
import QRCode from 'qrcode.react'
import { copyToClipboard, defineEtherscanUrl } from '@linkdrop/commons'
import { prepareRedirectUrl } from 'helpers'

@actions(({ user: { loading, wallet, chainId }, assets: { items } }) => ({ wallet, items, loading, chainId }))
@translate('pages.receive')
class Receive extends React.Component {
  render () {
    const { wallet, chainId } = this.props
    return <Page hideHeader>
      <div className={classNames(styles.container)}>
        <div className={styles.close} onClick={_ => { window.location.href = prepareRedirectUrl({ link: '/#/' }) }}>
          <Icons.Cross />
        </div>
        <div className={styles.content}>
          <div className={styles.qr}>
            {wallet && <div className={styles.qrItem}>
              <QRCode size={132} value={wallet} />
            </div>}
          </div>

          <div className={styles.address}>
            <div className={styles.addressText}>
              {wallet}
              <a target='_blank' href={`${defineEtherscanUrl({ chainId })}address/${wallet}`}>
                <span className={styles.addressCheck}>i</span>
              </a>
            </div>
          </div>
          {/* hidden for better times */}
          {false && <div className={styles.controls}>
            <Button
              onClick={_ => copyToClipboard({ value: wallet })} className={styles.button}
            >Copy
            </Button>
          </div>}
        </div>
      </div>
    </Page>
  }
}

export default Receive
