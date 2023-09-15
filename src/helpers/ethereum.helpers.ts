import { BN, DECIMALS } from '@distributedlab/tools'
import { EthereumProvider, RawProvider } from '@distributedlab/w3p'
import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
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

export async function increaseGasLimit(
  addressFrom: string,
  rawProvider: RawProvider,
  txBody: Deferrable<TransactionRequest>,
  multiplier: string | number,
) {
  const provider = new providers.Web3Provider(
    rawProvider as providers.ExternalProvider,
  )

  const estimatedGas = await provider.estimateGas({
    ...txBody,
    from: addressFrom,
  })

  return BN.fromBigInt(estimatedGas?.toString(), DECIMALS.WEI).mul(
    BN.fromRaw(multiplier, DECIMALS.WEI),
  ).value
}
