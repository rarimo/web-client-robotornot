import { AuthZkp, VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { ZKP_OPERATORS, ZkpGen } from '@rarimo/zkp-gen-iden3'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'

import { useWeb3Context } from '@/contexts'

type QueryVariableName = { isNatural: number }

interface ZkpContextValue {
  identity: Identity | undefined
  createIdentity: (privateKeyHex?: string) => Promise<Identity>
  getVerifiableCredentials: () => Promise<void>
  getZkProof: () => Promise<void>
}

export const zkpContext = createContext<ZkpContextValue>({
  identity: new Identity(),
  createIdentity: async () => {
    throw new Error(`createIdentity() not implemented`)
  },
  getVerifiableCredentials: async () => {
    throw new Error(`getVerifiableCredentials() not implemented`)
  },
  getZkProof: async () => {
    throw new Error(`getZkProof() not implemented`)
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

  const getVerifiableCredentials = useCallback(async () => {
    if (!identity) return

    AuthZkp.setConfig({
      RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
      STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
      ISSUER_API_URL: 'http://127.0.0.1:8000/',
    })
    const authProof = new AuthZkp<QueryVariableName>(identity)

    setVerifiableCredentials(await authProof.getVerifiableCredentials())
  }, [identity])

  const getZkProof = useCallback(async () => {
    if (!identity) return

    ZkpGen.setConfig({
      RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
      STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
      ISSUER_API_URL: 'http://127.0.0.1:8000/',
    })

    const zkProof = new ZkpGen<QueryVariableName>({
      requestId: '1',
      identity: identity,
      verifiableCredentials:
        verifiableCredentials as VerifiableCredentials<QueryVariableName>,

      challenge: String(provider?.address).substring(2),

      query: {
        variableName: 'isNatural',
        operator: ZKP_OPERATORS.EQUALS,
        value: ['1'],
      },
    })

    await zkProof.generateProof()

    setIsNaturalZkp(zkProof)
  }, [identity, provider?.address, verifiableCredentials])

  return (
    <zkpContext.Provider
      value={{
        identity,
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
