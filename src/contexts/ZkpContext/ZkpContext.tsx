import { config, SUPPORTED_CHAINS } from '@config'
import { type EthTransactionResponse } from '@distributedlab/w3p'
import { type TransactionRequest } from '@ethersproject/providers'
import type {
  SaveCredentialsRequestParams,
  StateInfo,
  UpdateStateDetails,
  W3CCredential,
  ZKPProofResponse,
  ZKProof,
} from '@rarimo/rarime-connector'
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

import { issuerApi } from '@/api'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import { GaCategories, gaSendCustomEvent, increaseGasLimit } from '@/helpers'
import { useSbtIdentityVerifier } from '@/hooks/contracts'

export type QueryVariableName = { isNatural: number }

export type StatesMerkleProof = {
  issuerId: string
  state: StateInfo
  merkleProof: string[]
}

interface ZkpContextValue {
  identityIdString: string
  identityIdBigIntString: string
  isZKPRequestPending: boolean
  isProveRequestPending: boolean

  isEthAddressProved: boolean
  isDidProved: boolean

  verifiableCredentials?: W3CCredential
  isUserSubmittedZkp: boolean
  zkProof?: ZKProof

  txSubmitExplorerLink: string

  getClaimOffer: (
    _identityIdString?: string,
  ) => Promise<SaveCredentialsRequestParams | undefined>
  createIdentity: () => Promise<
    | {
        identityIdString: string
        identityIdBigIntString: string
      }
    | undefined
  >
  getVerifiableCredentials: (
    _identityIdString?: string,
    claimOffer?: SaveCredentialsRequestParams,
  ) => Promise<W3CCredential | undefined>
  getZkProof: () => Promise<ZKPProofResponse | undefined>
  submitZkp: (selectedChain: SUPPORTED_CHAINS) => Promise<void>
  getIsIdentityProvedMsg: (_identityBigIntString?: string) => Promise<string>
}

export const zkpContext = createContext<ZkpContextValue>({
  identityIdString: '',
  identityIdBigIntString: '',

  txSubmitExplorerLink: '',

  verifiableCredentials: undefined,

  isZKPRequestPending: false,
  isProveRequestPending: false,
  isUserSubmittedZkp: false,

  isEthAddressProved: false,
  isDidProved: false,

  getClaimOffer: async () => {
    throw new TypeError(`getClaimOffer() not implemented`)
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
  const [, setTransitStateTx] = useState<TransactionRequest>()
  const [updateStateDetails, setUpdateStateDetails] = useState<UpdateStateDetails>()
  const [verifiableCredentials, setVerifiableCredentials] = useLocalStorage<W3CCredential>('vc', undefined)
  const [identityIdString, setIdentityIdString] = useState('')
  const [identityIdBigIntString, setIdentityIdBigIntString] = useState('')
  const [txSubmitHash, setTxSubmitHash] = useState('')
  /* eslint-enable */
  /* prettier-ignore-end */

  const { provider } = useWeb3Context()
  const zkpSnap = useMetamaskZkpSnapContext()

  const [isEthAddressProved, setIsEthAddressProved] = useState(false)
  const [isDidProved, setIsDidProved] = useState(false)

  const { isIdentityProved, isSenderAddressProved, getProveIdentityTxBody } =
    useSbtIdentityVerifier()

  const txSubmitExplorerLink = useMemo(() => {
    if (!txSubmitHash || !provider?.getTxUrl) return ''

    const explorerTxUrl = provider.getTxUrl(
      config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
      txSubmitHash,
    )

    return explorerTxUrl || ''
  }, [provider, txSubmitHash])

  const createIdentity = useCallback(async () => {
    if (identityIdString && identityIdBigIntString)
      return { identityIdString, identityIdBigIntString }

    const _identityId = await zkpSnap.createIdentity()

    if (!_identityId) throw new Error('Identity has not created')

    const { identityIdString: did, identityIdBigIntString: didBigInt } =
      _identityId

    setIdentityIdString(did)
    setIdentityIdBigIntString(didBigInt)

    return {
      identityIdString: did,
      identityIdBigIntString: didBigInt,
    }
  }, [identityIdBigIntString, identityIdString, zkpSnap])

  /**
   * GETTING VERIFIABLE CREDENTIALS
   */

  const getClaimOffer = useCallback(
    async (_identityIdString?: string) => {
      const currIdentityIdString = _identityIdString ?? identityIdString

      // FIXME: remove
      const { data } = await issuerApi.get<SaveCredentialsRequestParams>(
        `/v1/credentials/${currIdentityIdString}/${config.CLAIM_TYPE}`,
      )

      return data
    },
    [identityIdString],
  )

  const getVerifiableCredentials = useCallback(
    async (
      _identityIdString?: string,
      _claimOffer?: SaveCredentialsRequestParams,
    ): Promise<W3CCredential | undefined> => {
      const currentIdentityIdString = _identityIdString ?? identityIdString
      const claimOffer =
        _claimOffer ?? (await getClaimOffer(currentIdentityIdString))

      let vc: W3CCredential | undefined = verifiableCredentials

      if (
        claimOffer &&
        !(
          currentIdentityIdString &&
          vc?.credentialSubject?.id &&
          typeof vc?.credentialSubject?.id === 'string' &&
          vc?.credentialSubject?.id?.includes?.(currentIdentityIdString)
        )
      ) {
        vc = (await zkpSnap.getVerifiableCredentials(claimOffer))?.[0]
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
    if (!verifiableCredentials?.issuer) throw new TypeError('Issuer is not set')

    setIsZKPRequestPending(true)

    const zkProofResponse = await zkpSnap.createProof({
      circuitId: 'credentialAtomicQueryMTPV2OnChain',
      accountAddress: provider?.address,
      issuerDid: verifiableCredentials?.issuer,

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

    setUpdateStateDetails(zkProofResponse?.updateStateDetails)

    setIsZKPRequestPending(false)

    return zkProofResponse
  }, [verifiableCredentials?.issuer, zkpSnap, provider?.address])

  /**
   * SUBMITTING PROOF
   */

  const logAppStateDetails = useCallback(() => {
    log.error({
      did: identityIdString,
    })
  }, [identityIdString])

  const submitZkp = useCallback(
    async (selectedChain: SUPPORTED_CHAINS) => {
      setIsProveRequestPending(true)

      try {
        if (!provider?.address || !provider?.rawProvider)
          throw new TypeError('Provider is not defined')

        if (!zkProof?.pub_signals)
          throw new TypeError(`Pub signals is not defined`)

        if (!statesMerkleProof)
          throw new TypeError(`States merkle proof is not defined`)

        if (!updateStateDetails)
          throw new TypeError(`Update state details is not defined`)

        const txBody = {
          to: config?.[
            `IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_${selectedChain}`
          ],
          ...getProveIdentityTxBody(
            {
              statesMerkleData: {
                issuerId: statesMerkleProof.issuerId,
                issuerState: statesMerkleProof.state.hash,
                createdAtTimestamp: statesMerkleProof.state.createdAtTimestamp,
                merkleProof: statesMerkleProof.merkleProof.map(el =>
                  utils.arrayify(el),
                ),
              },
              inputs: zkProof.pub_signals.map?.(el => BigInt(el)),
              a: [zkProof?.proof.pi_a[0], zkProof?.proof.pi_a[1]],
              b: [
                [zkProof?.proof.pi_b[0][1], zkProof?.proof.pi_b[0][0]],
                [zkProof?.proof.pi_b[1][1], zkProof?.proof.pi_b[1][0]],
              ],
              c: [zkProof?.proof.pi_c[0], zkProof?.proof.pi_c[1]],
            },
            {
              newIdentitiesStatesRoot: updateStateDetails.stateRootHash,
              gistData: updateStateDetails.gistRootDataStruct,
              proof: updateStateDetails.proof,
            },
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
      provider,
      zkProof?.pub_signals,
      zkProof?.proof.pi_a,
      zkProof?.proof.pi_b,
      zkProof?.proof.pi_c,
      statesMerkleProof,
      getProveIdentityTxBody,
      updateStateDetails,
      logAppStateDetails,
    ],
  )

  const getIsIdentityProvedMsg = useCallback(
    async (_identityBigIntString?: string) => {
      const currentIdentityBigIntString =
        _identityBigIntString ?? identityIdBigIntString

      if (!currentIdentityBigIntString || !provider?.address)
        throw new TypeError(`Identity or provider is not defined`)

      const isDIDProved = await isIdentityProved(currentIdentityBigIntString)

      const isAddressProved = await isSenderAddressProved(provider.address)

      let provedMsg = ''

      if (!isDIDProved && !isAddressProved) return ''

      setIsEthAddressProved(!!isAddressProved)
      setIsDidProved(!!isDIDProved)

      if (isDIDProved && isAddressProved) {
        provedMsg = `Your identity ${currentIdentityBigIntString} has been verified as human, and the wallet address ${provider?.address} is already linked to it.`
      } else if (isDIDProved && !isAddressProved) {
        provedMsg = `Identity verification already completed for ${currentIdentityBigIntString}`
      } else if (!isDIDProved && isAddressProved) {
        provedMsg = `The wallet address ${provider?.address} you entered is associated with another identity. Please use a different wallet address.`
      }

      return provedMsg
    },
    [
      identityIdBigIntString,
      isIdentityProved,
      isSenderAddressProved,
      provider?.address,
    ],
  )

  return (
    <zkpContext.Provider
      value={{
        identityIdString,
        identityIdBigIntString,
        verifiableCredentials,
        isZKPRequestPending,
        isProveRequestPending,
        isUserSubmittedZkp,

        isEthAddressProved,
        isDidProved,

        zkProof,

        txSubmitExplorerLink,

        getClaimOffer,
        createIdentity,
        getVerifiableCredentials,
        getZkProof,
        submitZkp,
        getIsIdentityProvedMsg,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
