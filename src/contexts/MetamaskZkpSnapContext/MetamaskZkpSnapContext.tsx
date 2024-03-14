import {
  CheckCredentialExistenceRequestParams,
  CreateProofRequestParams,
  isMetamaskInstalled as detectMetamaskInstalled,
  SaveCredentialsRequestParams,
  SaveCredentialsResponse,
  ZKPProofResponse,
} from '@rarimo/rarime-connector'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'

import { zkpSnap } from '@/api'
import { saveVCResponse } from '@/contexts/ZkpContext/ZkpContext'

/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */

interface MetamaskZkpSnapContextValue {
  isMetamaskInstalled: boolean
  isSnapInstalled: boolean

  isLocalSnap: (snapId: string) => boolean

  createIdentity: () => Promise<
    | {
        identityIdString: string
        identityIdBigIntString: string
      }
    | undefined
  >
  saveVerifiableCredentials: (
    params: SaveCredentialsRequestParams,
  ) => Promise<saveVCResponse[] | undefined>
  createProof: (
    params: CreateProofRequestParams,
  ) => Promise<ZKPProofResponse | undefined>
  checkMetamaskExists: () => Promise<boolean>
  checkSnapExists: () => Promise<boolean>
  checkSnapStatus: () => Promise<{
    isMetamaskInstalled: boolean
    isSnapInstalled: boolean
  }>
  checkCredentialExistence: (
    params: CheckCredentialExistenceRequestParams,
  ) => Promise<SaveCredentialsResponse[] | undefined>

  connectOrInstallSnap: () => Promise<void>
}

export const MetamaskZkpSnapContext =
  createContext<MetamaskZkpSnapContextValue>({
    isMetamaskInstalled: false,
    isSnapInstalled: false,

    isLocalSnap: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },

    createIdentity: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
    saveVerifiableCredentials: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
    createProof: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
    checkMetamaskExists: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
    checkSnapExists: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
    checkSnapStatus: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
    checkCredentialExistence: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },

    connectOrInstallSnap: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
  })

const MetamaskZkpSnapContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false)
  const [isSnapInstalled, setIsSnapInstalled] = useState(false)

  const isLocalSnap = useCallback(
    (snapId: string) => snapId.startsWith('local:'),
    [],
  )

  /**
   * create identity and return did if it doesn't exist
   * or return the existing one
   */
  const createIdentity = useCallback(async () => {
    return zkpSnap.createIdentity()
  }, [])

  /**
   * Get the verifiable credentials from the snap.
   */
  const saveVerifiableCredentials = useCallback(
    async (params: SaveCredentialsRequestParams) => {
      return zkpSnap.saveCredentials?.(params)
    },
    [],
  )

  const createProof = useCallback(async (params: CreateProofRequestParams) => {
    return zkpSnap.createProof(params)
  }, [])

  const checkMetamaskExists = useCallback(async () => {
    const _isMetamaskInstalled = await detectMetamaskInstalled()

    setIsMetamaskInstalled(_isMetamaskInstalled)

    return _isMetamaskInstalled
  }, [])

  const checkSnapExists = useCallback(async () => {
    const _isSnapInstalled = await zkpSnap.isInstalled()

    setIsSnapInstalled(_isSnapInstalled)

    return _isSnapInstalled
  }, [])

  const connectOrInstallSnap = useCallback(async () => {
    await zkpSnap.enable()
  }, [])

  const checkSnapStatus = useCallback(async () => {
    const _isMetamaskInstalled = await checkMetamaskExists()
    const _isSnapInstalled = await checkSnapExists()

    setIsMetamaskInstalled(_isMetamaskInstalled)
    setIsSnapInstalled(_isSnapInstalled)

    return {
      isMetamaskInstalled: _isMetamaskInstalled,
      isSnapInstalled: _isSnapInstalled,
    }
  }, [checkMetamaskExists, checkSnapExists])

  const checkCredentialExistence = useCallback(
    async (
      params: CheckCredentialExistenceRequestParams,
    ): Promise<SaveCredentialsResponse[] | undefined> => {
      return zkpSnap?.checkCredentialExistence?.(params)
    },
    [],
  )

  return (
    <MetamaskZkpSnapContext.Provider
      value={{
        isMetamaskInstalled,
        isSnapInstalled,

        isLocalSnap,

        createIdentity,
        saveVerifiableCredentials,
        createProof,
        checkCredentialExistence,

        checkMetamaskExists,
        checkSnapExists,
        checkSnapStatus,

        connectOrInstallSnap,
      }}
    >
      {children}
    </MetamaskZkpSnapContext.Provider>
  )
}

export default MetamaskZkpSnapContextProvider
