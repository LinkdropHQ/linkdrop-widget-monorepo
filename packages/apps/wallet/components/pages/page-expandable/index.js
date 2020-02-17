import React from 'react'
import { actions } from 'decorators'
import classNames from 'classnames'
import styles from './styles.module'
import { Icons } from 'components/common'

@actions(({ user: { privateKey } }) => ({ privateKey }))
class PageExpandable extends React.Component {
  render () {
    const { show, onClose, title, children } = this.props
    return <div className={classNames(styles.container, {
      [styles.containerVisible]: show,
      [styles.noTitle]: !title
    })}
    >
      <div className={styles.header}>
        <div className={styles.return} onClick={_ => onClose && onClose()}>
          <Icons.CloseArrow />
        </div>
        {title}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  }
}

export default PageExpandable
