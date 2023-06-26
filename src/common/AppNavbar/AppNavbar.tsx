import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, AppLogo } from '@/common'
import { RoutesPaths } from '@/enums'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />

      <AppButton
        className='app-navbar__link'
        scheme='flat'
        text={RoutesPaths.storeOverview}
        routePath={RoutesPaths.storeOverview}
      />

      <AppButton
        className='app-navbar__link'
        scheme='flat'
        text={RoutesPaths.uiKit}
        routePath={RoutesPaths.uiKit}
      />

      <AppButton
        className='app-navbar__link'
        scheme='flat'
        text={RoutesPaths.complexForm}
        routePath={RoutesPaths.complexForm}
      />
    </div>
  )
}

export default AppNavbar
