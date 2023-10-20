import { config } from '@config'
import { type TransactionResponse } from '@distributedlab/w3p'
import { type BigNumberish, providers } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { IdentityVerifier__factory } from '@/types'
import {
  IIdentityVerifier,
  ILightweightState,
} from '@/types/contracts/IdentityVerifier'

export const useIdentityVerifier = (
  address = config?.[
    `IDENTITY_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`
  ],
) => {
  const { provider } = useWeb3Context()

  const contractInterface = useMemo(
    () => IdentityVerifier__factory.createInterface(),
    [],
  )

  const contractInstance = useMemo(() => {
    if (!address || !provider?.rawProvider) return null

    return IdentityVerifier__factory.connect(
      address,
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ),
    )
  }, [address, provider?.rawProvider])

  const getIdentityProofInfo = useCallback(
    async (
      identityId_: BigNumberish,
    ): Promise<IIdentityVerifier.IdentityProofInfoStructOutput | undefined> => {
      return contractInstance?.getIdentityProofInfo?.(identityId_)
    },
    [contractInstance],
  )

  const isIdentityProved = useCallback(
    async (did: BigNumberish): Promise<boolean | undefined> => {
      return contractInstance?.['isIdentityProved(uint256)']?.(did)
    },
    [contractInstance],
  )

  const isSenderAddressProved = useCallback(
    (address: string) => {
      return contractInstance?.['isIdentityProved(address)']?.(address)
    },
    [contractInstance],
  )

  const owner = useCallback(async (): Promise<string | undefined> => {
    return contractInstance?.owner?.()
  }, [contractInstance])

  const proveIdentity = useCallback(
    async (
      statesMerkleData_: ILightweightState.StatesMerkleDataStruct,
      inputs_: BigNumberish[],
      a_: [BigNumberish, BigNumberish],
      b_: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c_: [BigNumberish, BigNumberish],
    ): Promise<TransactionResponse | undefined> => {
      if (!address || !provider)
        throw new TypeError('Invalid address or provider')

      const data = contractInterface.encodeFunctionData('proveIdentity', [
        statesMerkleData_,
        inputs_,
        a_,
        b_,
        c_,
      ])

      const txBody = {
        to: address,
        data,
      }

      return provider?.signAndSendTx?.(txBody)
    },
    [address, contractInterface, provider],
  )

  const getProveIdentityTxBody = useCallback(
    (
      statesMerkleData_: ILightweightState.StatesMerkleDataStruct,
      inputs_: BigNumberish[],
      a_: [BigNumberish, BigNumberish],
      b_: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c_: [BigNumberish, BigNumberish],
    ) => {
      const data = contractInterface.encodeFunctionData('proveIdentity', [
        statesMerkleData_,
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

      return provider?.signAndSendTx?.(txBody)
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
    isSenderAddressProved,
    owner,

    proveIdentity,
    getProveIdentityTxBody,

    setZKPQueriesStorage,
    zkpQueriesStorage,
  }
}
