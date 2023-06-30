import isObject from 'lodash/isObject'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, TypeOptions } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { DefaultToast } from '@/common'
import { ICON_NAMES } from '@/enums'
import { NotificationObjectPayload } from '@/types'

const NOTIFICATION_TYPE = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  default: 'default',
}

const MINUTE = 60 * 1000

export const useNotification = () => {
  const { t } = useTranslation()

  const defaultTitles = useMemo(
    () => ({
      [NOTIFICATION_TYPE.success]: t('notifications.default-title-success'),
      [NOTIFICATION_TYPE.error]: t('notifications.default-title-error'),
      [NOTIFICATION_TYPE.warning]: t('notifications.default-title-warning'),
      [NOTIFICATION_TYPE.info]: t('notifications.default-title-info'),
      [NOTIFICATION_TYPE.default]: t('notifications.default-title-default'),
    }),
    [t],
  )

  const defaultMessages = useMemo(
    () => ({
      [NOTIFICATION_TYPE.default]: t('notifications.default-message-default'),
      [NOTIFICATION_TYPE.info]: t('notifications.default-message-info'),
      [NOTIFICATION_TYPE.success]: t('notifications.default-message-success'),
      [NOTIFICATION_TYPE.error]: t('notifications.default-message-error'),
      [NOTIFICATION_TYPE.warning]: t('notifications.default-message-warning'),
    }),
    [t],
  )

  const defaultIconNames = useMemo(
    () => ({
      [NOTIFICATION_TYPE.default]: ICON_NAMES.exclamationCircle,
      [NOTIFICATION_TYPE.info]: ICON_NAMES.exclamationCircle,
      [NOTIFICATION_TYPE.success]: ICON_NAMES.checkCircle,
      [NOTIFICATION_TYPE.error]: ICON_NAMES.xCircle,
      [NOTIFICATION_TYPE.warning]: ICON_NAMES.shieldExclamation,
    }),
    [],
  )

  const showToast = useCallback(
    (
      messageType = NOTIFICATION_TYPE.default,
      payload?: string | NotificationObjectPayload | unknown,
    ) => {
      let title = ''
      let message = ''
      let iconName: ICON_NAMES | undefined

      if (isObject(payload)) {
        const msgPayload = payload as NotificationObjectPayload

        title = msgPayload.title || ''
        message = msgPayload.message
        iconName = msgPayload?.iconName
      } else if (payload) {
        message = payload as string
      } else {
        message = defaultMessages[messageType]
      }

      if (!title) {
        title = defaultTitles[messageType]
      }
      if (!iconName) {
        iconName = defaultIconNames[messageType]
      }

      return toast(
        () => (
          <DefaultToast title={title} message={message} iconName={iconName} />
        ),
        {
          toastId: `${messageType}-${uuidv4()}`,
          icon: false,
          type: {
            default: NOTIFICATION_TYPE.default,
            info: NOTIFICATION_TYPE.info,
            success: NOTIFICATION_TYPE.success,
            error: NOTIFICATION_TYPE.error,
            warning: NOTIFICATION_TYPE.warning,
          }[messageType] as TypeOptions,
          className: 'default-toast',
          autoClose: MINUTE / 2,
          closeOnClick: false,
        },
      )
    },
    [defaultIconNames, defaultMessages, defaultTitles],
  )

  const removeToast = useCallback((toastId: string) => {
    toast.dismiss(toastId)
  }, [])

  return {
    showToast,
    removeToast,
  }
}
