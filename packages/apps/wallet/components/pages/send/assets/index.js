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
      onChange && onChange({ currentAsset: items[0].tokenAddress })
    }
  }

  render () {
    const { expanded } = this.state
    const { items, currentAsset, onChange } = this.props
    if (!items || items.length === 0) { return null }
    const height = expanded ? `${(items.length * (40 + 15) + 30 - 15)}px` : '70px'
    const style = { height }
    items.sort((a, b) => {
      if (b.tokenAddress === currentAsset) { return 1 }
      if (a.tokenAddress === currentAsset) { return -1 }
      return 0
    })
    const assetsList = this.createAssetsList({ items, onChange })
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
    />)
  }
}

export default Assets
