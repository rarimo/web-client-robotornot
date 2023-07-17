import { config } from '@config'
import {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { ToastContainer } from 'react-toastify'

import { AppNavbar, Loader } from '@/common'
import { ZkpContextProvider } from '@/contexts'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useNotification, useViewportSizes } from '@/hooks'

const App: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  useViewportSizes()

  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const { showToast } = useNotification()

  const init = useCallback(async () => {
    try {
      document.title = config.APP_NAME
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    setIsAppInitialized(true)
  }, [])

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
  }, [init, showToast])

  return (
    <ZkpContextProvider>
      <div id='app'>
        <AppNavbar />

        <div className='app__main'>
          {isAppInitialized ? children : <Loader />}
        </div>
      </div>

      <ToastContainer />
    </ZkpContextProvider>
  )
}

export default memo(App)
