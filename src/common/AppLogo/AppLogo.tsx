import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes } from 'react'

const AppLogo: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`app-logo ${className}`} {...rest}>
      <img src='/branding/logo.svg' alt={config.APP_NAME} />
    </div>
  )
}

export default AppLogo
