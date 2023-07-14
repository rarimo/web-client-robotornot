import { EthereumProvider } from '@distributedlab/w3p'
import { Hex } from '@iden3/js-crypto'
import { fromLittleEndian } from '@iden3/js-iden3-core'
import { ZKProof } from '@iden3/js-jwz'
import { ClaimOffer } from '@rarimo/auth-zkp-iden3'
import {
  createContext,
  FC,
  HTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { useWeb3Context } from '@/contexts'
import { sleep } from '@/helpers'

/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin =
  process.env.SNAP_ORIGIN ?? `local:http://localhost:8080`

export type SnapsList = Record<string, Snap>

export type Snap = {
  permissionName: string
  id: string
  version: string
  initialPermissions: Record<string, unknown>
}

interface MetamaskZkpSnapContextValue {
  isFlaskInstalled: boolean
  isSnapConnected: boolean

  isLocalSnap: (snapId: string) => boolean
  isFlask: () => Promise<boolean>

  getSnaps: () => Promise<SnapsList>
  connectSnap: (
    snapId?: string,
    params?: Record<'version' | string, unknown>,
  ) => Promise<void>
  getSnap: (version?: string) => Promise<Snap | undefined>
  createIdentity: () => Promise<string>
  getVerifiableCredentials: (claimOffer: ClaimOffer) => Promise<unknown>
  createNaturalPersonProof: () => Promise<ZKProof>

  init: () => Promise<{
    isFlaskDetected: boolean
    isSnapConnected: boolean
  }>
}

export const MetamaskZkpSnapContext =
  createContext<MetamaskZkpSnapContextValue>({
    isFlaskInstalled: false,
    isSnapConnected: false,
    isLocalSnap: () => false,
    isFlask: () => Promise.resolve(false),

    getSnaps: () => {
      throw new TypeError(`getSnaps is not defined`)
    },
    connectSnap: () => {
      throw new TypeError(`connectSnap is not defined`)
    },
    getSnap: () => {
      throw new TypeError(`getSnap is not defined`)
    },
    createIdentity: () => {
      throw new TypeError(`createIdentity is not defined`)
    },
    getVerifiableCredentials: () => {
      throw new TypeError(`getVerifiableCredentials is not defined`)
    },
    createNaturalPersonProof: () => {
      throw new TypeError(`createNaturalPersonProof is not defined`)
    },

    init: () => {
      throw new TypeError(`init is not defined`)
    },
  })

const MetamaskZkpSnapContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const { provider } = useWeb3Context()

  const rawProvider = useMemo(
    () =>
      provider?.rawProvider as EthereumProvider & {
        request: (opts: { method: string; params: unknown }) => Promise<unknown>
      },
    [provider],
  )

  const [isFlaskInstalled, setIsFlaskInstalled] = useState(false)
  const [isSnapConnected, setIsSnapConnected] = useState(false)

  const isLocalSnap = useCallback(
    (snapId: string) => snapId.startsWith('local:'),
    [],
  )

  /**
   * Detect if the wallet injecting the ethereum object is Flask.
   *
   * @returns True if the MetaMask version is Flask, false otherwise.
   */
  const isFlask = useCallback(async () => {
    const provider = window.ethereum

    try {
      const clientVersion = await provider?.request?.({
        method: 'web3_clientVersion',
      })

      const isFlaskDetected = (clientVersion as string[])?.includes('flask')

      return Boolean(provider && isFlaskDetected)
    } catch {
      return false
    }
  }, [])

  /**
   * Get the installed snaps in MetaMask.
   *
   * @returns The snaps installed in MetaMask.
   */
  const getSnaps = useCallback(async (): Promise<SnapsList> => {
    return (await rawProvider?.request?.({
      method: 'wallet_getSnaps',
    })) as unknown as SnapsList
  }, [rawProvider])

  /**
   * Connect a snap to MetaMask.
   *
   * @param snapId - The ID of the snap.
   * @param params - The params to pass with the snap to connect.
   */
  const connectSnap = useCallback(
    async (
      snapId: string = defaultSnapOrigin,
      params: Record<'version' | string, unknown> = {},
    ) => {
      await rawProvider?.request?.({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: params,
        },
      })
    },
    [rawProvider],
  )

  /**
   * Get the snap from MetaMask.
   *
   * @param version - The version of the snap to install (optional).
   * @returns The snap object returned by the extension.
   */
  const getSnap = useCallback(
    async (version?: string): Promise<Snap | undefined> => {
      const snaps = await getSnaps()

      return Object.values(snaps).find(
        snap =>
          snap.id === defaultSnapOrigin &&
          (!version || snap.version === version),
      )
    },
    [getSnaps],
  )

  /**
   * create identity and return did if it doesn't exist
   * or return the existing one
   */
  const createIdentity = useCallback(async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return rawProvider?.request?.({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'create_identity' },
      },
    })
  }, [rawProvider])

  const getVerifiableCredentials = useCallback(
    async (claimOffer: ClaimOffer) => {
      return rawProvider?.request?.({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'save_credentials',
            params: claimOffer,
          },
        },
      })
    },
    [rawProvider],
  )

  // FIXME
  const createNaturalPersonProof = useCallback(async (): Promise<ZKProof> => {
    const challenge = fromLittleEndian(
      Hex.decodeString(String(provider?.address).substring(2)),
    ).toString()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return rawProvider?.request?.({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'create_proof',
          params: {
            circuitId: 'credentialAtomicQuerySigV2OnChain',
            challenge: challenge,
            slotIndex: 0,
            query: {
              allowedIssuers: ['*'],
              context:
                'https://raw.githubusercontent.com/omegatymbjiep/schemas/main/json-ld/NaturalPerson.json-ld',
              credentialSubject: {
                isNatural: {
                  $eq: 1,
                },
              },
              type: 'NaturalPerson',
            },
          },
        },
      },
    })
  }, [provider?.address, rawProvider])

  const init = useCallback(async () => {
    const _isFlaskDetected = await isFlask()
    setIsFlaskInstalled(_isFlaskDetected)

    if (!_isFlaskDetected) throw new TypeError(`The wallet is not Flask`)

    await sleep(1000)

    const snaps = await getSnaps()

    const _isSnapConnected = Boolean(snaps?.[defaultSnapOrigin])
    setIsSnapConnected(_isSnapConnected)

    return {
      isFlaskDetected: _isFlaskDetected,
      isSnapConnected: _isSnapConnected,
    }
  }, [getSnaps, isFlask])

  return (
    <MetamaskZkpSnapContext.Provider
      value={{
        isFlaskInstalled,
        isSnapConnected,

        isLocalSnap,
        isFlask,

        getSnaps,
        connectSnap,
        getSnap,
        createIdentity,
        getVerifiableCredentials,
        createNaturalPersonProof,

        init,
      }}
    >
      {children}
    </MetamaskZkpSnapContext.Provider>
  )
}

export default MetamaskZkpSnapContextProvider
