import { SUPPORTED_CHAINS } from '@config'
import { type ZKProof } from '@iden3/js-jwz'
import { ClaimOffer, VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'

import { api } from '@/api'
import { sleep } from '@/helpers'
import { useMetamaskZkpSnap } from '@/hooks'

type QueryVariableName = { isNatural: number }

interface ZkpContextValue {
  identityIdString: string
  isNaturalZkp: ZKProof | undefined
  verifiableCredentials: VerifiableCredentials<QueryVariableName> | undefined

  isClaimOfferExists: (identityIdString?: string) => Promise<boolean>
  getClaimOffer: (identityIdString?: string) => Promise<ClaimOffer>
  createIdentity: () => Promise<string>
  getVerifiableCredentials: (
    chain: SUPPORTED_CHAINS,
  ) => Promise<VerifiableCredentials<QueryVariableName>>
  getZkProof: (
    chain: SUPPORTED_CHAINS,
    _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
  ) => Promise<unknown>
}

export const zkpContext = createContext<ZkpContextValue>({
  identityIdString: '',
  isNaturalZkp: undefined,
  verifiableCredentials: undefined,

  getClaimOffer: async (identityIdString?: string) => {
    throw new TypeError(
      `getClaimOffer() not implemented for ${identityIdString}`,
    )
  },

  isClaimOfferExists: async (identityIdString?: string) => {
    throw new TypeError(
      `isClaimOfferExists() not implemented for ${identityIdString}`,
    )
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
  const {
    createIdentity: _createIdentity,
    getVerifiableCredentials: _getVerifiableCredentials,
    createNaturalPersonProof,
  } = useMetamaskZkpSnap()

  const [identityIdString, setIdentityIdString] = useState('')
  const [verifiableCredentials, setVerifiableCredentials] =
    useState<VerifiableCredentials<QueryVariableName>>()
  const [isNaturalZkp, setIsNaturalZkp] = useState<ZKProof>()

  const createIdentity = useCallback(async () => {
    const identityIdString = (await _createIdentity()).split(':')[2]
    setIdentityIdString(identityIdString)

    return identityIdString
  }, [_createIdentity])

  const getClaimOffer = useCallback(
    async (_identityIdString?: string) => {
      const { data } = await api.get<ClaimOffer>(
        `/integrations/issuer/v1/public/claims/offers/${
          _identityIdString ?? identityIdString
        }/NaturalPerson`,
      )

      return data
    },
    [identityIdString],
  )

  const isClaimOfferExists = useCallback(
    async (identityIdString?: string) => {
      const MAX_TRIES_COUNT = 10
      let tryCounter = 0

      while (tryCounter < MAX_TRIES_COUNT) {
        try {
          await getClaimOffer(identityIdString)

          return true
        } catch (error) {
          /* empty */
        }

        await sleep(3000)
        tryCounter++
      }

      return false
    },
    [getClaimOffer],
  )

  const getVerifiableCredentials = useCallback(async (): Promise<
    VerifiableCredentials<QueryVariableName>
  > => {
    if (!identityIdString) throw new TypeError('Identity is not defined')

    const verifiableCredentials = (await _getVerifiableCredentials(
      await getClaimOffer(),
    )) as VerifiableCredentials<QueryVariableName>

    setVerifiableCredentials(verifiableCredentials)

    return verifiableCredentials
  }, [_getVerifiableCredentials, getClaimOffer, identityIdString])

  const getZkProof = useCallback(
    async (
      chain: SUPPORTED_CHAINS,
      _verifiableCredentials?: VerifiableCredentials<QueryVariableName>,
    ) => {
      const currentVerifiableCredentials =
        _verifiableCredentials ?? verifiableCredentials

      if (!identityIdString) throw new TypeError('Identity is not defined')

      if (!currentVerifiableCredentials)
        throw new TypeError('VerifiableCredentials is not defined')

      const zkProof = await createNaturalPersonProof()

      setIsNaturalZkp(zkProof)

      return zkProof
    },
    [createNaturalPersonProof, identityIdString, verifiableCredentials],
  )

  return (
    <zkpContext.Provider
      value={{
        identityIdString,
        isNaturalZkp,
        verifiableCredentials,

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
