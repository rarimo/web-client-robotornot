import { TransactionResponse } from '@distributedlab/w3p'
import { Provider } from '@ethersproject/providers'
import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { ZKPQueriesStorage__factory } from '@/types'
import {
  ICircuitValidator,
  IZKPQueriesStorage,
} from '@/types/contracts/ZKPQueriesStorage'

export const useZkpQueriesStorageContract = (address: string) => {
  const { provider } = useWeb3Context()

  const contractInterface = useMemo(
    () => ZKPQueriesStorage__factory.createInterface(),
    [],
  )

  const contractInstance = useMemo(() => {
    return provider?.rawProvider
      ? ZKPQueriesStorage__factory.connect(
          address,
          provider.rawProvider as unknown as Provider,
        )
      : undefined
  }, [address, provider])

  const getQueryHash = useCallback(
    async (
      circuitQuery_: ICircuitValidator.CircuitQueryStruct,
    ): Promise<BigNumber | undefined> => {
      return contractInstance?.getQueryHash?.(circuitQuery_)
    },
    [contractInstance],
  )

  const getQueryHashRaw = useCallback(
    async (
      schema_: BigNumberish,
      operator_: BigNumberish,
      claimPathKey_: BigNumberish,
      values_: BigNumberish[],
    ): Promise<BigNumber | undefined> => {
      return contractInstance?.getQueryHashRaw?.(
        schema_,
        operator_,
        claimPathKey_,
        values_,
      )
    },
    [contractInstance],
  )

  const getQueryInfo = useCallback(
    async (
      queryId_: string,
    ): Promise<IZKPQueriesStorage.QueryInfoStructOutput | undefined> => {
      return contractInstance?.getQueryInfo?.(queryId_)
    },
    [contractInstance],
  )

  const getQueryValidator = useCallback(
    async (queryId_: string): Promise<string | undefined> => {
      return contractInstance?.getQueryValidator?.(queryId_)
    },
    [contractInstance],
  )

  const getStoredCircuitQuery = useCallback(
    async (
      queryId_: string,
    ): Promise<ICircuitValidator.CircuitQueryStructOutput | undefined> => {
      return contractInstance?.getStoredCircuitQuery?.(queryId_)
    },
    [contractInstance],
  )

  const getStoredQueryHash = useCallback(
    async (queryId_: string): Promise<BigNumber | undefined> => {
      return contractInstance?.getStoredQueryHash?.(queryId_)
    },
    [contractInstance],
  )

  const getStoredSchema = useCallback(
    async (queryId_: string): Promise<BigNumber | undefined> => {
      return contractInstance?.getStoredSchema?.(queryId_)
    },
    [contractInstance],
  )

  const getSupportedQueryIDs = useCallback(async (): Promise<
    string[] | undefined
  > => {
    return contractInstance?.getSupportedQueryIDs?.()
  }, [contractInstance])

  const isQueryExists = useCallback(
    async (queryId_: string): Promise<boolean | undefined> => {
      return contractInstance?.isQueryExists?.(queryId_)
    },
    [contractInstance],
  )

  const owner = useCallback(async (): Promise<string | undefined> => {
    return contractInstance?.owner?.()
  }, [contractInstance])

  const removeZKPQuery = useCallback(
    async (queryId_: string): Promise<TransactionResponse | undefined> => {
      const data = contractInterface.encodeFunctionData('removeZKPQuery', [
        queryId_,
      ])

      const txBody = {
        to: address,
        data,
      }

      return provider?.signAndSendTx(txBody)
    },
    [address, contractInterface, provider],
  )

  const setZKPQuery = useCallback(
    async (
      queryId_: string,
      queryInfo_: IZKPQueriesStorage.QueryInfoStruct,
    ): Promise<TransactionResponse | undefined> => {
      const data = contractInterface.encodeFunctionData('setZKPQuery', [
        queryId_,
        queryInfo_,
      ])

      const txBody = {
        to: address,
        data,
      }

      return provider?.signAndSendTx(txBody)
    },
    [address, contractInterface, provider],
  )
  return {
    getQueryHash,
    getQueryHashRaw,
    getQueryInfo,
    getQueryValidator,
    getStoredCircuitQuery,
    getStoredQueryHash,
    getStoredSchema,
    getSupportedQueryIDs,
    isQueryExists,
    owner,
    removeZKPQuery,
    setZKPQuery,
  }
}
