import { config, SUPPORTED_CHAINS } from '@config'
import { RuntimeError } from '@distributedlab/tools'
import { type EthTransactionResponse } from '@distributedlab/w3p'
import { type TransactionRequest } from '@ethersproject/providers'
import { DID } from '@iden3/js-iden3-core'
import type { ZKProof } from '@iden3/js-jwz'
import type {
  SaveCredentialsRequestParams,
  StateInfo,
  W3CCredential,
  ZKPProofResponse,
} from '@rarimo/rarime-connector'
import { CircuitId } from '@rarimo/zkp-gen-iden3'
import { utils } from 'ethers'
import log from 'loglevel'
import {
  createContext,
  FC,
  HTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useLocalStorage } from 'react-use'

import { api } from '@/api'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import {
  awaitFinalityBlock,
  GaCategories,
  gaSendCustomEvent,
  increaseGasLimit,
  sleep,
} from '@/helpers'
import { useIdentityVerifier } from '@/hooks/contracts'

export type QueryVariableName = { isNatural: number }

export type StatesMerkleProof = {
  issuerId: string
  state: StateInfo
  merkleProof: string[]
}

interface ZkpContextValue {
  identityIdString: string
  identityBigIntString: string
  isZKPRequestPending: boolean
  isProveRequestPending: boolean
  verifiableCredentials?: W3CCredential
  isUserSubmittedZkp: boolean
  zkProof?: ZKProof

  txSubmitExplorerLink: string

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
  submitZkp: (selectedChain: SUPPORTED_CHAINS) => Promise<void>
  getIsIdentityProvedMsg: (_identityBigIntString?: string) => Promise<string>
  parseDIDToIdentityBigIntString: (identityIdString: string) => string
}

export const zkpContext = createContext<ZkpContextValue>({
  identityIdString: '',
  identityBigIntString: '',

  txSubmitExplorerLink: '',

  verifiableCredentials: undefined,

  isZKPRequestPending: false,
  isProveRequestPending: false,
  isUserSubmittedZkp: false,

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
  submitZkp: async () => {
    throw new TypeError(`submitZkp() not implemented`)
  },
  getIsIdentityProvedMsg: () => {
    throw new TypeError(`getIsIdentityProvedString() not implemented`)
  },
  parseDIDToIdentityBigIntString: () => {
    throw new TypeError(`parseDIDToIdentityBigIntString() not implemented`)
  },
})

type Props = HTMLAttributes<HTMLDivElement>

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  /* prettier-ignore-start */
  /* eslint-disable */
  const [isZKPRequestPending, setIsZKPRequestPending] = useState(false)
  const [isProveRequestPending, setIsProveRequestPending] = useState(false)
  const [isUserSubmittedZkp, setIsUserSubmittedZkp] = useState(false)

  const [zkProof, setZkProof] = useState<ZKProof>()
  const [statesMerkleProof, setStatesMerkleProof] = useState<StatesMerkleProof>()
  const [transitStateTx, setTransitStateTx] = useState<TransactionRequest>()
  const [verifiableCredentials, setVerifiableCredentials] = useLocalStorage<W3CCredential>('vc', undefined)
  const [identityIdString, setIdentityIdString] = useState('')
  const [txSubmitHash, setTxSubmitHash] = useState('')
  /* eslint-enable */
  /* prettier-ignore-end */

  const { provider } = useWeb3Context()
  const zkpSnap = useMetamaskZkpSnapContext()

  const { getProveIdentityTxBody } = useIdentityVerifier()

  const parseDIDToIdentityBigIntString = useCallback(
    (identityIdString: string) => {
      const parsedDid = DID.parse(`did:iden3:${identityIdString}`)

      if (!parsedDid?.id?.bigInt()?.toString()) throw new Error('Invalid DID')

      return parsedDid.id.bigInt().toString()
    },
    [],
  )

  const identityBigIntString = useMemo(() => {
    if (!identityIdString) return ''

    return parseDIDToIdentityBigIntString(identityIdString)
  }, [identityIdString, parseDIDToIdentityBigIntString])

  const txSubmitExplorerLink = useMemo(() => {
    if (!txSubmitHash || !provider?.getTxUrl) return ''

    const explorerTxUrl = provider.getTxUrl(
      config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
      txSubmitHash,
    )

    return explorerTxUrl || ''
  }, [provider, txSubmitHash])

  const createIdentity = useCallback(async () => {
    if (identityIdString) return identityIdString

    const _identityIdString = await zkpSnap.createIdentity()

    if (!_identityIdString) throw new Error('Identity has not created')

    setIdentityIdString(_identityIdString)

    return _identityIdString
  }, [identityIdString, setIdentityIdString, zkpSnap])

  /**
   * GETTING VERIFIABLE CREDENTIALS
   */

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

  /**
   * GENERATING PROOF
   */

  const getZkProof = useCallback(async (): Promise<
    ZKPProofResponse | undefined
  > => {
    setIsZKPRequestPending(true)

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

    setIsZKPRequestPending(false)

    return zkProofResponse
  }, [zkpSnap, provider?.address, setZkProof])

  /**
   * SUBMITTING PROOF
   */

  const logAppStateDetails = useCallback(() => {
    log.error({
      did: identityIdString,
    })
  }, [identityIdString])

  const handleTransitStateError = useCallback(
    async (error: unknown) => {
      if (error instanceof Error && 'error' in error) {
        const str = 'Identities states root already exists'
        const currentError = error.error as RuntimeError
        const errorString = currentError?.message

        if (errorString?.includes(str)) return
      }

      await sleep(1000)

      logAppStateDetails()

      throw error
    },
    [logAppStateDetails],
  )

  const transitState = useCallback(async () => {
    if (!provider?.rawProvider) throw new TypeError('Provider is not defined')

    if (!transitStateTx?.data)
      throw new TypeError('Transit state tx is not defined')

    try {
      await provider?.signAndSendTx?.(transitStateTx)

      gaSendCustomEvent(GaCategories.TransitState)

      await awaitFinalityBlock(
        config.FINALITY_BLOCK_AMOUNT,
        provider?.rawProvider,
      )
    } catch (error) {
      await handleTransitStateError(error)
    }
  }, [provider, transitStateTx, handleTransitStateError])

  const submitZkp = useCallback(
    async (selectedChain: SUPPORTED_CHAINS) => {
      setIsProveRequestPending(true)

      try {
        if (transitStateTx?.data) {
          await transitState()
        }

        if (!provider?.address || !provider?.rawProvider)
          throw new TypeError('Provider is not defined')

        if (!zkProof?.pub_signals)
          throw new TypeError(`Pub signals is not defined`)

        if (!statesMerkleProof)
          throw new TypeError(`States merkle proof is not defined`)

        const txBody = {
          to: config?.[`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${selectedChain}`],
          ...getProveIdentityTxBody(
            {
              issuerId: statesMerkleProof.issuerId,
              issuerState: statesMerkleProof.state.hash,
              createdAtTimestamp: statesMerkleProof.state.createdAtTimestamp,
              merkleProof: statesMerkleProof.merkleProof.map(el =>
                utils.arrayify(el),
              ),
            },
            zkProof.pub_signals.map?.(el => BigInt(el)),
            [zkProof?.proof.pi_a[0], zkProof?.proof.pi_a[1]],
            [
              [zkProof?.proof.pi_b[0][1], zkProof?.proof.pi_b[0][0]],
              [zkProof?.proof.pi_b[1][1], zkProof?.proof.pi_b[1][0]],
            ],
            [zkProof?.proof.pi_c[0], zkProof?.proof.pi_c[1]],
          ),
        }

        const txReceipt = (await provider?.signAndSendTx?.({
          ...txBody,
          gasLimit: await increaseGasLimit(
            provider?.address,
            provider?.rawProvider,
            txBody,
            1.5,
          ),
        })) as EthTransactionResponse

        setTxSubmitHash(txReceipt?.transactionHash)

        setIsUserSubmittedZkp(true)

        gaSendCustomEvent(GaCategories.SubmitZkp)
      } catch (error) {
        logAppStateDetails()
        throw error
      }

      setIsProveRequestPending(false)
    },
    [
      transitStateTx?.data,
      provider,
      zkProof?.pub_signals,
      zkProof?.proof.pi_a,
      zkProof?.proof.pi_b,
      zkProof?.proof.pi_c,
      statesMerkleProof,
      getProveIdentityTxBody,
      setIsUserSubmittedZkp,
      transitState,
      logAppStateDetails,
    ],
  )

  const { isIdentityProved, isSenderAddressProved } = useIdentityVerifier(
    config?.[`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`],
  )

  const getIsIdentityProvedMsg = useCallback(
    async (_identityBigIntString?: string) => {
      const currentIdentityBigIntString =
        _identityBigIntString ?? identityBigIntString

      if (!currentIdentityBigIntString || !provider?.address)
        throw new TypeError(`Identity or provider is not defined`)

      const isDIDProved = await isIdentityProved(currentIdentityBigIntString)

      const isAddressProved = await isSenderAddressProved(provider.address)

      let provedMsg = ''

      if (isDIDProved && isAddressProved) {
        provedMsg =
          'Your identity has been verified as human, and the wallet address is already linked to it.'
      } else if (isDIDProved && !isAddressProved) {
        provedMsg = 'Identity verification already completed'
      } else if (!isDIDProved && isAddressProved) {
        provedMsg =
          'The wallet address you entered is associated with another identity. Please use a different wallet address.'
      }

      return provedMsg
    },
    [
      identityBigIntString,
      isIdentityProved,
      isSenderAddressProved,
      provider?.address,
    ],
  )

  return (
    <zkpContext.Provider
      value={{
        identityIdString,
        identityBigIntString,
        verifiableCredentials,
        isZKPRequestPending,
        isProveRequestPending,
        isUserSubmittedZkp,
        zkProof,

        txSubmitExplorerLink,

        isClaimOfferExists,
        getClaimOffer,
        createIdentity,
        getVerifiableCredentials,
        getZkProof,
        submitZkp,
        getIsIdentityProvedMsg,
        parseDIDToIdentityBigIntString,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
