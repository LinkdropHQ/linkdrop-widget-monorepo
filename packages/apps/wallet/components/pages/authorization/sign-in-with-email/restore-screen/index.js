import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'

@translate('pages.authorization')
class RestoreScreen extends React.Component {
  render () {
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.restoreWallet')}</div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts.restoreWallet') }} />
      <Button className={styles.button}>{this.t('buttons.contactUs')}</Button>
      <div className={styles.link} dangerouslySetInnerHTML={{ __html: this.t('titles.sendToEmail', { email: 'help@linkdrop.io' }) }} />
    </div>
  }
}

export default RestoreScreen
