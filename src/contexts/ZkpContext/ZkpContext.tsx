import { config, SUPPORTED_CHAINS, SUPPORTED_CHAINS_DETAILS } from '@config'
import { FetcherError, HTTP_STATUS_CODES } from '@distributedlab/fetcher'
import {
  AuthZkp,
  ClaimOffer,
  VerifiableCredentials,
} from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { CircuitId, ZkpGen, ZkpOperators } from '@rarimo/zkp-gen-iden3'
import {
  createContext,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { api, querier } from '@/api'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { sleep } from '@/helpers'

export type QueryVariableName = { isNatural: number }

interface ZkpContextValue {
  identity: Identity | undefined
  isNaturalZkp: ZkpGen<QueryVariableName> | undefined
  publishedChains: {
    get: SUPPORTED_CHAINS[]
    set: (value: SetStateAction<SUPPORTED_CHAINS[]>) => void
  }
  verifiableCredentials?: VerifiableCredentials<QueryVariableName>
  CHAINS_DETAILS_MAP: Record<SUPPORTED_CHAINS, ChainToPublish>

  isClaimOfferExists: (_identity?: Identity) => Promise<boolean>
  getClaimOffer: (_identity?: Identity) => Promise<ClaimOffer>
  createIdentity: (privateKeyHex?: string) => Promise<Identity>
  getVerifiableCredentials: (
    chain: SUPPORTED_CHAINS,
    currentIdentity?: Identity,
  ) => Promise<VerifiableCredentials<QueryVariableName>>
  loadStatesDetails: (zkProof?: ZkpGen<QueryVariableName>) => Promise<void>
  getZkProof: (
    chain: SUPPORTED_CHAINS,
    _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
  ) => Promise<ZkpGen<QueryVariableName>>
}

export const zkpContext = createContext<ZkpContextValue>({
  identity: new Identity(),
  isNaturalZkp: undefined,
  publishedChains: {
    get: [],
    set: () => {
      throw new TypeError(`publishedChains.set() not implemented`)
    },
  },
  verifiableCredentials: undefined,
  CHAINS_DETAILS_MAP: {
    [SUPPORTED_CHAINS.POLYGON]: {
      title: 'Polygon chain',
      value: SUPPORTED_CHAINS.POLYGON,
      iconName: ICON_NAMES.polygon,
    },
    [SUPPORTED_CHAINS.POLYGON_TESTNET]: {
      title: 'Polygon Testnet chain',
      value: SUPPORTED_CHAINS.POLYGON_TESTNET,
      iconName: ICON_NAMES.polygon,
    },
    [SUPPORTED_CHAINS.SEPOLIA]: {
      title: 'Sepolia chain',
      value: SUPPORTED_CHAINS.SEPOLIA,
      iconName: ICON_NAMES.ethereum,
    },
  },

  getClaimOffer: async (_identity?: Identity) => {
    throw new TypeError(
      `getClaimOffer() not implemented for ${_identity?.idString}`,
    )
  },

  isClaimOfferExists: async (_identity?: Identity) => {
    throw new TypeError(`isClaimOfferExists() not implemented for ${_identity}`)
  },
  createIdentity: async () => {
    throw new TypeError(`createIdentity() not implemented`)
  },
  getVerifiableCredentials: async (
    chain: SUPPORTED_CHAINS,
    currentIdentity?: Identity,
  ) => {
    throw new TypeError(
      `getVerifiableCredentials() not implemented for ${chain} ${
        currentIdentity?.idString ? `and ${currentIdentity?.idString}` : ''
      }`,
    )
  },
  loadStatesDetails: async (zkProof?: ZkpGen<QueryVariableName>) => {
    throw new TypeError(`loadStatesDetails() not implemented for ${zkProof}`)
  },
  getZkProof: async (
    chain: SUPPORTED_CHAINS,
    _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
  ) => {
    throw new TypeError(
      `getZkProof() not implemented for ${chain} ${
        `and ${_verifiableCredentials}?.id` ?? ''
      }`,
    )
  },
})

type ChainToPublish = {
  title: string
  value: string
  iconName: ICON_NAMES
}

type Props = HTMLAttributes<HTMLDivElement>

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const { provider } = useWeb3Context()

  const [identity, setIdentity] = useState<Identity>()
  const [verifiableCredentials, setVerifiableCredentials] =
    useState<VerifiableCredentials<QueryVariableName>>()
  const [isNaturalZkp, setIsNaturalZkp] = useState<ZkpGen<QueryVariableName>>()

  const [publishedChains, setPublishedChains] = useState<SUPPORTED_CHAINS[]>([])
  const CHAINS_DETAILS_MAP = useMemo<Record<SUPPORTED_CHAINS, ChainToPublish>>(
    () => ({
      [SUPPORTED_CHAINS.POLYGON]: {
        title: 'Polygon chain',
        value: SUPPORTED_CHAINS.POLYGON,
        iconName: ICON_NAMES.polygon,
      },
      [SUPPORTED_CHAINS.POLYGON_TESTNET]: {
        title: 'Polygon Testnet chain',
        value: SUPPORTED_CHAINS.POLYGON_TESTNET,
        iconName: ICON_NAMES.polygon,
      },
      [SUPPORTED_CHAINS.SEPOLIA]: {
        title: 'Sepolia chain',
        value: SUPPORTED_CHAINS.SEPOLIA,
        iconName: ICON_NAMES.ethereum,
      },
    }),
    [],
  )

  const createIdentity = useCallback(async (privateKeyHex?: string) => {
    Identity.setConfig({
      AUTH_BJJ_CREDENTIAL_HASH: config.AUTH_BJJ_CREDENTIAL_HASH,
    })

    const newIdentity = await Identity.create(privateKeyHex)

    setIdentity(newIdentity)

    return newIdentity
  }, [])

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
    async (_identity?: Identity) => {
      let tryCounter = 0

      while (tryCounter < config.CLAIM_OFFER_MAX_TRIES_COUNT) {
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

  const getVerifiableCredentials = useCallback(
    async (
      chain: SUPPORTED_CHAINS,
      _identity?: Identity,
    ): Promise<VerifiableCredentials<QueryVariableName>> => {
      const currentIdentity = _identity ?? identity

      if (!currentIdentity) throw new TypeError('Identity is not defined')

      AuthZkp.setConfig({
        RPC_URL: config.RARIMO_EVM_RPC_URL,
        STATE_V2_ADDRESS: config.STATE_V2_CONTRACT_ADDRESS,
        ISSUER_API_URL: config.API_URL,
      })

      const authProof = new AuthZkp<QueryVariableName>(currentIdentity)

      const verifiableCredentials = await authProof.getVerifiableCredentials(
        'IdentityProviders',
      )

      setVerifiableCredentials(verifiableCredentials)

      return verifiableCredentials
    },
    [identity],
  )

  const loadStatesDetails = useCallback(
    async (zkProof?: ZkpGen<QueryVariableName>) => {
      const currentZkp = zkProof || isNaturalZkp

      do {
        try {
          await currentZkp?.loadStatesDetails(querier)
          await currentZkp?.loadMerkleProof(querier, config.ISSUER_ID)
        } catch (error) {
          if (
            error instanceof FetcherError &&
            error.response.status === HTTP_STATUS_CODES.BAD_REQUEST
          ) {
            await sleep(30 * 1000)
          } else {
            throw error
          }
        }
      } while (
        !currentZkp?.targetStateDetails ||
        !currentZkp?.coreStateDetails ||
        !currentZkp?.operationProof ||
        !currentZkp?.merkleProof
      )
    },
    [isNaturalZkp],
  )

  const getZkProof = useCallback(
    async (
      chain: SUPPORTED_CHAINS,
      _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
    ): Promise<ZkpGen<QueryVariableName>> => {
      const currentVerifiableCredentials =
        _verifiableCredentials ?? verifiableCredentials

      if (!identity) throw new TypeError('Identity is not defined')

      if (!currentVerifiableCredentials)
        throw new TypeError('VerifiableCredentials is not defined')

      ZkpGen.setConfig({
        CORE_CHAIN_RPC_URL: config.RARIMO_EVM_RPC_URL,
        TARGET_CHAIN_RPC_URL: SUPPORTED_CHAINS_DETAILS[chain].rpcUrl,
        STATE_V2_ADDRESS: config.STATE_V2_CONTRACT_ADDRESS,
        LIGHTWEIGHT_STATE_V2_ADDRESS:
          config?.[`LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${chain}`],
        ISSUER_API_URL: config.API_URL,
      })

      const zkProof = new ZkpGen<QueryVariableName>({
        requestId: '1',
        identity: identity,
        verifiableCredentials: currentVerifiableCredentials,

        challenge: String(provider?.address).substring(2),

        query: {
          variableName: 'isNatural',
          operator: ZkpOperators.Equals,
          value: ['1'],
          circuitId: CircuitId.AtomicQueryMTPV2OnChain,
          issuerId: config.ISSUER_ID,
        },
      })

      await zkProof.generateProof()

      await loadStatesDetails(zkProof)

      setIsNaturalZkp(zkProof)

      return zkProof
    },
    [identity, loadStatesDetails, provider?.address, verifiableCredentials],
  )

  return (
    <zkpContext.Provider
      value={{
        identity,
        isNaturalZkp,
        publishedChains: {
          get: publishedChains,
          set: setPublishedChains,
        },
        verifiableCredentials,
        CHAINS_DETAILS_MAP,

        getClaimOffer,
        isClaimOfferExists,
        createIdentity,
        getVerifiableCredentials,
        loadStatesDetails,
        getZkProof,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
