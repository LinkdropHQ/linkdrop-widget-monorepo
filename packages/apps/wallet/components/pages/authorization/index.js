import React from 'react'
import { RetinaImage } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import { Button } from 'components/common'
import { getImages } from 'helpers'
import { actions, translate } from 'decorators'
import gapiService from 'data/api/google-api'
import SignInWithEmail from './sign-in-with-email'
import GoogleDrivePermission from './google-drive-permission'

@actions(({ authorization: { authorized, loading: authorizationLoading }, user: { sdk, privateKey, contractAddress, ens, loading, chainId } }) => ({
  loading,
  sdk,
  contractAddress,
  privateKey,
  ens,
  chainId,
  authorized,
  authorizationLoading
}))
@translate('pages.authorization')
class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enableAuthorize: false,
      accessingDrive: false
    }
  }

  componentDidMount () {
    this.actions().user.createWallet()
    this._loadGoogleApi()
  }

  componentWillReceiveProps ({ privateKey, contractAddress }) {
    const { contractAddress: prevContractAddress, privateKey: prevPrivateKey } = this.props
    if (privateKey && contractAddress && !prevContractAddress && !prevPrivateKey) {
      // load google api
      this._loadGoogleApi()
    }
  }

  render () {
    const { authorized } = this.props
    return <Page dynamicHeader disableProfile>
      {authorized ? this.renderGoogleDriveScreen() : this.renderAuthorizationScreen()}
    </Page>
  }

  async _loadGoogleApi () {
    await gapiService.load()
    // Handle the initial sign-in state.
    this.setState({
      enableAuthorize: true
    })
  }

  enableDrivePermissions () {
    this.actions().authorization.enableGDrivePermissions()
  }

  renderGoogleDriveScreen () {
    const { accessingDrive } = this.state
    return <GoogleDrivePermission accessingDrive={accessingDrive} enableDrivePermissions={_ => this.enableDrivePermissions()} />
  }

  renderAuthorizationScreen () {
    const { loading, authorizationLoading } = this.props
    const { enableAuthorize, signInWithWallet, createWallet } = this.state
    return <div className={styles.container}>
      <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.signIn') }} />
      <SignInWithEmail
        show={signInWithWallet || createWallet}
        title={this.t(`titles.${createWallet ? 'createWallet' : 'emailSignIn'}`)}
        onClose={_ => this.setState({ signInWithWallet: false, createWallet: false })}
      />
      <Button
        loadingClassName={styles.buttonLoading}
        className={styles.button}
        inverted
        loading={!enableAuthorize || loading || authorizationLoading}
        onClick={e => this.actions().authorization.signInWithGoogle()}
      >
        <RetinaImage width={30} {...getImages({ src: 'google' })} />
        {this.t('titles.googleSignIn')}
      </Button>
      <Button className={styles.button} inverted onClick={e => { this.setState({ signInWithWallet: true }) }}>
        {this.t('titles.emailSignIn')}
      </Button>
      <div
        onClick={_ => { this.setState({ createWallet: true }) }}
        className={styles.link}
      >
        {this.t('titles.createWallet')}
      </div>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.backup', { href: 'https://www.notion.so/linkdrop/Help-Center-9cf549af5f614e1caee6a660a93c489b#d0a28202100d4512bbeb52445e6db95b' }) }} />
    </div>
  }
}
export default Authorization
