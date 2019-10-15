import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Input, Button } from 'components/common'

@actions(({ authorization: { loading } }) => ({ loading }))
@translate('pages.authorization')
class VerifyScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0,
      code: ''
    }
  }

  componentDidMount () {
    this.startInterval()
  }

  startInterval () {
    this.setState({
      count: 59
    }, _ => {
      this.interval = window.setInterval(_ => {
        const { count } = this.state
        if (count === 0) { return window.clearInterval(this.interval) }
        this.setState({ count: this.state.count - 1 })
      }, 1000)
    })
  }

  render () {
    const { count, code } = this.state
    const { email, loading } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>
        {this.t('titles.verifyEmail')}
      </div>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: this.t('texts.verifyEmail', { email }) }}
      />
      <Input value={code} centered onChange={({ value }) => this.setState({ code: value })} placeholder={this.t('titles.enterCode')} />
      <Button disabled={!code} loading={loading} onClick={_ => this.onVerify({ code })} className={styles.button}>{this.t('buttons.confirm')}</Button>
      {this.renderResendButton({ count })}
    </div>
  }

  onVerify ({ code }) {
    this.actions().authorization.verifyEmail({ code })
  }

  renderResendButton ({ count }) {
    if (!count) {
      return <div onClick={_ => this.startInterval()} className={styles.link}>{this.t('titles.sendAgain')}</div>
    }
    return <div className={classNames(styles.link, styles.linkBlocked)}>{this.t('titles.sendAgainBlocked', { count })}</div>
  }
}

export default VerifyScreen
