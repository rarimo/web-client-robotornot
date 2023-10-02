import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppLogo } from '@/common'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />
    </div>
  )
}

export default AppNavbar
