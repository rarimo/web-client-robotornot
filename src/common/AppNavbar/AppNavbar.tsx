import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes } from 'react'

import { AppButton, AppLogo } from '@/common'
import { ICON_NAMES } from '@/enums'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />

      {config.SUPPORT_LINK && (
        <AppButton
          className='app-navbar__support-link'
          text={`Support`}
          iconLeft={ICON_NAMES.discord}
          scheme='none'
          href={config.SUPPORT_LINK}
          target='_blank'
        />
      )}
    </div>
  )
}

export default AppNavbar
