import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import { Button } from '@linkdrop/ui-kit'

const ButtonComponent = props => <Button
  {...props}
  className={classNames(styles.container, props.className, {
    [styles.disabled]: props.disabled,
    [styles.inverted]: props.inverted,
    [styles.loading]: props.loading
  })}
/>

export default ButtonComponent
