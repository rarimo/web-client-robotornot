import { ThemeMode } from '@/enums'

export type UiStorageState = {
  viewportWidth: number
  themeMode?: ThemeMode
}

export type Web3StorageState = {
  isConnected: boolean
  isValidator: boolean
  address: string
}
