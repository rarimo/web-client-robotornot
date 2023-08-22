import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

import { useZkpContext } from '@/contexts'
import { RoutesPaths } from '@/enums'

const AppLogo: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const { isUserSubmittedZkp, verifiableCredentials } = useZkpContext()

  return (
    <div className={`app-logo ${className}`} {...rest}>
      <img src='/branding/logo.svg' alt={config.APP_NAME} />
      {isUserSubmittedZkp.get || verifiableCredentials ? (
        <></>
      ) : (
        <Link className='app-logo__link' to={RoutesPaths.authProviders} />
      )}
    </div>
  )
}

export default AppLogo
