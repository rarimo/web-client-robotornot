import { config, SUPPORTED_CHAINS } from '@config'
import type {
  SaveCredentialsRequestParams,
  StateInfo,
  W3CCredential,
  ZKPProofResponse,
} from '@electr1xxxx/conector'
import { type TransactionRequest } from '@ethersproject/providers'
import { DID } from '@iden3/js-iden3-core'
import type { ZKProof } from '@iden3/js-jwz'
import { CircuitId } from '@rarimo/zkp-gen-iden3'
import {
  createContext,
  FC,
  HTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffectOnce, useLocalStorage } from 'react-use'

import { api } from '@/api'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import { RoutesPaths, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { GaCategories, gaSendCustomEvent, sleep } from '@/helpers'

export type QueryVariableName = { isNatural: number }

export type StatesMerkleProof = {
  issuerId: string
  state: StateInfo
  merkleProof: string[]
}

interface ZkpContextValue {
  identityIdString: string
  identityBigIntString: string

  publishedChains: {
    get?: SUPPORTED_CHAINS[]
    set: (value: SUPPORTED_CHAINS[]) => void
  }

  verifiableCredentials?: W3CCredential

  selectedKycProvider: {
    get?: SUPPORTED_KYC_PROVIDERS
    set: (value: SUPPORTED_KYC_PROVIDERS) => void
  }

  isUserSubmittedZkp: {
    get?: boolean
    set: (value: boolean) => void
  }

  zkProof: {
    get?: ZKProof
    set: (value: ZKProof) => void
  }
  statesMerkleProof: StatesMerkleProof
  transitStateTx: TransactionRequest

  isClaimOfferExists: (
    _identityIdString?: string,
    triesLimit?: number,
  ) => Promise<boolean>
  getClaimOffer: (
    _identityIdString?: string,
  ) => Promise<SaveCredentialsRequestParams>
  createIdentity: () => Promise<string | undefined>
  getVerifiableCredentials: (
    _identityIdString?: string,
  ) => Promise<W3CCredential | undefined>
  getZkProof: () => Promise<ZKPProofResponse | undefined>

  reset: () => void
}

export const zkpContext = createContext<ZkpContextValue>({
  identityIdString: '',
  identityBigIntString: '',

  publishedChains: {
    get: [],
    set: () => {
      throw new TypeError(`publishedChains.set() not implemented`)
    },
  },
  verifiableCredentials: undefined,

  selectedKycProvider: {
    get: undefined,
    set: (value: SUPPORTED_KYC_PROVIDERS) => {
      throw new TypeError(
        `selectedKycProvider.set() not implemented for ${value}`,
      )
    },
  },

  isUserSubmittedZkp: {
    get: false,
    set: (value: boolean) => {
      throw new TypeError(
        `isUserSubmittedZkp.set() not implemented for ${value}`,
      )
    },
  },

  zkProof: {
    get: undefined,
    set: (value: ZKProof) => {
      throw new TypeError(
        `zkProof.set() not implemented for ${JSON.stringify(value)}`,
      )
    },
  },
  statesMerkleProof: {} as StatesMerkleProof,
  transitStateTx: {} as TransactionRequest,

  getClaimOffer: async () => {
    throw new TypeError(`getClaimOffer() not implemented`)
  },

  isClaimOfferExists: async () => {
    throw new TypeError(`isClaimOfferExists() not implemented`)
  },
  createIdentity: async () => {
    throw new TypeError(`createIdentity() not implemented`)
  },
  getVerifiableCredentials: async () => {
    throw new TypeError(`getVerifiableCredentials() not implemented`)
  },
  getZkProof: async () => {
    throw new TypeError(`getZkProof() not implemented`)
  },

  reset: () => {
    throw new TypeError(`reset() not implemented`)
  },
})

type Props = HTMLAttributes<HTMLDivElement>

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const zkpSnap = useMetamaskZkpSnapContext()

  const navigate = useNavigate()

  // FIXME
  const [searchParams] = useSearchParams()

  const { provider } = useWeb3Context()

  const [
    selectedKycProvider,
    setSelectedKycProvider,
    removeSelectedKycProvider,
  ] = useLocalStorage<SUPPORTED_KYC_PROVIDERS>('selectedKycProvider', undefined)

  const [isUserSubmittedZkp, setIsUserSubmittedZkp] = useLocalStorage<boolean>(
    'isZkpSubmitted',
    false,
  )

  const [zkProof, setZkProof] = useLocalStorage<ZKProof>('zkps', undefined)
  const [statesMerkleProof, setStatesMerkleProof] =
    useState<StatesMerkleProof>()
  const [transitStateTx, setTransitStateTx] = useState<TransactionRequest>()

  const [verifiableCredentials, setVerifiableCredentials] =
    useLocalStorage<W3CCredential>('vc', undefined)

  const [identityIdString, setIdentityIdstring] = useState<string>('')

  const identityBigIntString = useMemo(() => {
    return identityIdString
      ? DID.parse(`did:iden3:${identityIdString}`).id.bigInt().toString()
      : ''
  }, [identityIdString])

  const [publishedChains, setPublishedChains] = useLocalStorage<
    SUPPORTED_CHAINS[]
  >('submittedChains', [])

  const createIdentity = useCallback(async () => {
    const _identityIdString = await zkpSnap.createIdentity()

    if (!_identityIdString) throw new Error('Identity has not created')

    setIdentityIdstring(_identityIdString)

    return _identityIdString
  }, [zkpSnap])

  const getClaimOffer = useCallback(
    async (_identityIdString?: string) => {
      const currIdentityIdString = _identityIdString ?? identityIdString

      const { data } = await api.get<SaveCredentialsRequestParams>(
        `/integrations/issuer/v1/public/claims/offers/${currIdentityIdString}/IdentityProviders`,
      )

      return data
    },
    [identityIdString],
  )

  const isClaimOfferExists = useCallback(
    async (
      _identityIdString?: string,
      triesLimit = config.CLAIM_OFFER_MAX_TRIES_COUNT,
    ) => {
      const currIdentityIdString = _identityIdString ?? identityIdString

      let tryCounter = 0

      while (tryCounter < triesLimit) {
        try {
          await getClaimOffer(currIdentityIdString)

          return true
        } catch (error) {
          /* empty */
        }

        await sleep(config.CLAIM_OFFER_DELAY)
        tryCounter++
      }

      return false
    },
    [getClaimOffer, identityIdString],
  )

  const getVerifiableCredentials = useCallback(
    async (_identityIdString?: string): Promise<W3CCredential | undefined> => {
      const currentIdentityIdString = _identityIdString ?? identityIdString

      let vc: W3CCredential | undefined = verifiableCredentials

      if (
        !(
          currentIdentityIdString &&
          vc?.credentialSubject?.id &&
          typeof vc?.credentialSubject?.id === 'string' &&
          vc?.credentialSubject?.id?.includes?.(currentIdentityIdString)
        )
      ) {
        vc = (
          await zkpSnap.getVerifiableCredentials(
            await getClaimOffer(currentIdentityIdString),
          )
        )?.[0]
      }

      setVerifiableCredentials(vc)

      gaSendCustomEvent(GaCategories.GettingVerifiableCredentials)

      return vc
    },
    [
      getClaimOffer,
      identityIdString,
      setVerifiableCredentials,
      verifiableCredentials,
      zkpSnap,
    ],
  )

  const getZkProof = useCallback(async (): Promise<
    ZKPProofResponse | undefined
  > => {
    const zkProofResponse = await zkpSnap.createProof({
      circuitId: CircuitId.AtomicQueryMTPV2OnChain,
      accountAddress: provider?.address,

      query: {
        allowedIssuers: ['*'],
        credentialSubject: {
          isNatural: {
            $eq: 1,
          },
        },
        type: 'IdentityProviders',
      },
    })

    setZkProof(zkProofResponse?.zkpProof)

    setStatesMerkleProof(zkProofResponse?.statesMerkleData)

    setTransitStateTx(zkProofResponse?.updateStateTx)

    return zkProofResponse
  }, [zkpSnap, provider?.address, setZkProof])

  const reset = useCallback(() => {
    setIdentityIdstring('')
    setZkProof(undefined)
    setVerifiableCredentials(undefined)
    setPublishedChains([])
    setSelectedKycProvider(undefined)
    setIsUserSubmittedZkp(false)

    localStorage.clear()
  }, [
    setIsUserSubmittedZkp,
    setPublishedChains,
    setSelectedKycProvider,
    setVerifiableCredentials,
    setZkProof,
  ])

  useEffectOnce(() => {
    if (
      selectedKycProvider &&
      !verifiableCredentials &&
      !searchParams.get('id_token')
    ) {
      removeSelectedKycProvider()
    }

    if (isUserSubmittedZkp) {
      navigate(RoutesPaths.authSuccess)
    } else if (verifiableCredentials) {
      navigate(RoutesPaths.authPreview)
    } else {
      if (
        selectedKycProvider === SUPPORTED_KYC_PROVIDERS.WORLDCOIN ||
        // FIXME
        searchParams.get('id_token')
      )
        return

      navigate(RoutesPaths.authProviders)
    }
  })

  return (
    <zkpContext.Provider
      value={{
        identityIdString,
        identityBigIntString,

        publishedChains: {
          get: publishedChains,
          set: setPublishedChains,
        },
        verifiableCredentials,

        selectedKycProvider: {
          get: selectedKycProvider,
          set: setSelectedKycProvider,
        },

        isUserSubmittedZkp: {
          get: isUserSubmittedZkp,
          set: setIsUserSubmittedZkp,
        },

        zkProof: {
          get: zkProof,
          set: setZkProof,
        },
        statesMerkleProof: statesMerkleProof ?? ({} as StatesMerkleProof),
        transitStateTx: transitStateTx ?? {},

        getClaimOffer,
        isClaimOfferExists,
        createIdentity,
        getVerifiableCredentials,
        getZkProof,

        reset,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
