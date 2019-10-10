import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Icons, Button } from '@linkdrop/ui-kit'
import variables from 'variables'
import { Page } from 'components/pages'
import { copyToClipboard } from '@linkdrop/commons'

@translate('pages.authorization')
class SignInWithEmail extends React.Component {
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
      <Page dynamicHeader disableProfile />
    </div>
  }
}

export default SignInWithEmail
