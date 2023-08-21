import { config, SUPPORTED_CHAINS } from '@config'
import { FetcherError, HTTP_STATUS_CODES } from '@distributedlab/fetcher'
import type { ZKProof } from '@iden3/js-jwz'
import {
  AuthZkp,
  ClaimOffer,
  VerifiableCredentials,
} from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { FileEmptyError } from '@rarimo/shared-zkp-iden3'
import { CircuitId, ZkpGen, ZkpOperators } from '@rarimo/zkp-gen-iden3'
import {
  createContext,
  FC,
  HTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffectOnce, useLocalStorage } from 'react-use'

import { api, querier } from '@/api'
import { useWeb3Context } from '@/contexts'
import { RoutesPaths, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import {
  GaCategories,
  gaSendCustomEvent,
  pureFileBytesLoading,
  sleep,
} from '@/helpers'

export type QueryVariableName = { isNatural: number }

interface ZkpContextValue {
  identity: Identity | undefined
  zkpGen: ZkpGen<QueryVariableName> | undefined

  publishedChains: {
    get?: SUPPORTED_CHAINS[]
    set: (value: SUPPORTED_CHAINS[]) => void
  }
  verifiableCredentials?: VerifiableCredentials<QueryVariableName>

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

  isStatesDetailsLoaded: boolean

  isClaimOfferExists: (
    _identity?: Identity,
    triesLimit?: number,
  ) => Promise<boolean>
  getClaimOffer: (_identity?: Identity) => Promise<ClaimOffer>
  createIdentity: (privateKeyHex?: string) => Promise<Identity>
  getVerifiableCredentials: (
    identity?: Identity,
  ) => Promise<VerifiableCredentials<QueryVariableName> | undefined>
  loadStatesDetails: (
    zkProof?: ZkpGen<QueryVariableName>,
  ) => Promise<ZkpGen<QueryVariableName> | undefined>
  getZkProof: () => Promise<ZkpGen<QueryVariableName>>

  reset: () => void
}

export const zkpContext = createContext<ZkpContextValue>({
  identity: new Identity(),
  zkpGen: undefined,
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

  isStatesDetailsLoaded: false,

  getClaimOffer: async (_identity?: Identity) => {
    throw new TypeError(
      `getClaimOffer() not implemented for ${_identity?.idString}`,
    )
  },

  isClaimOfferExists: async (_identity?: Identity, triesLimit?: number) => {
    throw new TypeError(
      `isClaimOfferExists() not implemented for ${_identity?.idString} and ${triesLimit}`,
    )
  },
  createIdentity: async () => {
    throw new TypeError(`createIdentity() not implemented`)
  },
  getVerifiableCredentials: async (currentIdentity?: Identity) => {
    throw new TypeError(
      `getVerifiableCredentials() not implemented${
        currentIdentity?.idString ? ` for ${currentIdentity?.idString}` : ''
      }`,
    )
  },
  loadStatesDetails: async (zkProof?: ZkpGen<QueryVariableName>) => {
    throw new TypeError(`loadStatesDetails() not implemented for ${zkProof}`)
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
  const navigate = useNavigate()
  const location = useLocation()

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

  const [storagePK, setStoragePK] = useLocalStorage('pkey', '')

  const [verifiableCredentials, setVerifiableCredentials] = useLocalStorage<
    VerifiableCredentials<QueryVariableName>
  >('vc', undefined)

  const [identity, setIdentity] = useState<Identity>()

  const [publishedChains, setPublishedChains] = useLocalStorage<
    SUPPORTED_CHAINS[]
  >('submittedChains', [])

  const authZkp = useMemo<AuthZkp<QueryVariableName> | undefined>(() => {
    if (!identity) return undefined

    AuthZkp.setConfig({
      RPC_URL: config.RARIMO_EVM_RPC_URL,
      STATE_V2_ADDRESS: config.STATE_V2_CONTRACT_ADDRESS,
      ISSUER_API_URL: config.API_URL,

      ...(config?.CIRCUIT_URLS?.auth?.wasm
        ? {
            CIRCUIT_WASM_URL: config.CIRCUIT_URLS.auth.wasm,
          }
        : {}),

      ...(config?.CIRCUIT_URLS?.auth?.zkey
        ? {
            CIRCUIT_FINAL_KEY_URL: config.CIRCUIT_URLS.auth.zkey,
          }
        : {}),
    })

    return new AuthZkp<QueryVariableName>(identity)
  }, [identity])

  const zkpGen = useMemo<ZkpGen<QueryVariableName> | undefined>(() => {
    if (!identity || !verifiableCredentials) return undefined

    ZkpGen.setConfig({
      CORE_CHAIN_RPC_URL: config.RARIMO_EVM_RPC_URL,
      TARGET_CHAIN_RPC_URL:
        config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN].rpcUrl,
      STATE_V2_ADDRESS: config.STATE_V2_CONTRACT_ADDRESS,
      LIGHTWEIGHT_STATE_V2_ADDRESS:
        config?.[
          `LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`
        ],
      ISSUER_API_URL: config.API_URL,

      ...(config?.CIRCUIT_URLS?.sigV2OnChain?.wasm
        ? {
            CIRCUIT_SIG_V2_ON_CHAIN_WASM_URL:
              config.CIRCUIT_URLS.sigV2OnChain.wasm,
          }
        : {}),
      ...(config?.CIRCUIT_URLS?.sigV2OnChain?.zkey
        ? {
            CIRCUIT_SIG_V2_ON_CHAIN_FINAL_KEY_URL:
              config.CIRCUIT_URLS.sigV2OnChain.zkey,
          }
        : {}),

      ...(config?.CIRCUIT_URLS?.sigV2?.wasm
        ? {
            CIRCUIT_SIG_V2_WASM_URL: config.CIRCUIT_URLS.sigV2.wasm,
          }
        : {}),
      ...(config?.CIRCUIT_URLS?.sigV2?.zkey
        ? {
            CIRCUIT_SIG_V2_FINAL_KEY_URL: config.CIRCUIT_URLS.sigV2.zkey,
          }
        : {}),

      ...(config?.CIRCUIT_URLS?.mtpV2OnChain?.wasm
        ? {
            CIRCUIT_MTP_V2_ON_CHAIN_WASM_URL:
              config.CIRCUIT_URLS.mtpV2OnChain.wasm,
          }
        : {}),
      ...(config?.CIRCUIT_URLS?.mtpV2OnChain?.zkey
        ? {
            CIRCUIT_MTP_V2_ON_CHAIN_FINAL_KEY_URL:
              config.CIRCUIT_URLS.mtpV2OnChain.zkey,
          }
        : {}),

      ...(config?.CIRCUIT_URLS?.mtpV2?.wasm
        ? {
            CIRCUIT_MTP_V2_WASM_URL: config.CIRCUIT_URLS.mtpV2.wasm,
          }
        : {}),
      ...(config?.CIRCUIT_URLS?.mtpV2?.zkey
        ? {
            CIRCUIT_MTP_V2_FINAL_KEY_URL: config.CIRCUIT_URLS.mtpV2.zkey,
          }
        : {}),
    })

    return new ZkpGen<QueryVariableName>({
      requestId: '1',
      identity: identity,
      verifiableCredentials: verifiableCredentials,

      challenge: String(provider?.address).substring(2),

      query: {
        variableName: 'isNatural',
        operator: ZkpOperators.Equals,
        value: ['1'],
        circuitId: CircuitId.AtomicQueryMTPV2OnChain,
        issuerId: config.ISSUER_ID,
      },
    })
  }, [identity, provider?.address, verifiableCredentials])

  const createIdentity = useCallback(
    async (privateKeyHex?: string) => {
      Identity.setConfig({
        AUTH_BJJ_CREDENTIAL_HASH: config.AUTH_BJJ_CREDENTIAL_HASH,
      })

      const newIdentity = await Identity.create(privateKeyHex)

      setIdentity(newIdentity)

      if (storagePK !== newIdentity.privateKeyHex) {
        setStoragePK(newIdentity.privateKeyHex)
      }

      return newIdentity
    },
    [setStoragePK, storagePK],
  )

  const getClaimOffer = useCallback(
    async (_identity?: Identity) => {
      const { data } = await api.get<ClaimOffer>(
        `/integrations/issuer/v1/public/claims/offers/${
          _identity?.idString ?? identity?.idString
        }/IdentityProviders`,
      )

      return data
    },
    [identity?.idString],
  )

  const isClaimOfferExists = useCallback(
    async (
      _identity?: Identity,
      triesLimit = config.CLAIM_OFFER_MAX_TRIES_COUNT,
    ) => {
      let tryCounter = 0

      while (tryCounter < triesLimit) {
        try {
          await getClaimOffer(_identity)

          return true
        } catch (error) {
          /* empty */
        }

        await sleep(config.CLAIM_OFFER_DELAY)
        tryCounter++
      }

      return false
    },
    [getClaimOffer],
  )

  const loadVerifiableCredentials = useCallback(
    async (_identity?: Identity) => {
      let currentAuthZkp = authZkp
      const currentIdentity = _identity ?? identity

      if (!currentIdentity) throw new TypeError('Identity is not defined')

      if (!authZkp) {
        AuthZkp.setConfig({
          RPC_URL: config.RARIMO_EVM_RPC_URL,
          STATE_V2_ADDRESS: config.STATE_V2_CONTRACT_ADDRESS,
          ISSUER_API_URL: config.API_URL,

          ...(config?.CIRCUIT_URLS?.auth?.wasm
            ? {
                CIRCUIT_WASM_URL: config.CIRCUIT_URLS.auth.wasm,
              }
            : {}),

          ...(config?.CIRCUIT_URLS?.auth?.zkey
            ? {
                CIRCUIT_FINAL_KEY_URL: config.CIRCUIT_URLS.auth.zkey,
              }
            : {}),
        })

        currentAuthZkp = new AuthZkp<QueryVariableName>(currentIdentity)
      }

      let triesCount = 0

      do {
        try {
          const [wasm, zkey] = await Promise.all([
            pureFileBytesLoading(AuthZkp.config.CIRCUIT_WASM_URL),
            pureFileBytesLoading(AuthZkp.config.CIRCUIT_FINAL_KEY_URL),
          ])

          currentAuthZkp?.setCircuits(wasm, zkey)

          return currentAuthZkp?.getVerifiableCredentials('IdentityProviders')
        } catch (error) {
          if (error instanceof FileEmptyError) {
            triesCount++
            await sleep(500)
          } else {
            throw error
          }
        }
      } while (triesCount < config.CIRCUITS_LOADING_TRIES_LIMIT)
    },
    [authZkp, identity],
  )

  const getVerifiableCredentials = useCallback(
    async (
      _identity?: Identity,
    ): Promise<VerifiableCredentials<QueryVariableName> | undefined> => {
      const currentIdentity = _identity ?? identity

      const vc: VerifiableCredentials<QueryVariableName> | undefined =
        verifiableCredentials &&
        currentIdentity?.idString &&
        verifiableCredentials?.body?.credential?.credentialSubject?.id.includes(
          currentIdentity?.idString,
        )
          ? verifiableCredentials
          : await loadVerifiableCredentials(currentIdentity)

      setVerifiableCredentials(vc)

      gaSendCustomEvent(GaCategories.GettingVerifiableCredentials)

      return vc
    },
    [
      identity,
      loadVerifiableCredentials,
      setVerifiableCredentials,
      verifiableCredentials,
    ],
  )

  const [isStatesDetailsLoaded, setIsStatesDetailsLoaded] = useState(false)

  const loadStatesDetails = useCallback(async (): Promise<
    ZkpGen<QueryVariableName> | undefined
  > => {
    do {
      try {
        await zkpGen?.loadStatesDetails(querier)
        await zkpGen?.loadMerkleProof(querier, config.ISSUER_ID)

        setIsStatesDetailsLoaded(
          !!zkpGen?.targetStateDetails ||
            !!zkpGen?.coreStateDetails ||
            !!zkpGen?.operationProof ||
            !!zkpGen?.merkleProof,
        )

        return zkpGen
      } catch (error) {
        if (
          error instanceof FetcherError &&
          error.response.status === HTTP_STATUS_CODES.BAD_REQUEST
        ) {
          /* empty */
        } else {
          throw error
        }
      }

      await sleep(30 * 1000)
    } while (
      !zkpGen?.targetStateDetails ||
      !zkpGen?.coreStateDetails ||
      !zkpGen?.operationProof ||
      !zkpGen?.merkleProof
    )
  }, [zkpGen])

  const getZkProof = useCallback(async (): Promise<
    ZkpGen<QueryVariableName>
  > => {
    if (!zkpGen) throw new TypeError('zkpGen is not defined')

    let triesCount = 0

    do {
      try {
        const [wasm, zkey] = await Promise.all([
          pureFileBytesLoading(
            zkpGen.circuitFilesUrlsMap[zkpGen.query.circuitId].wasm,
          ),
          pureFileBytesLoading(
            zkpGen.circuitFilesUrlsMap[zkpGen.query.circuitId].zkey,
          ),
        ])

        zkpGen.setCircuits(wasm, zkey)

        await zkpGen.generateProof()
        break
      } catch (error) {
        if (error instanceof FileEmptyError) {
          triesCount++
          await sleep(500)
        } else {
          throw error
        }
      }
    } while (triesCount < config.CIRCUITS_LOADING_TRIES_LIMIT)

    await loadStatesDetails()

    setZkProof(zkpGen?.subjectProof)

    return zkpGen
  }, [zkpGen, loadStatesDetails, setZkProof])

  const reset = useCallback(() => {
    setIdentity(undefined)
    setZkProof(undefined)
    setVerifiableCredentials(undefined)
    setPublishedChains([])
    setSelectedKycProvider(undefined)
    setIsUserSubmittedZkp(false)
    setStoragePK('')

    localStorage.clear()
  }, [
    setIsUserSubmittedZkp,
    setPublishedChains,
    setSelectedKycProvider,
    setStoragePK,
    setVerifiableCredentials,
    setZkProof,
  ])

  useEffectOnce(() => {
    if (storagePK) {
      createIdentity(storagePK)
    }

    if (location.pathname === RoutesPaths.profile) return

    if (
      selectedKycProvider &&
      !verifiableCredentials &&
      // FIXME + stucked in preview loading per 1 reload
      !searchParams.get('id_token')
    ) {
      removeSelectedKycProvider()
    }

    if (isUserSubmittedZkp) {
      navigate(RoutesPaths.authSuccess)
    } else if (zkProof) {
      navigate(RoutesPaths.authConfirmation)
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
        identity,
        zkpGen,
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

        isStatesDetailsLoaded,

        getClaimOffer,
        isClaimOfferExists,
        createIdentity,
        getVerifiableCredentials,
        loadStatesDetails,
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
