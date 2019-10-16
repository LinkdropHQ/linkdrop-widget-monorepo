import React from 'react'
import { RetinaImage } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import { Button } from 'components/common'
import { getEns, getImages } from 'helpers'
import { actions, translate } from 'decorators'
import gapiService from 'data/api/google-api'
import SignInWithEmail from './sign-in-with-email'
import GoogleDrivePermission from './google-drive-permission'

@actions(({ user: { sdk, privateKey, contractAddress, ens, loading, chainId } }) => ({
  loading,
  sdk,
  contractAddress,
  privateKey,
  ens,
  chainId
}))
@translate('pages.authorization')
class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enableAuthorize: false,
      authorized: false,
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
    const { authorized } = this.state
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

  // async _syncPrivateKeyWithDrive () {
  //   const {
  //     chainId
  //   } = this.props
  //   const { email, avatar } = gapiService.getEmailAndAvatar()

  //   // fetching files from Drive
  //   const fetchResult = await gapiService.fetchFiles({ chainId })
  //   let data
  //   if (fetchResult.success && fetchResult.data[`_${chainId}`]) {
  //     data = fetchResult.data[`_${chainId}`]
  //   } else { // if no files on drive upload new ones
  //     const ens = getEns({ email, chainId })
  //     const { contractAddress, privateKey } = this.props
  //     const uploadResult = await gapiService.uploadFiles({ chainId, ens, contractAddress, privateKey })
  //     data = uploadResult.data
  //   }
  //   const { privateKey, contractAddress, ens } = data
  //   this.actions().user.setUserData({ privateKey, contractAddress, ens, avatar, chainId })
  // }

  enableDrivePermissions () {
    this.actions().authorization.enableGDrivePermissions()
    // try {
    //   this.setState({ accessingDrive: true })
    //   await gapiService.enableDrivePermissions()
    //   await this._syncPrivateKeyWithDrive()
    //   this.setState({ accessingDrive: false })
    // } catch (err) {
    //   this.setState({ accessingDrive: false })
    //   this.actions().authorization.setErrors({
    //     errors: ['SOME_ERROR_OCCURED_WITH_GDRIVE']
    //   })
    // }
  }

  renderGoogleDriveScreen () {
    const { accessingDrive } = this.state
    return <GoogleDrivePermission accessingDrive={accessingDrive} enableDrivePermissions={_ => this.enableDrivePermissions()} />
  }

  async handleAuthClick () {
    const isSignedIn = await gapiService.signIn()
    if (isSignedIn) {
      // if has drive permissions sync with it immediately
      if (gapiService.hasDrivePermissions()) {
        await this._syncPrivateKeyWithDrive()
      } else {
        // otherwise show screen to enable permissions
        this.setState({
          authorized: true
        })
      }
    }
  }

  renderAuthorizationScreen () {
    const { loading } = this.props
    const { enableAuthorize, signInWithWallet, createWallet } = this.state
    return <div className={styles.container}>
      <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.signIn') }} />
      <SignInWithEmail
        show={signInWithWallet || createWallet}
        title={this.t(`titles.${createWallet ? 'createWalletTitle' : 'signInTitle'}`)}
        onClose={_ => this.setState({ signInWithWallet: false, createWallet: false })}
      />
      <Button loadingClassName={styles.buttonLoading} className={styles.button} inverted loading={!enableAuthorize || loading} onClick={e => this.handleAuthClick(e)}>
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
