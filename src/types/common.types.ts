import { RawProvider } from '@distributedlab/w3p'

import type { ICON_NAMES } from '@/enums'

declare global {
  interface Window {
    okxwallet: RawProvider
  }
}

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: ICON_NAMES
}

export type NotificationPayload = string | NotificationObjectPayload

export type NotificationTxType = 'pending' | 'success' | 'error'
