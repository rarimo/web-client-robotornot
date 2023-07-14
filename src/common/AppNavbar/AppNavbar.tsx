import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback } from 'react'

import { AppButton, AppLogo } from '@/common'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const { provider, init: initProvider } = useWeb3Context()

  const {
    isSnapConnected,
    connectSnap,
    init: initZkpSnap,
  } = useMetamaskZkpSnapContext()

  const connectProvider = useCallback(async () => {
    try {
      await initProvider(PROVIDERS.Metamask)

      const { isSnapConnected, isFlaskDetected } = await initZkpSnap()

      if (!isFlaskDetected) {
        bus.emit(BUS_EVENTS.error, `Please install Metamask flask first`)
      }

      if (isFlaskDetected && !isSnapConnected) {
        await connectSnap()

        await initZkpSnap()
      }
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [connectSnap, initProvider, initZkpSnap])

  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />

      <AppButton
        className='navbar__connection-btn'
        scheme='flat'
        text={
          !provider?.isConnected || !isSnapConnected
            ? `CONNECT`
            : abbrCenter(provider?.address ?? '')
        }
        iconLeft={ICON_NAMES.metamask}
        onClick={connectProvider}
        isDisabled={provider?.isConnected && isSnapConnected}
      />
    </div>
  )
}

export default AppNavbar
