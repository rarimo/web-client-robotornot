import { config } from '@config'
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
  init: () => Promise<{
    isMetamaskInstalled: boolean
    isSnapInstalled: boolean
  }>
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
    init: () => {
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
    return (await connector?.createIdentity())?.split(':')?.[2]
  }, [connector])

  /**
   * Get the verifiable credentials from the snap.
   */
  const getVerifiableCredentials = useCallback(
    async (params: SaveCredentialsRequestParams) => {
      return connector?.saveCredentials?.(params)
    },
    [connector],
  )

  const createProof = useCallback(
    async (params: CreateProofRequestParams) => {
      return connector?.createProof(params)
    },
    [connector],
  )

  const init = useCallback(async () => {
    const _isMetamaskInstalled = await detectMetamaskInstalled()
    const _isSnapInstalled = await detectSnapInstalled(
      config.SNAP_ORIGIN,
      config.SNAP_VERSION,
    )

    if (!_isSnapInstalled) {
      const snap = await enableSnap(config.SNAP_ORIGIN, config.SNAP_VERSION)
      const connector = await snap.getConnector()
      setConnector(connector)
    }

    setIsMetamaskInstalled(_isMetamaskInstalled)
    setIsSnapInstalled(_isSnapInstalled)

    return {
      isMetamaskInstalled: _isMetamaskInstalled,
      isSnapInstalled: _isSnapInstalled,
    }
  }, [])

  return (
    <MetamaskZkpSnapContext.Provider
      value={{
        isMetamaskInstalled,
        isSnapInstalled,

        isLocalSnap,

        createIdentity,
        getVerifiableCredentials,
        createProof,
        init,
      }}
    >
      {children}
    </MetamaskZkpSnapContext.Provider>
  )
}

export default MetamaskZkpSnapContextProvider
