import { type EthereumProvider } from '@distributedlab/w3p'
import { Hex } from '@iden3/js-crypto'
import { fromLittleEndian } from '@iden3/js-iden3-core'
import { ZKProof } from '@iden3/js-jwz'
import { type ClaimOffer } from '@rarimo/auth-zkp-iden3'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'

/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin =
  process.env.SNAP_ORIGIN ?? `local:http://localhost:8080`

export type GetSnapsResponse = Record<string, Snap>

export type Snap = {
  permissionName: string
  id: string
  version: string
  initialPermissions: Record<string, unknown>
}

export const useMetamaskZkpSnap = () => {
  const { provider } = useWeb3Context()

  const rawProvider = useMemo(
    () =>
      provider?.rawProvider as EthereumProvider & {
        request: (opts: { method: string; params: unknown }) => Promise<unknown>
      },
    [provider],
  )

  /**
   * Get the installed snaps in MetaMask.
   *
   * @returns The snaps installed in MetaMask.
   */
  const getSnaps = useCallback(async (): Promise<GetSnapsResponse> => {
    return (await rawProvider?.request?.({
      method: 'wallet_getSnaps',
    })) as unknown as GetSnapsResponse
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

  return {
    getSnaps,
    connectSnap,
    getSnap,
    createIdentity,
    getVerifiableCredentials,
    createNaturalPersonProof,
    isLocalSnap,
    isFlask,
  }
}
