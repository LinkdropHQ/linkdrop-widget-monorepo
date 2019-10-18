import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input, Button } from 'components/common'

@actions(({ authorization: { loading } }) => ({ loading }))
@translate('pages.authorization')
class SetPasswordScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      passwordConfirm: ''
    }
  }

  render () {
    const { email, signUp, loading } = this.props
    const { password, passwordConfirm } = this.state
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.choosePassword')}</div>
      <Input
        type='password'
        onChange={({ value }) => this.setState({ password: value })}
        placeholder={this.t('titles.password')}
      />
      <Input
        type='password'
        className={styles.confirmInput}
        onChange={({ value }) => this.setState({ passwordConfirm: value })}
        placeholder={this.t('titles.passwordConfirm')}
      />
      <div className={styles.note}>
        {this.t('titles.passwordLength')}
      </div>
      <Button
        loading={loading}
        disabled={this.defineIfDisabled({ password, passwordConfirm, loading })}
        className={styles.button}
        onClick={_ => signUp && signUp({ email, password })}
      >
        {this.t('buttons.signUp')}
      </Button>
    </div>
  }

  defineIfDisabled ({ password, passwordConfirm, loading }) {
    return !password ||
      !passwordConfirm ||
      password !== passwordConfirm ||
      password.length < 8 ||
      loading
  }
}

export default SetPasswordScreen
