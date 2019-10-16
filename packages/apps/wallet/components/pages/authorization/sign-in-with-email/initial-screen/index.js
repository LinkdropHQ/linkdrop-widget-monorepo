import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input, Button } from 'components/common'

@actions(({ authorization: { loading } }) => ({ loading }))
@translate('pages.authorization')
class InitialScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  render () {
    const { startRestorePassword, checkUser, title, loading } = this.props
    const { email } = this.state
    return <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <Input className={styles.input} value={email} onChange={({ value }) => this.setState({ email: value })} placeholder={this.t('titles.email')} />
      <Button
        loading={loading}
        disabled={!email}
        className={styles.button}
        onClick={_ => checkUser && checkUser({ email })}
      >
        {this.t('buttons.signIn')}
      </Button>
    </div>
  }
}

export default InitialScreen
