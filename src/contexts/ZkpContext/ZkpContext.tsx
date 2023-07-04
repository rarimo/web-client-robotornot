import { config, SUPPORTED_CHAINS, SUPPORTED_CHAINS_DETAILS } from '@config'
import {
  AuthZkp,
  ClaimOffer,
  VerifiableCredentials,
} from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { ZkpGen, ZkpOperators } from '@rarimo/zkp-gen-iden3'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { sleep } from '@/helpers'

type QueryVariableName = { isNatural: number }

interface ZkpContextValue {
  identity: Identity | undefined
  isNaturalZkp: ZkpGen<QueryVariableName> | undefined

  isClaimOfferExists: (_identity?: Identity) => Promise<boolean>
  getClaimOffer: (_identity?: Identity) => Promise<ClaimOffer>
  createIdentity: (privateKeyHex?: string) => Promise<Identity>
  getVerifiableCredentials: (
    chain: SUPPORTED_CHAINS,
  ) => Promise<VerifiableCredentials<QueryVariableName>>
  getZkProof: (
    chain: SUPPORTED_CHAINS,
    _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
  ) => Promise<ZkpGen<QueryVariableName>>
}

export const zkpContext = createContext<ZkpContextValue>({
  identity: new Identity(),
  isNaturalZkp: undefined,

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
  getVerifiableCredentials: async (chain: SUPPORTED_CHAINS) => {
    throw new TypeError(
      `getVerifiableCredentials() not implemented for ${chain}`,
    )
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

type Props = HTMLAttributes<HTMLDivElement>

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const { provider } = useWeb3Context()

  const [identity, setIdentity] = useState<Identity>()
  const [verifiableCredentials, setVerifiableCredentials] =
    useState<VerifiableCredentials<QueryVariableName>>()
  const [isNaturalZkp, setIsNaturalZkp] = useState<ZkpGen<QueryVariableName>>()

  const createIdentity = useCallback(async (privateKeyHex?: string) => {
    Identity.setConfig({
      // TODO: move to .env
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
        }/NaturalPerson`,
      )

      return data
    },
    [identity?.idString],
  )

  const isClaimOfferExists = useCallback(
    async (_identity?: Identity) => {
      const MAX_TRIES_COUNT = 10
      let tryCounter = 0

      while (tryCounter < MAX_TRIES_COUNT) {
        try {
          await getClaimOffer(_identity)

          return true
        } catch (error) {
          /* empty */
        }

        await sleep(1000)
        tryCounter++
      }

      return false
    },
    [getClaimOffer],
  )

  const getVerifiableCredentials = useCallback(
    async (
      chain: SUPPORTED_CHAINS,
    ): Promise<VerifiableCredentials<QueryVariableName>> => {
      if (!identity) throw new TypeError('Identity is not defined')

      AuthZkp.setConfig({
        RPC_URL: SUPPORTED_CHAINS_DETAILS[chain].rpcUrl,
        STATE_V2_ADDRESS: config?.[`STATE_V2_CONTRACT_ADDRESS_${chain}`],
        ISSUER_API_URL: config.API_URL,

        CIRCUIT_FINAL_KEY_URL: AuthZkp.config.CIRCUIT_FINAL_KEY_URL,
        CIRCUIT_WASM_URL: AuthZkp.config.CIRCUIT_WASM_URL,
      })

      const authProof = new AuthZkp<QueryVariableName>(identity)

      const verifiableCredentials = await authProof.getVerifiableCredentials()

      setVerifiableCredentials(verifiableCredentials)

      return verifiableCredentials
    },
    [identity],
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
        RPC_URL: SUPPORTED_CHAINS_DETAILS[chain].rpcUrl,
        STATE_V2_ADDRESS: config?.[`STATE_V2_CONTRACT_ADDRESS_${chain}`],
        ISSUER_API_URL: config.API_URL,

        CIRCUIT_FINAL_KEY_URL: ZkpGen.config.CIRCUIT_FINAL_KEY_URL,
        CIRCUIT_WASM_URL: ZkpGen.config.CIRCUIT_WASM_URL,
        CLAIM_PROOF_SIBLINGS_COUNT: ZkpGen.config.CLAIM_PROOF_SIBLINGS_COUNT,
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
        },
      })

      await zkProof.generateProof()

      setIsNaturalZkp(zkProof)

      return zkProof
    },
    [identity, provider?.address, verifiableCredentials],
  )

  return (
    <zkpContext.Provider
      value={{
        identity,
        isNaturalZkp,

        getClaimOffer,
        isClaimOfferExists,
        createIdentity,
        getVerifiableCredentials,
        getZkProof,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
