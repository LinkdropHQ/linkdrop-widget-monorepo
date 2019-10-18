import React from 'react'
import styles from './styles.module'
import text from 'texts'

const Footer = _ => <div
  className={styles.container}
  dangerouslySetInnerHTML={
    {
      __html: text('common.walletHeader.texts.footer', {
        about: 'https://linkdrop.io',
        twitter: 'https://twitter.com/LinkdropHQ'
      })
    }
  }
/>

export default Footer
