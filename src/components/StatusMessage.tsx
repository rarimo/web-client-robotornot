import { AlertColor } from '@mui/material'
import { AxiosError } from 'axios'
import { isObject } from 'lodash-es'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarInfo } from '@/components'
import { WalletExtensionNotInstalledError } from '@/errors'
import { Bus, EventBusEventName } from '@/helpers'
import { ErrorHandlerPayload, StatusMessagePayload } from '@/types'

const STATUS_MESSAGE_AUTO_HIDE_DURATION = 10000

const StatusMessage = () => {
  const { t } = useTranslation()

  const [isStatusMessageShown, setIsStatusMessageShown] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [severity, setSeverity] = useState<EventBusEventName>('info')

  const getErrorMessage = (error: Error): string => {
    switch (error.constructor) {
      case WalletExtensionNotInstalledError:
        return t('common.labels.wallet-extension-not-installed')
      case AxiosError:
        if ((error as AxiosError).code === AxiosError.ERR_NETWORK) {
          return t('common.labels.network-error')
        }
        return t('common.labels.something-wrong')
      default:
        return t('common.labels.something-wrong')
    }
  }

  const busOnHandler = (
    severity: EventBusEventName,
    payload: StatusMessagePayload,
  ) => {
    let msg = isObject(payload) ? payload?.message ?? '' : payload

    if (severity === Bus.eventList.error) {
      const err = (payload as ErrorHandlerPayload)?.error
      msg ||= err ? getErrorMessage(err) : t('common.labels.something-wrong')
    }
    if (severity === Bus.eventList.warning) {
      msg ||= t('common.labels.warning')
    }
    if (severity === Bus.eventList.success) {
      msg ||= t('common.labels.success')
    }
    if (severity === Bus.eventList.info) {
      msg ||= t('common.labels.info')
    }

    setSeverity(severity)
    setIsStatusMessageShown(true)
    setStatusMessage(msg)
  }

  Bus.on<StatusMessagePayload>(Bus.eventList.error, payload => {
    busOnHandler(Bus.eventList.error, payload)
  })
  Bus.on<StatusMessagePayload>(Bus.eventList.warning, payload => {
    busOnHandler(Bus.eventList.warning, payload)
  })
  Bus.on<StatusMessagePayload>(Bus.eventList.success, payload => {
    busOnHandler(Bus.eventList.success, payload)
  })
  Bus.on<StatusMessagePayload>(Bus.eventList.info, payload => {
    busOnHandler(Bus.eventList.info, payload)
  })

  const clear = () => {
    setIsStatusMessageShown(false)
  }

  return (
    <SnackbarInfo
      isOpened={isStatusMessageShown}
      autoHideDuration={STATUS_MESSAGE_AUTO_HIDE_DURATION}
      message={statusMessage}
      severity={severity as AlertColor}
      close={clear}
    />
  )
}

export default StatusMessage
