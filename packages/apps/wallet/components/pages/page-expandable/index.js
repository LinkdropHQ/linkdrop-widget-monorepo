import React from 'react'
import { actions } from 'decorators'
import classNames from 'classnames'
import styles from './styles.module'
import { Icons } from 'components/common'

@actions(({ user: { privateKey } }) => ({ privateKey }))
class PageExpandable extends React.Component {
  componentDidMount () {
    const { privateKey } = this.props

    const interval = window.checkAssets
    if (interval) {
      interval && window.clearInterval(interval)
    }
    if (privateKey) {
      this.actions().assets.getItems()
    }
    window.checkAssets = window.setInterval(_ => {
      const { privateKey } = this.props
      if (!privateKey) { return }
      this.actions().assets.getItems()
    }, 10000)
  }

  componentWillReceiveProps ({ privateKey }) {
    const { privateKey: prevPrivateKey } = this.props
    if (privateKey && !prevPrivateKey) {
      this.actions().assets.getItems()
    }
  }

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
