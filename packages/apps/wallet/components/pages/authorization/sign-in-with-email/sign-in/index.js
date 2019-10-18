import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input, Button } from 'components/common'

@actions(({ authorization: { loading, errors } }) => ({ loading, errors }))
@translate('pages.authorization')
class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
  }

  render () {
    const { email, errors, signIn, startRestorePassword, loading } = this.props
    const { password } = this.state
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.signInAs')}</div>
      <div className={styles.email}>{email}</div>
      <Input
        type='password'
        className={styles.input}
        value={password}
        onChange={({ value }) => this.setState({ password: value })}
        placeholder={this.t('titles.password')}
      />
      {this.renderErrors({ errors })}
      <Button
        disabled={this.defineIfDisabled({ password, loading })}
        loading={loading}
        className={styles.button}
        onClick={_ => signIn && signIn({ email, password })}
      >
        {this.t('buttons.signIn')}
      </Button>
      <div onClick={_ => startRestorePassword && startRestorePassword()} className={styles.link}>{this.t('titles.forgotPassport')}</div>
    </div>
  }

  renderErrors ({ errors }) {
    if (!errors || errors.length === 0) {
      return null
    }
    return <div className={styles.error}>{this.t(`errors.${errors[0]}`)}</div>
  }

  defineIfDisabled ({ password, loading }) {
    return !password || password.length < 8 || loading
  }
}

export default SignIn
