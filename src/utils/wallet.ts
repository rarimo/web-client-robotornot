import { AccountData, OfflineSigner } from '@cosmjs/launchpad'
import { Window as KeplrWindow } from '@keplr-wallet/types'

import {
  WalletExtensionNotInstalledError,
  WalletNotInitializedError,
} from '@/errors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export class Wallet {
  _wallet: OfflineSigner | null = null
  _walletAccounts: readonly AccountData[] | null = null

  get signer(): OfflineSigner {
    if (!this._wallet) {
      throw new WalletNotInitializedError()
    }
    return this._wallet
  }

  get account(): AccountData {
    if (!this._walletAccounts?.[0]) {
      throw new WalletNotInitializedError()
    }
    return this._walletAccounts[0]
  }

  get isEmpty(): boolean {
    return this._wallet === null
  }

  async loadAccounts(): Promise<void> {
    try {
      this._walletAccounts = (await this._wallet?.getAccounts()) ?? null
    } catch (e) {
      throw new WalletNotInitializedError()
    }
  }

  loadSigner(chainId: string): void {
    const offlineSigner =
      window.getOfflineSigner != null ? window.getOfflineSigner(chainId) : null
    if (offlineSigner === null) throw new WalletExtensionNotInstalledError()
    this._wallet = offlineSigner
  }

  clear(): void {
    this._wallet = null
    this._walletAccounts = null
  }
}

export const wallet = new Wallet()
