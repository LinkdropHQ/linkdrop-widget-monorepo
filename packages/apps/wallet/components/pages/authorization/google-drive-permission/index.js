import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Button } from 'components/common'

@actions(({ authorization: { loading, errors } }) => ({
  loading,
  errors
}))
@translate('pages.authorization')
class GoogleDrivePermission extends React.Component {
  render () {
    const { enableDrivePermissions, errors, loading } = this.props
    if (errors && errors.length > 0) {
      return this.renderErrorPage({ enableDrivePermissions, loading })
    }
    return <div className={styles.container}>
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.grantGoogleDrive') }} />
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts.googleDrive') }} />
      <Button loading={loading} className={styles.button} onClick={_ => enableDrivePermissions && enableDrivePermissions()}>
        {this.t('buttons.secure')}
      </Button>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.googleDriveAttention') }} />
    </div>
  }

  renderErrorPage ({ enableDrivePermissions, loading }) {
    return <div className={styles.container}>
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.oops') }} />
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts.grantPermission') }} />
      <Button loading={loading} className={styles.button} onClick={_ => enableDrivePermissions && enableDrivePermissions()}>
        {this.t('buttons.grant')}
      </Button>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.googleDriveAttention') }} />
    </div>
  }
}

export default GoogleDrivePermission
