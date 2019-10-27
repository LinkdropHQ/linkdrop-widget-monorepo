import React from 'react'
import { actions } from 'decorators'
import { Icons, Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import classNames from 'classnames'
import QRCode from 'qrcode.react'
import { copyToClipboard } from '@linkdrop/commons'
import variables from 'variables'

@actions(({ assets: { link } }) => ({ link }))
class ShareLink extends React.Component {
  render () {
    const { link } = this.props
    return <Page hideHeader>
      <div className={classNames(styles.container)}>
        <div className={styles.close} onClick={_ => { this.actions().assets.clearLink() }}>
          <Icons.CloseArrow fill={variables.dbBlue} />
        </div>
        <div className={styles.content}>
          <div className={styles.qr}>
            {link && <div className={styles.qrItem}>
              <QRCode size={132} value={link} />
            </div>}
          </div>

          <div className={styles.address}>
            <div className={styles.addressText}>
              {link}
            </div>
          </div>
          <div className={styles.controls}>
            <Button
              onClick={_ => copyToClipboard({ value: link })} className={styles.button}
            >Copy
            </Button>
          </div>
        </div>
      </div>
    </Page>
  }
}

export default ShareLink
