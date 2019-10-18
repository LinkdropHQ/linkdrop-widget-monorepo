import React from 'react'
import { translate, actions } from 'decorators'
import commonStyles from '../styles.module'
import { Confetti, TokensAmount } from 'components/common'
import { Alert, Icons, Button, Loading } from '@linkdrop/ui-kit'
import { getCurrentAsset } from 'helpers'
import styles from './styles.module'
import { getHashVariables } from '@linkdrop/commons'
import classNames from 'classnames'

@actions(({
  assets: {
    items,
    itemsToClaim
  }, user: {
    chainId
  }, tokens: {
    transactionId
  }
}) => ({
  items,
  chainId,
  transactionId,
  itemsToClaim
}))
@translate('pages.claim')
class ClaimingFinishedPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showButton: false,
      iconType: 'default',
      showConfetti: props.claimingFinished
    }
  }

  componentDidMount () {
    window.setTimeout(_ => this.setState({ showButton: true }), 4000)
  }

  render () {
    const { itemsToClaim, loading, claimingFinished, alreadyClaimed, chainId, transactionId } = this.props
    const { showConfetti, showButton } = this.state
    const { nftAddress } = getHashVariables()
    const assetToShow = getCurrentAsset({ itemsToClaim })
    if (!assetToShow) { return <Loading withOverlay /> }
    const { balanceFormatted, icon, symbol } = assetToShow
    const { iconType } = this.state
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={icon} /> : <Icons.Star />

    return <div className={commonStyles.container}>
      {showConfetti && <Confetti recycle={!showButton} onConfettiComplete={_ => this.setState({ showConfetti: false })} />}
      {loading && <Loading withOverlay />}
      <Alert
        noBorder={iconType === 'default' && symbol !== 'ETH'} className={classNames(styles.tokenIcon, {
          [styles.tokenIconNft]: nftAddress && iconType === 'default'
        })} icon={finalIcon}
      />
      <div className={styles.title}>
        <span>{balanceFormatted}</span> {symbol}
      </div>
      {this.renderDappButton({
        showButton,
        alreadyClaimed,
        claimingFinished,
        symbol,
        chainId,
        transactionId,
        balanceFormatted
      })}
    </div>
  }

  renderDappButton ({
    showButton,
    alreadyClaimed,
    claimingFinished,
    symbol,
    chainId,
    transactionId,
    balanceFormatted
  }) {
    if (!showButton) {
      return <TokensAmount
        chainId={chainId}
        transactionId={transactionId}
        alreadyClaimed={alreadyClaimed}
        claimingFinished={claimingFinished}
        symbol={symbol}
        amount={balanceFormatted}
      />
    }
    return <Button
      className={styles.button}
      onClick={() => {
        window.location.href = '/#/'
        this.actions().widget.hide()
      }}
    >
      {this.t('buttons.continue')}
    </Button>
  }
}

export default ClaimingFinishedPage
