import { LocalStorageKeys } from '@/enums'
import { web3InitialState } from '@/store'
import { Web3StorageState } from '@/types'

import { BaseStorage } from './base'

export class Web3Storage extends BaseStorage<LocalStorageKeys.Web3> {
  private static instance?: Web3Storage

  private constructor() {
    super()
  }

  public static getInstance(): Web3Storage {
    if (!this.instance) {
      this.instance = new Web3Storage()
    }

    return this.instance
  }

  public save(storage: Web3StorageState): void {
    this.set(LocalStorageKeys.Web3, JSON.stringify(storage))
  }

  public getStorage(): Web3StorageState {
    const restored = this.get(LocalStorageKeys.Web3)
    return restored ? JSON.parse(restored) : web3InitialState
  }

  public clear(): void {
    this.clearItem(LocalStorageKeys.Web3)
  }
}
