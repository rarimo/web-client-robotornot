import { omit } from 'lodash-es'

import { LocalStorageKeys } from '@/enums'
import { uiInitialState } from '@/store'
import { UiStorageState } from '@/types'

import { BaseStorage } from './base'

export class UiStorage extends BaseStorage<LocalStorageKeys.Ui> {
  private static instance?: UiStorage

  private constructor() {
    super()
  }

  public static getInstance(): UiStorage {
    if (!this.instance) {
      this.instance = new UiStorage()
    }

    return this.instance
  }

  public save(storage: UiStorageState): void {
    this.set(
      LocalStorageKeys.Ui,
      JSON.stringify(omit(storage, 'viewportWidth')),
    )
  }

  public getStorage(): UiStorageState {
    const restored = this.get(LocalStorageKeys.Ui)

    return restored
      ? { ...JSON.parse(restored), viewportWidth: window.innerWidth }
      : uiInitialState
  }

  public clear(): void {
    this.clearItem(LocalStorageKeys.Ui)
  }
}
