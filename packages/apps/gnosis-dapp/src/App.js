/* global zeroExInstant */
import React from 'react'
import WalletProvider from '@linkdrop-widget/provider'
import Web3 from 'web3'
import qs from 'querystring'
import './App.css'
import Page from './page'
import styles from './app.module.scss'
import gnosisFooterLogo from 'assets/images/gnosis-footer.png'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null,
      connected: false,
      loading: true
    }
    this.walletWindow = null
  }

  async componentDidMount () {
    const { network } = this._getParamsFromUrl()
    this.network = network
    try { 
      this._initProvider()
    } catch (err) {
      console.log('Error initing provider')
      console.log(err)
      throw err
    }

    this.setState({
      loading: false
    })
  }

  async _initProvider () {
    const urlParams = this._getParamsFromUrl()
    const network = urlParams.network
    const widgetUrl = urlParams.widgetUrl || process.env.REACT_APP_WIDGET_URL || 'http://localhost:9002'

    this.widget = new WalletProvider({
      network,
      widgetUrl
    })

    this._connect()
  }

  _getParamsFromUrl () {
    let ensName
    let widgetUrl
    let network = 'rinkeby'

    const paramsFragment = document.location.search.substr(1)
    if (paramsFragment) {
      const query = qs.parse(paramsFragment)
      network = query.network || 'rinkeby'
      ensName = query.user
      if (query.widgetUrl) {
        widgetUrl = decodeURIComponent(query.widgetUrl)
      }
    }
    return { ensName, network, widgetUrl }
  }

  async _connect () {
    try {
      console.log("enabling...")
      await this.widget.provider.enable({ open: true })

      this.web3 = new Web3(this.widget.provider)

      const accs = await this.web3.eth.getAccounts()
      const address = accs[0]
      this.setState({ address })

      const balance = await this.web3.eth.getBalance(address)
      this.setState({
        connected: true
      })

      // this._openZrxInstantModal()
    } catch (error) {
      console.log(error)
    }
  }

  _submitTestTx () {
    this.web3.eth.sendTransaction(
      {
        to: '0xF695e673d7D159CBFc119b53D8928cEca4Efe99e',
        value: 2019,
        from: this.state.address
      },
      (err, result) => {
        console.log({ err, result })
        if (result) {
          window.alert(result)
        }
      }
    )
  }

  // _openZrxInstantModal () {
  //   console.log('on submit clicked')
  //   zeroExInstant.render(
  //     {
  //       orderSource: 'https://api.radarrelay.com/0x/v2/',
  //       provider: this.widget.provider
  //     },
  //     '.page-widget'
  //   )
  // }

  _renderIfNotLoggedIn () {
    return (
      <div className={styles.container}>
        <h2 className={styles.subtitle}>Linkdrop Module Demo</h2>
        <div className={styles.description}>
          Linkdrop Module adds share-by-link<br />
          functionality to Gnosis Safe. <a target='_blank' href='https://medium.com/linkdrophq/gnosis-safe-linkdrop-module-62debd13cb4c'>Learn more</a>
        </div>
        <a
          className={styles.button}
          href='https://t.me/LinkdropGnosisBot'
          target='_blank'
        >
          Get Invite Link
        </a>
      </div>
    )
  }

  _renderButton () {
    if (this.network === 'rinkeby') {
      return (
        <button className='App-link' onClick={this._submitTestTx.bind(this)}>
          Submit Test Tx
        </button>
      )
    }

    return (
      <button
        className='App-link'
        onClick={this._openZrxInstantModal.bind(this)}
      >
        Continue
      </button>
    )
  }

  _renderIfLoggedIn () {
    return (
      <div className={styles.connected}>
        Connected to {this.state.address}
      </div>
    )
  }

  render () {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return (
      <Page>
        {this.state.connected
          ? this._renderIfLoggedIn()
          : this._renderIfNotLoggedIn()}
          <footer className={styles.footer}>
            <div className={styles.gnosisLogo}>
              <img src={gnosisFooterLogo} />
            </div>
            <div className={styles.menu}>
              <a href='https://blog.gnosis.pm/tagged/geco' target='_blank'>Funded by GECO</a>
              <a href='https://linkdrop.io' target='_blank'>About Linkdrop</a>
              <a href='https://safe.gnosis.io' target='_blank'>About Gnosis Safe</a>
            </div>
          </footer>
      </Page>
    )
  }
}

export default App
