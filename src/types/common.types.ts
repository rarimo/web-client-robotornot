import type { ICON_NAMES } from '@/enums'

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: ICON_NAMES
}

export type NotificationPayload = string | NotificationObjectPayload

export type NotificationTxType = 'pending' | 'success' | 'error'
