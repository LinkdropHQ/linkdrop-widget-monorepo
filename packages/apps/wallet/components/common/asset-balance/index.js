import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import classNames from 'classnames'
import { roundAmount } from 'helpers'
import { multiply, bignumber } from 'mathjs'
import { Icons } from '@linkdrop/ui-kit'

@translate('common.assetBalance')
class AssetBalance extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      iconType: 'default'
    }
  }

  render () {
    const { iconType } = this.state
    const { loading, symbol, amount, onClick, icon, type, tokenAddress, price, className, image } = this.props
    if (type === 'erc721') {
      return this.renderTokenERC721({ symbol, icon: image, iconType, onClick, loading, className })
    }
    return this.renderTokenERC20({ symbol, icon, iconType, onClick, loading, className, amount, price })
  }

  renderTokenERC721 ({ symbol, icon, iconType, onClick, loading, className }) {
    console.log({ icon })
    const image = this.renderImage({ iconType, icon })
    return this.renderBody({ image, onClick, loading, symbol, className, iconType })
  }

  renderTokenERC20 ({ symbol, icon, iconType, onClick, loading, className, amount, price }) {
    const image = this.renderImage({ iconType, icon })
    const priceData = this.renderPriceData({ amount, price })
    return this.renderBody({ image, onClick, loading, symbol, className, iconType, priceData })
  }

  renderImage ({ iconType, icon }) {
    return iconType === 'default'
      ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.iconImg} src={icon} />
      : <Icons.Star width={30} height={30} />
  }

  renderBody ({ image, onClick, loading, symbol, className, iconType, priceData }) {
    return <div
      onClick={_ => onClick && onClick()} className={classNames(styles.container, className, {
        [styles.loading]: loading,
        [styles.eth]: symbol === 'ETH'
      })}
    >
      <div className={classNames(styles.icon, {
        [styles.iconBlank]: iconType === 'blank'
      })}
      >
        {image}
      </div>
      <div className={styles.symbol}>{symbol}</div>
      {priceData}
    </div>
  }

  renderPriceData ({ amount, price }) {
    if (!amount) { return null }
    const finalPrice = String(multiply(bignumber(price), bignumber(amount)))
    return <>
      {amount && <div className={styles.amount}>{roundAmount({ amount })}</div>}
      <span className={styles.divider}>/</span>
      <div className={styles.price}>${roundAmount({ amount: finalPrice, roundTo: 100 })}</div>
    </>
  }
}

export default AssetBalance
