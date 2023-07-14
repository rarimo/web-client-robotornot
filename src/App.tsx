import { FC, HTMLAttributes, memo, useCallback, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { useEffectOnce } from 'react-use'

import { AppNavbar, Loader } from '@/common'
import {
  useMetamaskZkpSnapContext,
  useWeb3Context,
  ZkpContextProvider,
} from '@/contexts'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useNotification, useViewportSizes } from '@/hooks'
import { NotificationPayload } from '@/types'

const App: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  useViewportSizes()

  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const { showToast } = useNotification()
  const { init: initWeb3 } = useWeb3Context()
  const { init: initZkpSnap } = useMetamaskZkpSnapContext()

  const init = useCallback(async () => {
    try {
      await initWeb3()
      await initZkpSnap()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    setIsAppInitialized(true)
  }, [initWeb3, initZkpSnap])

  useEffectOnce(() => {
    bus.on(BUS_EVENTS.success, payload =>
      showToast('success', payload as NotificationPayload),
    )
    bus.on(BUS_EVENTS.warning, payload =>
      showToast('warning', payload as NotificationPayload),
    )
    bus.on(BUS_EVENTS.error, payload =>
      showToast('error', payload as NotificationPayload),
    )
    bus.on(BUS_EVENTS.info, payload =>
      showToast('info', payload as NotificationPayload),
    )

    init()
  })

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
