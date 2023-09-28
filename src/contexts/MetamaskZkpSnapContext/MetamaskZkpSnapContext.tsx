import {
  type CreateProofRequestParams,
  enableSnap,
  isMetamaskInstalled as detectMetamaskInstalled,
  isSnapInstalled as detectSnapInstalled,
  type SaveCredentialsRequestParams,
  type SnapConnector,
  type W3CCredential,
  type ZKPProofResponse,
} from '@rarimo/rarime-connector'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'

/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */

interface MetamaskZkpSnapContextValue {
  isMetamaskInstalled: boolean
  isSnapInstalled: boolean

  isLocalSnap: (snapId: string) => boolean

  createIdentity: () => Promise<string | undefined>
  getVerifiableCredentials: (
    params: SaveCredentialsRequestParams,
  ) => Promise<W3CCredential[] | undefined>
  createProof: (
    params: CreateProofRequestParams,
  ) => Promise<ZKPProofResponse | undefined>
  checkMetamaskExists: () => Promise<boolean>
  checkSnapExists: () => Promise<boolean>
  checkSnapStatus: () => Promise<{
    isMetamaskInstalled: boolean
    isSnapInstalled: boolean
  }>

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
    getVerifiableCredentials: () => {
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

    connectOrInstallSnap: () => {
      throw new Error('MetamaskZkpSnapContext not initialized')
    },
  })

const MetamaskZkpSnapContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const [connector, setConnector] = useState<SnapConnector>()

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
    if (!connector) throw new TypeError('Connector is not defined')

    return (await connector.createIdentity())?.split(':')?.[2]
  }, [connector])

  /**
   * Get the verifiable credentials from the snap.
   */
  const getVerifiableCredentials = useCallback(
    async (params: SaveCredentialsRequestParams) => {
      if (!connector) throw new TypeError('Connector is not defined')

      return connector.saveCredentials?.(params)
    },
    [connector],
  )

  const createProof = useCallback(
    async (params: CreateProofRequestParams) => {
      if (!connector) throw new TypeError('Connector is not defined')

      return connector.createProof(params)
    },
    [connector],
  )

  const checkMetamaskExists = useCallback(async () => {
    const _isMetamaskInstalled = await detectMetamaskInstalled()

    setIsMetamaskInstalled(_isMetamaskInstalled)

    return _isMetamaskInstalled
  }, [])

  const checkSnapExists = useCallback(async () => {
    const _isSnapInstalled = await detectSnapInstalled()

    setIsSnapInstalled(_isSnapInstalled)

    return _isSnapInstalled
  }, [])

  const connectOrInstallSnap = useCallback(async () => {
    const snap = await enableSnap()
    const connector = await snap.getConnector()
    setConnector(connector)
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

  return (
    <MetamaskZkpSnapContext.Provider
      value={{
        isMetamaskInstalled,
        isSnapInstalled,

        isLocalSnap,

        createIdentity,
        getVerifiableCredentials,
        createProof,

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
