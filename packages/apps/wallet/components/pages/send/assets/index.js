import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Icons } from '@linkdrop/ui-kit'
import { AssetBalance } from 'components/common'
import classNames from 'classnames'

@actions(({ user: { loading }, assets: { items } }) => ({ items, loading }))
@translate('pages.send')
class Assets extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  componentsWillReceiveProps ({ items }) {
    const { items: prevItems, onChange } = this.props
    if (items && items.length > 0 && (!prevItems || prevItems.length === 0)) {
      const currentAsset = items[0].tokenAddress
      onChange && onChange({
        currentAsset,
        tokenId: currentAsset.tokenId
      })
    }
  }

  render () {
    const { expanded } = this.state
    const { items, currentAsset, onChange, tokenId, tokenType } = this.props
    if (!items || items.length === 0) { return null }
    const height = expanded ? `${(items.length * 55 + 15)}px` : '70px'
    const style = { height }
    const mainAsset = this.defineCurrentAsset({ items, tokenType, tokenId, currentAsset })
    const otherAssets = this.defineOtherAssets({ items, tokenType, tokenId, currentAsset })

    const assetsList = this.createAssetsList({ items: [mainAsset].concat(otherAssets), onChange })
    return <div
      style={style}
      onClick={e => {
        e.stopPropagation()
        this.setState({ expanded: !expanded })
      }}
      className={classNames(styles.container, { [styles.expanded]: expanded })}
    >
      <div
        className={styles.arrow}
      >
        <Icons.ExpandArrow />
      </div>
      {assetsList}
    </div>
  }

  defineCurrentAsset ({ items, tokenType, tokenId, currentAsset }) {
    if (!currentAsset) {
      return items[0]
    }
    if (tokenType === 'erc721') {
      return items.find(asset => asset.tokenId === tokenId && asset.tokenAddress === currentAsset)
    }
    return items.find(asset => asset.tokenAddress === currentAsset)
  }

  defineOtherAssets ({ items, tokenType, tokenId, currentAsset }) {
    if (!currentAsset) {
      return items.filter((asset, idx) => idx !== 0)
    }
    if (tokenType === 'erc721') {
      return items.filter(asset => !(asset.tokenId === tokenId && asset.tokenAddress === currentAsset))
    }
    return items.filter(asset => asset.tokenAddress !== currentAsset)
  }

  createAssetsList ({ items, onChange }) {
    // const erc20Items = items.filter(item => item.type === 'erc20')
    return items.map(({
      icon,
      symbol,
      balanceFormatted,
      tokenAddress,
      price,
      type,
      tokenId,
      image
    }) => <AssetBalance
      onClick={_ => {
        this.setState({
          expanded: false
        }, _ => onChange && onChange({
          currentAsset: tokenAddress,
          tokenType: type,
          tokenId
        }))
      }}
      image={image}
      type={type}
      key={`${tokenAddress}${tokenId ? `_${tokenId}` : ''}`}
      className={styles.asset}
      symbol={symbol}
      amount={balanceFormatted}
      price={price}
      icon={icon}
      tokenId={tokenId}
    />)
  }
}

export default Assets
