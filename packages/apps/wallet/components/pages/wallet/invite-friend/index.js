import React from 'react'
import { actions, translate } from 'decorators'
import classNames from 'classnames'
import styles from './styles.module'
import { Icons } from '@linkdrop/ui-kit'
import { Button } from 'components/common'
import variables from 'variables'
import CopyButton from './copy-button'
import { copyToClipboard } from '@linkdrop/commons'

@actions(({ assets: { link } }) => ({ link }))
@translate('pages.wallet')
class InviteFriend extends React.Component {
  render () {
    const link = 'lkdp.to/WERPFISF'
    const { show, onClose } = this.props
    return <div className={classNames(styles.container, {
      [styles.containerVisible]: show
    })}
    >
      <div className={styles.header}>
        <div className={styles.return} onClick={_ => onClose && onClose()}>
          <Icons.CloseArrow fill={variables.dbBlue} />
        </div>
        5$
      </div>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('texts.inviteFriends') }} />
      <div className={styles.link}>
        {link}
        <div className={styles.copyButton} onClick={_ => copyToClipboard({ value: link })}>
          <CopyButton />
        </div>
      </div>
      <Button inverted>{this.t('buttons.enableContacts')}</Button>
    </div>
  }
}

export default InviteFriend
