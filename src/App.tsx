import {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { ToastContainer } from 'react-toastify'

import { AppFooter, AppNavbar, InvalidChainModal } from '@/common'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import { bus, BUS_EVENTS, ErrorHandler, isWebpSupported } from '@/helpers'
import { useNotification, useViewportSizes } from '@/hooks'

const App: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  useViewportSizes()

  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const { showToast } = useNotification()
  const { provider, isValidChain, init: initWeb3 } = useWeb3Context()
  const { checkMetamaskExists, checkSnapExists, connectOrInstallSnap } =
    useMetamaskZkpSnapContext()

  const init = useCallback(async () => {
    if (provider?.address) return

    try {
      if (await checkMetamaskExists()) {
        /**
         * We not pass providerType here,
         * because only want to check is user was connected before
         */
        await initWeb3()

        if (await checkSnapExists()) {
          await connectOrInstallSnap()
        }

        if (!isWebpSupported()) {
          const rootEl = document.getElementById('#root')

          if (rootEl) rootEl.className += ' no-webp'
        }
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    setIsAppInitialized(true)
  }, [
    provider?.address,
    checkMetamaskExists,
    initWeb3,
    checkSnapExists,
    connectOrInstallSnap,
  ])

  useEffect(() => {
    const showSuccessToast = (payload: unknown) => showToast('success', payload)
    const showWarningToast = (payload: unknown) => showToast('warning', payload)
    const showErrorToast = (payload: unknown) => showToast('error', payload)
    const showInfoToast = (payload: unknown) => showToast('info', payload)

    let mountingInit = async () => {
      bus.on(BUS_EVENTS.success, showSuccessToast)
      bus.on(BUS_EVENTS.warning, showWarningToast)
      bus.on(BUS_EVENTS.error, showErrorToast)
      bus.on(BUS_EVENTS.info, showInfoToast)

      await init()
    }

    mountingInit()

    return () => {
      bus.off(BUS_EVENTS.success, showSuccessToast)
      bus.off(BUS_EVENTS.warning, showWarningToast)
      bus.off(BUS_EVENTS.error, showErrorToast)
      bus.off(BUS_EVENTS.info, showInfoToast)

      mountingInit = async () => {
        /* empty */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <AppNavbar />
      <div
        className='app__main'
        key={provider?.isConnected ? Number(isValidChain) : 'app_main'}
      >
        {isAppInitialized && children}
      </div>

      <AppFooter />
      <ToastContainer />

      <InvalidChainModal isShown={isAppInitialized} />
    </>
  )
}

export default memo(App)
