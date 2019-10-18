import React from 'react'
import { Alert, Icons, Button, Loading } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { getCurrentAsset } from 'helpers'
import text from 'texts'
import { getHashVariables } from '@linkdrop/commons'
import classNames from 'classnames'
import styles from './styles.module'
import commonStyles from '../styles.module'

@translate('pages.claim')
class InitialPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      iconType: 'default'
    }
  }

  render () {
    const { onClick, loading, wallet, itemsToClaim } = this.props
    const assetToShow = getCurrentAsset({ itemsToClaim })
    const { nftAddress } = getHashVariables()
    if (!assetToShow) { return <Loading /> }
    const { balanceFormatted, icon, symbol } = assetToShow
    const { iconType } = this.state
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={icon} /> : <Icons.Star />
    return <div className={commonStyles.container}>
      <Alert
        noBorder={iconType === 'default' && symbol !== 'ETH'} className={classNames(styles.tokenIcon, {
          [styles.tokenIconNft]: nftAddress && iconType === 'default'
        })} icon={finalIcon}
      />
      <div className={styles.title}>
        <span>{balanceFormatted}</span> {symbol}
      </div>
      <Button disabled={loading} className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
    </div>
  }
}

export default InitialPage
