import React from 'react'
import styles from './styles.module.scss'
import gnosisLogo from 'assets/images/gnosis.png'

class Header extends React.Component {
  render () {
    return <header className={styles.container}>
      <div className={styles.headerLogo}>
        <img src={gnosisLogo} />
      </div>
    </header>
  }
}

export default Header