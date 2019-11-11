import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Loading } from '@linkdrop/ui-kit'
import { AssetBalance, AssetBalanceERC721 } from 'components/common'
import ShareLink from './share-link'

@actions(({ user: { ens }, assets: { loading, items, link } }) => ({
  items,
  ens,
  loading,
  link
}))
@translate('pages.common.assetsList')
class AssetsList extends React.Component {
  render () {
    const { items, link, loading } = this.props
    return <div className={styles.container}>
      {items === null && <Loading withOverlay />}
      <ShareLink show={link} onClose={_ => this.actions().assets.clearLink()} />
      <div className={styles.assets}>
        <div className={styles.assetsContent}>
          <div className={styles.assetsContentItems}>
            {this.renderAssets({ items })}
          </div>
        </div>
      </div>
    </div>
  }

  renderAssets ({ items }) {
    if ((!items || items.length === 0)) {
      return <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.empty') }} />
    }
    const erc20Items = items.filter(item => item.type === 'erc20')
    const erc721Items = items.filter(item => item.type === 'erc721')
    const erc20Assets = erc20Items.map(({
      icon,
      symbol,
      balanceFormatted,
      tokenAddress,
      price
    }) => <AssetBalance
      key={tokenAddress}
      symbol={symbol}
      amount={balanceFormatted}
      price={price}
      icon={icon}
    />)

    const erc721Assets = erc721Items.map(({
      tokenId,
      name,
      tokenAddress: address,
      symbol,
      image
    }) => <AssetBalanceERC721
      key={`${address}_${tokenId}`}
      symbol={symbol}
      icon={image}
      name={name}
      onClick={_ => this.actions().assets.generateERC721Link({ nftAddress: address, tokenId })}
      tokenId={tokenId}
    />)

    return <div>
      {erc20Assets}
      {erc721Assets}
    </div>
  }
}

export default AssetsList
