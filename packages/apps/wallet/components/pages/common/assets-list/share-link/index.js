import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { PageExpandable } from 'components/pages'
import QRCode from 'qrcode.react'
import { copyToClipboard } from '@linkdrop/commons'

@actions(({ assets: { link } }) => ({ link }))
@translate('pages.common.assetsList')
class ShareLink extends React.Component {
  render () {
    const { link, show, onClose } = this.props
    return <PageExpandable show={show} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.qr}>
          {link && <div className={styles.qrItem}>
            <QRCode size={132} value={link} />
          </div>}
        </div>

        <div className={styles.address}>
          <div className={styles.addressTitle}>{this.t('titles.copyLink')}</div>
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
    </PageExpandable>
  }
}

export default ShareLink
