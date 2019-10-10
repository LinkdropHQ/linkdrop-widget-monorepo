import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Icons, Button } from '@linkdrop/ui-kit'
import variables from 'variables'
import { Page } from 'components/pages'
import { copyToClipboard } from '@linkdrop/commons'

@translate('pages.authorization')
class OtherWallet extends React.Component {
  render () {
    const { show, onClose } = this.props
    const url = window.location.href
    return <div className={classNames(styles.container, {
      [styles.show]: show
    })}
    >
      <div className={styles.close} onClick={_ => onClose && onClose()}>
        <Icons.CloseArrow fill={variables.dbBlue} />
      </div>
      <Page dynamicHeader disableProfile>
        <div className={styles.content}>
          <div className={styles.title}>{this.t('titles.otherWallet')}</div>
          <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.otherWalletSubtitle') }} />
          <div className={styles.link}>
            {url}
          </div>
          <Button onClick={_ => copyToClipboard({ value: url })} className={styles.button}>{this.t('buttons.copyLink')}</Button>
        </div>
      </Page>
    </div>
  }
}

export default OtherWallet
