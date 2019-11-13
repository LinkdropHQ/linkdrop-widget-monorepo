import React from 'react'
import { actions, translate } from 'decorators'
import { Input } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { PageExpandable } from 'components/pages'
import { AssetBalance, Button } from 'components/common'
import { ethers } from 'ethers'

@actions(({ assets: { items } }) => ({ items }))
@translate('pages.common.assetsList')
class LinkData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: 0
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { items, show } = nextProps
    const { amount } = nextState
    const { items: prevItems, show: prevShow } = this.props
    const { amount: prevAmount } = this.state
    if (prevItems !== null && items !== null && prevShow === show && amount === prevAmount) { return false }
    return true
  }

  render () {
    const { items, currentAsset, show, onClose } = this.props
    const { amount } = this.state
    const asset = this.defineCurrentAsset({ items, currentAsset })
    return <PageExpandable show={show} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Input
            centered
            type='number'
            numberInput
            value={amount}
            className={styles.input}
            onChange={({ value }) => {
              this.setState({
                amount: parseFloat(value)
              })
            }}
          />
        </div>

        <div className={styles.body}>
          {this.getAsset({ asset })}
        </div>

        <div className={styles.controls}>
          <Button
            onClick={_ => {
              if (currentAsset === ethers.constants.AddressZero) {
                this.actions().assets.generateETHLink({ amount })
              } else {
                this.actions().assets.generateERC20Link({
                  tokenAddress: currentAsset,
                  amount,
                  decimals: asset.decimals
                })
              }
            }}
            disable={Number(amount) === 0 || isNaN(Number(amount))}
          >
            {this.t('buttons.createLink')}
          </Button>
        </div>
      </div>
    </PageExpandable>
  }

  getAsset ({ asset }) {
    if (!asset) { return null }
    const {
      icon,
      symbol,
      balanceFormatted,
      tokenAddress,
      price
    } = asset
    return <AssetBalance
      symbol={symbol}
      amount={balanceFormatted}
      price={price}
      onClick={_ => this.setState({
        showLinkDetails: true,
        currentAsset: tokenAddress
      })}
      icon={icon}
    />
  }

  defineCurrentAsset ({ items, currentAsset }) {
    if (!items || !currentAsset) { return null }
    const asset = items.find(item => (item.tokenAddress).toLowerCase() === currentAsset.toLowerCase())
    if (!asset) { return null }
    return asset
  }
}

export default LinkData
