export class WalletNotInitializedError extends ReferenceError {
  constructor() {
    super('Wallet not initialized!')
    this.name = 'WalletNotInitializedError'
  }
}

export class WalletExtensionNotInstalledError extends ReferenceError {
  constructor() {
    super('Wallet extension is not installed')
    this.name = 'WalletExtensionNotInstalledError'
  }
}

export const isWalletError = (
  error: Error,
): error is WalletNotInitializedError | WalletExtensionNotInstalledError => {
  return (
    error instanceof WalletNotInitializedError ||
    error instanceof WalletExtensionNotInstalledError
  )
}
