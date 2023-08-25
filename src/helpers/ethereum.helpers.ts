import { EthereumProvider, RawProvider } from '@distributedlab/w3p'
import { providers } from 'ethers'

import { sleep } from '@/helpers/promise.helpers'

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

export const awaitFinalityBlock = async (
  blockAmount: number,
  rawProvider: RawProvider,
) => {
  const web3Provider = new providers.Web3Provider(
    rawProvider as providers.ExternalProvider,
  )

  let currentBlock = await web3Provider?.getBlockNumber()

  if (!currentBlock) throw new Error('Current block has not been found')

  const finalityBlock =
    +currentBlock + (blockAmount && !isNaN(+blockAmount) ? +blockAmount : 0)

  do {
    await sleep(10_000)
    currentBlock = await web3Provider?.getBlockNumber()
  } while (!currentBlock || currentBlock < finalityBlock)
}
