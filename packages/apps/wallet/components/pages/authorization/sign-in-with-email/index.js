import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Icons } from '@linkdrop/ui-kit'
import variables from 'variables'
import { Page } from 'components/pages'
import InitialScreen from './initial-screen'
import RestoreScreen from './restore-screen'
import SignIn from './sign-in'
import SignUp from './sign-up'

@actions(({ authorization: { screen } }) => ({ screen }))
@translate('pages.authorization')
class SignInWithEmail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  render () {
    const { show, onClose, title, screen } = this.props
    const { email } = this.state
    return <div className={classNames(styles.container, {
      [styles.show]: show
    })}
    >
      <div className={styles.close} onClick={_ => this.onClose({ onClose, screen })}>
        <Icons.CloseArrow fill={variables.dbBlue} />
      </div>
      <Page dynamicHeader disableProfile>
        {this.renderContent({ screen, email, title })}
      </Page>
    </div>
  }

  onClose ({ screen, onClose }) {
    if (screen === 'sign-in' || screen === 'sign-up' || screen === 'restore' || screen === 'success') {
      return this.actions().authorization.setScreen({ screen: 'initial' })
    }

    return onClose && onClose()
  }

  renderContent ({ screen, email, title }) {
    switch (screen) {
      case 'initial':
        return <InitialScreen
          title={title}
          checkUser={({ email }) => {
            return this.setState({ email }, _ => {
              this.actions().authorization.checkEmail({ email })
            })
          }}
        />
      case 'sign-in':
        return <SignIn
          email={email}
          startRestorePassword={_ => this.actions().authorization.setScreen({ screen: 'restore' })}
          signIn={({ email, password }) => this.actions().authorization.signIn({ email, password })}
        />
      case 'sign-up':
        return <SignUp
          email={email}
          signUp={({ email, password }) => this.actions().authorization.signUp({ email, password })}
        />
      case 'success':
        return <div>success</div>
      case 'restore':
        return <RestoreScreen />
    }
  }
}

export default SignInWithEmail
