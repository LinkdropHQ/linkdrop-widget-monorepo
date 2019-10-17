import React from 'react'
import styles from './styles.module'
import { actions, translate } from 'decorators'
import { AssetsList } from 'components/pages/common'

@actions(({ user: { chainId }, assets: { items } }) => ({ items, chainId }))
@translate('pages.assets')
class Assets extends React.Component {
  componentDidMount () {
    const { items, chainId } = this.props
    if (items === null) {
      this.actions().assets.getItems({ chainId })
    }
  }

  render () {
    return <AssetsList />
  }
}
export default Assets
