import { config, SUPPORTED_CHAINS } from '@config'
import { type EthTransactionResponse } from '@distributedlab/w3p'
import { type TransactionRequest } from '@ethersproject/providers'
import {
  CreateProofRequestParams,
  SaveCredentialsRequestParams,
  StateInfo,
  UpdateStateDetails,
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

export type saveVCResponse = { type: string[]; issuer: string }

interface ZkpContextValue {
  identityIdString: string
  identityIdBigIntString: string
  isZKPRequestPending: boolean
  isProveRequestPending: boolean

  isEthAddressProved: boolean
  isDidProved: boolean

  savedVC?: saveVCResponse
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
  saveVC: (
    _identityIdString?: string,
    claimOffer?: SaveCredentialsRequestParams,
  ) => Promise<saveVCResponse | undefined>
  getZkProof: () => Promise<ZKPProofResponse | undefined>
  submitZkp: (selectedChain: SUPPORTED_CHAINS) => Promise<void>
  getIsIdentityProvedMsg: (_identityBigIntString?: string) => Promise<string>
  buildProofRequest: (
    issuerDid: string,
    vcType: string[],
  ) => CreateProofRequestParams
}

export const zkpContext = createContext<ZkpContextValue>({
  identityIdString: '',
  identityIdBigIntString: '',

  txSubmitExplorerLink: '',

  savedVC: undefined,

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
  saveVC: async () => {
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
  buildProofRequest: () => {
    throw new TypeError(`buildProofRequest() not implemented`)
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
  const [savedVC, setSavedVC] = useState<saveVCResponse>()
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

    const { identityIdString: _did, identityIdBigIntString: didBigInt } =
      _identityId

    // FIXME: fix parsing DID in snap and remove this
    const did = _did.startsWith('did:iden3:readonly:')
      ? _did
      : _did.replace('did:iden3:', 'did:iden3:readonly:')

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

      const { data } = await issuerApi.get<SaveCredentialsRequestParams>(
        `/v1/credentials/${currIdentityIdString}/${config.CLAIM_TYPE}`,
      )

      return data
    },
    [identityIdString],
  )

  const buildProofRequest = useCallback(
    (issuerDid: string, vcType: string[]): CreateProofRequestParams => ({
      circuitId: 'credentialAtomicQueryMTPV2OnChain',
      accountAddress: provider?.address,
      issuerDid: issuerDid,

      query: {
        allowedIssuers: ['*'],
        credentialSubject: {
          isNatural: {
            $eq: 1,
          },
        },
        type: vcType,
      },
    }),
    [provider?.address],
  )

  const saveVC = useCallback(
    async (
      _identityIdString?: string,
      _claimOffer?: SaveCredentialsRequestParams,
    ): Promise<saveVCResponse | undefined> => {
      const currentIdentityIdString = _identityIdString ?? identityIdString
      const claimOffer =
        _claimOffer ?? (await getClaimOffer(currentIdentityIdString))

      if (!claimOffer) throw new TypeError('Claim offer is not defined')

      const savedVCsByOffer = await zkpSnap.checkCredentialExistence({
        claimOffer: claimOffer,
      })

      // double check if there any migrations had been implemented
      if (savedVCsByOffer?.length) {
        const savedVCsByOfferAndQuery = await zkpSnap.checkCredentialExistence({
          claimOffer: claimOffer,
          proofRequest: buildProofRequest(savedVCsByOffer[0].issuer, [
            ...savedVCsByOffer[0].type,
          ]),
        })

        if (savedVCsByOfferAndQuery?.length) {
          setSavedVC(savedVCsByOfferAndQuery[0])

          return savedVCsByOfferAndQuery[0]
        }
      }

      const vcResponse = (
        await zkpSnap.saveVerifiableCredentials(claimOffer)
      )?.[0]

      setSavedVC(vcResponse)

      gaSendCustomEvent(GaCategories.GettingVerifiableCredentials)

      return vcResponse
    },
    [identityIdString, getClaimOffer, zkpSnap, setSavedVC, buildProofRequest],
  )

  /**
   * GENERATING PROOF
   */

  const getZkProof = useCallback(async (): Promise<
    ZKPProofResponse | undefined
  > => {
    if (!savedVC?.issuer) throw new TypeError('Issuer is not set')

    setIsZKPRequestPending(true)

    const zkProofResponse = await zkpSnap.createProof(
      buildProofRequest(savedVC.issuer, savedVC.type),
    )

    setZkProof(zkProofResponse?.zkpProof)

    setStatesMerkleProof(zkProofResponse?.statesMerkleData)

    setTransitStateTx(zkProofResponse?.updateStateTx)

    setUpdateStateDetails(zkProofResponse?.updateStateDetails)

    setIsZKPRequestPending(false)

    return zkProofResponse
  }, [savedVC?.issuer, savedVC?.type, zkpSnap, buildProofRequest])

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
        savedVC,
        isZKPRequestPending,
        isProveRequestPending,
        isUserSubmittedZkp,

        isEthAddressProved,
        isDidProved,

        zkProof,

        txSubmitExplorerLink,

        getClaimOffer,
        createIdentity,
        saveVC,
        getZkProof,
        submitZkp,
        getIsIdentityProvedMsg,
        buildProofRequest,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
