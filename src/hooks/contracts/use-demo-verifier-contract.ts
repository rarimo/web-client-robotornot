import { type TransactionResponse } from '@distributedlab/w3p'
import { Provider } from '@ethersproject/providers'
import { BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { DemoVerifier__factory } from '@/types'
import { IDemoVerifier } from '@/types/contracts/DemoVerifier'

export const useDemoVerifierContract = (address?: string) => {
  const { provider } = useWeb3Context()

  const contractInterface = useMemo(
    () => DemoVerifier__factory.createInterface(),
    [],
  )

  const contractInstance = useMemo(() => {
    if (!address || !provider) return undefined

    return provider?.rawProvider
      ? DemoVerifier__factory.connect(
          address,
          provider.rawProvider as unknown as Provider,
        )
      : undefined
  }, [address, provider])

  const getIdentityProofInfo = useCallback(
    async (
      identityId_: BigNumberish,
    ): Promise<IDemoVerifier.IdentityProofInfoStructOutput | undefined> => {
      return contractInstance?.getIdentityProofInfo?.(identityId_)
    },
    [contractInstance],
  )

  const isIdentityProved = useCallback(
    async (identityId_: BigNumberish): Promise<boolean | undefined> => {
      return contractInstance?.isIdentityProved?.(identityId_)
    },
    [contractInstance],
  )

  const owner = useCallback(async (): Promise<string | undefined> => {
    return contractInstance?.owner?.()
  }, [contractInstance])

  const proveIdentity = useCallback(
    async (
      inputs_: BigNumberish[],
      a_: [BigNumberish, BigNumberish],
      b_: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c_: [BigNumberish, BigNumberish],
    ): Promise<TransactionResponse | undefined> => {
      if (!address || !provider)
        throw new TypeError('Invalid address or provider')

      const data = contractInterface.encodeFunctionData('proveIdentity', [
        inputs_,
        a_,
        b_,
        c_,
      ])

      const txBody = {
        to: address,
        data,
      }

      return provider?.signAndSendTx(txBody)
    },
    [address, contractInterface, provider],
  )

  const getProveIdentityTxBody = useCallback(
    (
      inputs_: BigNumberish[],
      a_: [BigNumberish, BigNumberish],
      b_: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c_: [BigNumberish, BigNumberish],
    ) => {
      const data = contractInterface.encodeFunctionData('proveIdentity', [
        inputs_,
        a_,
        b_,
        c_,
      ])

      return {
        data,
      }
    },
    [contractInterface],
  )

  const setZKPQueriesStorage = useCallback(
    async (
      newZKPQueriesStorage_: string,
    ): Promise<TransactionResponse | undefined> => {
      const data = contractInterface.encodeFunctionData(
        'setZKPQueriesStorage',
        [newZKPQueriesStorage_],
      )

      const txBody = {
        to: address,
        data,
      }

      return provider?.signAndSendTx(txBody)
    },
    [address, contractInterface, provider],
  )

  const zkpQueriesStorage = useCallback(async (): Promise<
    string | undefined
  > => {
    return contractInstance?.zkpQueriesStorage?.()
  }, [contractInstance])

  return {
    getIdentityProofInfo,
    isIdentityProved,
    owner,

    proveIdentity,
    getProveIdentityTxBody,

    setZKPQueriesStorage,
    zkpQueriesStorage,
  }
}
