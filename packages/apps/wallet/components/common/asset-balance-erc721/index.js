import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import classNames from 'classnames'
import { Icons } from '@linkdrop/ui-kit'

@translate('common.assetBalance')
class AssetBalanceERC721 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageType: !props.icon || props.icon === '' ? 'blank' : 'default'
    }
  }

  render () {
    const { imageType } = this.state
    const { loading, symbol, icon, name, tokenId, onClick, className } = this.props
    console.log({ icon })
    const finalImage = imageType === 'default'
      ? <img onError={_ => this.setState({ imageType: 'blank' })} className={styles.imageMain} src={icon} />
      : <Icons.Star width={30} height={30} />
    return <div
      onClick={_ => onClick && onClick()} className={classNames(styles.container, className, {
        [styles.loading]: loading
      })}
    >
      <div className={classNames(styles.image, {
        [styles.imageBlank]: imageType === 'blank'
      })}
      >
        {finalImage}
      </div>
      <div className={styles.titles}>
        <div className={styles.title}>{symbol}</div>
        <div className={styles.subtitle}>{name} #{tokenId}</div>
      </div>
    </div>
  }
}

export default AssetBalanceERC721
