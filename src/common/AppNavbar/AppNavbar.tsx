import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback } from 'react'

import { AppButton, AppLogo } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { abbrCenter, ErrorHandler } from '@/helpers'
import { useMetamaskZkpSnap } from '@/hooks/use-metamask-zkp-snap'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const { provider, init } = useWeb3Context()

  const { connectSnap } = useMetamaskZkpSnap()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
      await connectSnap()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [connectSnap, init])

  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />

      <AppButton
        className='navbar__connection-btn'
        scheme='flat'
        text={
          !provider?.isConnected
            ? `CONNECT METAMASK`
            : abbrCenter(provider?.address ?? '')
        }
        iconLeft={ICON_NAMES.metamask}
        onClick={connectProvider}
      />

      <AppButton
        className='navbar__account-link'
        iconLeft={ICON_NAMES.user}
        scheme='flat'
        size='large'
        routePath={RoutesPaths.profile}
      />
    </div>
  )
}

export default AppNavbar
