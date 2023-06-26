import { ToastContainer } from 'react-toastify'
import { useEffectOnce } from 'react-use'

import { useWeb3Context } from '@/contexts'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useNotification, useViewportSizes } from '@/hooks'
import { AppRoutes } from '@/routes'
import { NotificationPayload } from '@/types'

export const App = () => {
  useViewportSizes()

  const { showToast } = useNotification()
  const { init: initWeb3 } = useWeb3Context()

  const init = async () => {
    try {
      await initWeb3()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }

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
    <div className='app'>
      <AppRoutes />

      <ToastContainer />
    </div>
  )
}
