import {
  AuthZkp,
  ClaimOffer,
  VerifiableCredentials,
} from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { ZKP_OPERATORS, ZkpGen } from '@rarimo/zkp-gen-iden3'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { sleep } from '@/helpers'

type QueryVariableName = { isNatural: number }

interface ZkpContextValue {
  identity: Identity | undefined
  getClaimOffer: (_identity?: Identity) => Promise<ClaimOffer>
  isClaimOfferExists: (_identity?: Identity) => Promise<boolean>
  createIdentity: (privateKeyHex?: string) => Promise<Identity>
  getVerifiableCredentials: () => Promise<
    VerifiableCredentials<QueryVariableName>
  >
  getZkProof: (
    _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
  ) => Promise<ZkpGen<QueryVariableName>>
}

export const zkpContext = createContext<ZkpContextValue>({
  identity: new Identity(),
  getClaimOffer: async (_identity?: Identity) => {
    throw new TypeError(
      `getClaimOffer() not implemented for ${_identity?.identityIdString}`,
    )
  },

  isClaimOfferExists: async (_identity?: Identity) => {
    throw new TypeError(`isClaimOfferExists() not implemented for ${_identity}`)
  },
  createIdentity: async () => {
    throw new TypeError(`createIdentity() not implemented`)
  },
  getVerifiableCredentials: async () => {
    throw new TypeError(`getVerifiableCredentials() not implemented`)
  },
  getZkProof: async (
    _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
  ) => {
    throw new TypeError(
      `getZkProof() not implemented for ${_verifiableCredentials?.id}`,
    )
  },
})

type Props = HTMLAttributes<HTMLDivElement>

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const { provider } = useWeb3Context()

  const [identity, setIdentity] = useState<Identity>()
  const [verifiableCredentials, setVerifiableCredentials] =
    useState<VerifiableCredentials<QueryVariableName>>()
  const [, setIsNaturalZkp] = useState<ZkpGen<QueryVariableName>>()

  const createIdentity = useCallback(async (privateKeyHex?: string) => {
    Identity.setConfig({
      // TODO: move to .env
      AUTH_BJJ_CREDENTIAL_HASH: 'cca3371a6cb1b715004407e325bd993c',
    })

    const newIdentity = await Identity.create(privateKeyHex)

    setIdentity(newIdentity)

    return newIdentity
  }, [])

  const getClaimOffer = useCallback(
    async (_identity?: Identity) => {
      const { data } = await api.get<ClaimOffer>(
        `/integrations/issuer/v1/public/claims/offers/${
          _identity?.identityIdString ?? identity?.identityIdString
        }/NaturalPerson`,
      )

      return data
    },
    [identity?.identityIdString],
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

  const getVerifiableCredentials = useCallback(async (): Promise<
    VerifiableCredentials<QueryVariableName>
  > => {
    if (!identity) throw new TypeError('Identity is not defined')

    AuthZkp.setConfig({
      RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
      STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
      ISSUER_API_URL: 'http://127.0.0.1:8000/',
    })
    const authProof = new AuthZkp<QueryVariableName>(identity)

    const verifiableCredentials = await authProof.getVerifiableCredentials()

    setVerifiableCredentials(verifiableCredentials)

    return verifiableCredentials
  }, [identity])

  const getZkProof = useCallback(
    async (
      _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
    ): Promise<ZkpGen<QueryVariableName>> => {
      const currentVerifiableCredentials =
        _verifiableCredentials ?? verifiableCredentials

      if (!identity) throw new TypeError('Identity is not defined')

      if (!currentVerifiableCredentials)
        throw new TypeError('VerifiableCredentials is not defined')

      ZkpGen.setConfig({
        RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
        STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
        ISSUER_API_URL: 'http://127.0.0.1:8000/',
      })

      const zkProof = new ZkpGen<QueryVariableName>({
        requestId: '1',
        identity: identity,
        verifiableCredentials: currentVerifiableCredentials,

        challenge: String(provider?.address).substring(2),

        query: {
          variableName: 'isNatural',
          operator: ZKP_OPERATORS.EQUALS,
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
