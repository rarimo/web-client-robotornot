import { EthereumProvider } from '@distributedlab/w3p'

export const switchAccount = async (rawProvider: EthereumProvider) => {
  const accounts = await rawProvider?.request?.({
    method: 'wallet_requestPermissions',
    params: [
      {
        eth_accounts: {},
      },
    ],
  })

  return accounts[0]
}
