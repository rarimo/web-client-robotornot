import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback } from 'react'

import { AppButton, AppLogo } from '@/common'
import { useWeb3Context } from '@/contexts'
import { EXTERNAL_PROVIDERS } from '@/contexts/Web3ProviderContext/enums'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { abbrCenter, ErrorHandler } from '@/helpers'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const { provider, init } = useWeb3Context()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [init])

  const connectWalletConnect = useCallback(async () => {
    try {
      await init(EXTERNAL_PROVIDERS.WalletConnect)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [init])

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
        className='navbar__connection-btn'
        scheme='flat'
        text={
          !provider?.isConnected
            ? `CONNECT WALLET CONNECT`
            : abbrCenter(provider?.address ?? '')
        }
        iconLeft={ICON_NAMES.qrcode}
        onClick={connectWalletConnect}
      />

      <AppButton
        className='navbar__account-link'
        iconLeft={ICON_NAMES.user}
        scheme='flat'
        size='large'
        routePath={RoutesPaths.profile}
      />

      {provider?.chainId}
    </div>
  )
}

export default AppNavbar
