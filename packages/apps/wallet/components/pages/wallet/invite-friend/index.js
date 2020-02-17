import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'
import CopyButton from './copy-button'
import { copyToClipboard } from '@linkdrop/commons'
import { PageExpandable } from 'components/pages'

@actions(({ assets: { link } }) => ({ link }))
@translate('pages.wallet')
class InviteFriend extends React.Component {
  render () {
    const link = 'lkdp.to/WERPFISF'
    const { show, onClose } = this.props
    return <PageExpandable
      title='5$'
      show={show}
      onClose={onClose}
    >
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('texts.inviteFriends') }} />
      <div className={styles.link}>
        {link}
        <div className={styles.copyButton} onClick={_ => copyToClipboard({ value: link })}>
          <CopyButton />
        </div>
      </div>
      <Button inverted>{this.t('buttons.enableContacts')}</Button>
    </PageExpandable>
  }
}

export default InviteFriend
