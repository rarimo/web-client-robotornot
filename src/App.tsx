import {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AppFooter, AppNavbar, Loader, WordsFindGame } from '@/common'
import {
  useMetamaskZkpSnapContext,
  useWeb3Context,
  ZkpContextProvider,
} from '@/contexts'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
} from '@/helpers'
import { useNotification, useViewportSizes } from '@/hooks'
const words = [
  'bitcoin',
  'luna',
  'car',
  'rarimo',
  'moon',
  'doge',
  'coin',
  'ether',
  'play',
]

const App: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  useViewportSizes()

  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const location = useLocation()
  const { showToast } = useNotification()
  const { provider, init: initWeb3 } = useWeb3Context()
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

  useEffect(() => {
    gaSendCustomEvent(GaCategories.PageView, { pathname: location.pathname })
  }, [location])

  return (
    <ZkpContextProvider>
      <AppNavbar />
      <WordsFindGame words={words} rows={10} cols={10} />
      <div className='app__main'>
        {isAppInitialized ? children : <Loader />}
      </div>

      <AppFooter />
      <ToastContainer />
    </ZkpContextProvider>
  )
}

export default memo(App)
