import './styles.scss'

import { config, SUPPORTED_CHAINS } from '@config'
import { RuntimeError } from '@distributedlab/tools'
import { Chain, errors, PROVIDERS } from '@distributedlab/w3p'
import { getTransitStateTxBody } from '@rarimo/shared-zkp-iden3'
import { ZkpGen } from '@rarimo/zkp-gen-iden3'
import { utils } from 'ethers'
import isEmpty from 'lodash/isEmpty'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loaderJson from '@/assets/animations/loader.json'
import { Animation, AppButton, ChainIcon, Dropdown, Icon } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import { QueryVariableName } from '@/contexts/ZkpContext/ZkpContext'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import {
  awaitFinalityBlock,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
  sleep,
} from '@/helpers'
import { useIdentityVerifier, useLightweightStateV2 } from '@/hooks/contracts'

type Props = HTMLAttributes<HTMLDivElement>

const AuthConfirmation: FC<Props> = () => {
  const [isPending, setIsPending] = useState(false)
  const [isStateTransiting, setIsStateTransiting] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigate = useNavigate()
  const { getProveIdentityTxBody } = useIdentityVerifier()

  const { zkpGen, zkProof, publishedChains, isUserSubmittedZkp } =
    useZkpContext()
  const { provider, init } = useWeb3Context()

  const [selectedChainToPublish, setSelectedChainToPublish] =
    useState<SUPPORTED_CHAINS>(config.DEFAULT_CHAIN)

  const { isIdentitiesStatesRootExists } = useLightweightStateV2(
    config?.[`LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${selectedChainToPublish}`],
  )

  const selectedChainToPublishDetails = useMemo(() => {
    return config.SUPPORTED_CHAINS_DETAILS[selectedChainToPublish]
  }, [selectedChainToPublish])

  const chainsToSwitch = useMemo(
    () =>
      (
        Object.keys(
          config.SUPPORTED_CHAINS_DETAILS,
        ) as (keyof typeof config.SUPPORTED_CHAINS_DETAILS)[]
      )?.filter(el =>
        Boolean(config?.[`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${el}`]),
      ),
    [],
  )

  const handleTransitStateError = useCallback(
    async (error: unknown) => {
      try {
        if (error instanceof Error && 'error' in error) {
          const str = 'Identities states root already exists'
          const currentError = error.error as RuntimeError
          const errorString = currentError?.message

          if (errorString?.includes(str)) return
        }

        await sleep(1000)

        if (!zkpGen?.operation?.details?.stateRootHash)
          throw new TypeError('State root hash is not defined')

        if (
          await isIdentitiesStatesRootExists(
            zkpGen?.operation?.details?.stateRootHash,
          )
        )
          return

        throw error
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    [isIdentitiesStatesRootExists, zkpGen?.operation?.details?.stateRootHash],
  )

  const transitState = useCallback(
    async (_zkpGen?: ZkpGen<QueryVariableName>) => {
      if (!provider?.rawProvider) throw new TypeError('Provider is not defined')

      setIsStateTransiting(true)

      try {
        const currZkpGen = _zkpGen || zkpGen

        const transitParams = await currZkpGen?.loadParamsForTransitState()

        if (!transitParams) throw new TypeError('Transit params is not defined')

        await provider?.signAndSendTx?.(
          getTransitStateTxBody(
            config?.[
              `LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${selectedChainToPublish}`
            ],
            transitParams.newIdentitiesStatesRoot,
            transitParams.gistData,
            transitParams.proof,
          ),
        )

        gaSendCustomEvent(GaCategories.TransitState)

        await awaitFinalityBlock(
          config.FINALITY_BLOCK_AMOUNT,
          provider?.rawProvider,
        )
      } catch (error) {
        await handleTransitStateError(error)
      }

      setIsStateTransiting(false)
    },
    [provider, zkpGen, selectedChainToPublish, handleTransitStateError],
  )

  const submitZkp = useCallback(async () => {
    setIsPending(true)

    try {
      if (!zkpGen?.isStatesActual) {
        await transitState(zkpGen)
      }

      if (!zkpGen || !zkpGen.coreStateDetails || !zkpGen.merkleProof)
        throw new TypeError('ZKP is not defined')

      const zkpParams = isEmpty(zkpGen?.subjectProof)
        ? zkProof.get
        : zkpGen?.subjectProof

      if (!zkpParams) throw new TypeError('ZKP params is not defined')

      const txBody = getProveIdentityTxBody(
        {
          issuerId: config.ISSUER_ID,
          // StateInfo.hash
          issuerState: zkpGen.coreStateDetails.hash,
          // StateInfo.createdAtTimestamp
          createdAtTimestamp: zkpGen.coreStateDetails.createdAtTimestamp,
          merkleProof: zkpGen.merkleProof.proof.map(el => utils.arrayify(el)),
        },
        zkpParams?.pub_signals?.map?.(el => BigInt(el)),
        [zkpParams?.proof.pi_a[0], zkpParams?.proof.pi_a[1]],
        [
          [zkpParams?.proof.pi_b[0][1], zkpParams?.proof.pi_b[0][0]],
          [zkpParams?.proof.pi_b[1][1], zkpParams?.proof.pi_b[1][0]],
        ],
        [zkpParams?.proof.pi_c[0], zkpParams?.proof.pi_c[1]],
      )

      await provider?.signAndSendTx?.({
        to: config?.[
          `IDENTITY_VERIFIER_CONTRACT_ADDRESS_${selectedChainToPublish}`
        ],
        ...txBody,
      })

      publishedChains.set([
        ...(publishedChains?.get ? publishedChains.get : []),
        selectedChainToPublish,
      ])

      isUserSubmittedZkp.set(true)

      navigate(RoutesPaths.authSuccess)

      gaSendCustomEvent(GaCategories.SubmitZkp)
    } catch (error) {
      navigate(RoutesPaths.authPreview)

      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [
    zkpGen,
    zkProof.get,
    getProveIdentityTxBody,
    provider,
    selectedChainToPublish,
    publishedChains,
    isUserSubmittedZkp,
    navigate,
    transitState,
  ])

  const providerChainId = useMemo(() => provider?.chainId, [provider?.chainId])

  const isProviderValidChain = useMemo(() => {
    if (!providerChainId) return false

    return +providerChainId === +selectedChainToPublishDetails.id
  }, [providerChainId, selectedChainToPublishDetails?.id])

  const connectWallet = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.process(error)
    }

    gaSendCustomEvent(GaCategories.WalletConnection, {
      location: `Submit zkp page`,
    })
  }, [init])

  const tryAddChain = useCallback(async () => {
    try {
      await provider?.addChain?.(selectedChainToPublishDetails)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [provider, selectedChainToPublishDetails])

  const trySwitchChain = useCallback(
    async (chain?: Chain) => {
      try {
        const chainToSwitch = chain || selectedChainToPublishDetails
        await provider?.switchChain?.(Number(chainToSwitch.id))
      } catch (error) {
        if (error instanceof errors.ProviderChainNotFoundError) {
          await tryAddChain()
        } else {
          throw error
        }
      }
    },
    [provider, selectedChainToPublishDetails, tryAddChain],
  )

  const handleSelectChain = useCallback(
    async (chain: SUPPORTED_CHAINS) => {
      try {
        setIsDropdownOpen(false)
        await trySwitchChain(config.SUPPORTED_CHAINS_DETAILS[chain])
        setSelectedChainToPublish(chain)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      gaSendCustomEvent(GaCategories.ChainSelection, {
        name: chain,
        chainId: config.SUPPORTED_CHAINS_DETAILS[chain].id,
      })

      gaSendCustomEvent(
        `[${config.SUPPORTED_CHAINS_DETAILS[chain].id}] ${chain}`,
      )
    },
    [trySwitchChain],
  )

  return (
    <div className='auth-confirmation'>
      <div className='auth-confirmation__header'>
        <div className='auth-confirmation__header-icon-wrp'>
          <Icon
            className='auth-confirmation__header-icon'
            name={ICON_NAMES.check}
          />
        </div>
        <h2 className='auth-confirmation__header-title'>{`Proof Generated`}</h2>
        <span className='auth-confirmation__header-subtitle'>
          {`Now you will submit your Proof of Humanity to a smart contract for verification.`}
        </span>
      </div>

      {isPending ? (
        <div className='auth-confirmation__card'>
          <div className='auth-confirmation__loader-wrp'>
            <div className='auth-confirmation__loader-animation'>
              <Animation source={loaderJson} />
            </div>
            <span className='auth-confirmation__loader-title'>
              {isStateTransiting
                ? `Ensuring all the necessary data is in place before submitting the proof...`
                : `Proving your humanity`}
            </span>
            <span className='auth-confirmation__loader-subtitle'>
              {`Submitting transaction`}
            </span>
          </div>
        </div>
      ) : (
        <div className='auth-confirmation__card'>
          <div className='auth-confirmation__chain-preview'>
            <div className='auth-confirmation__chain-preview-icon-wrp'>
              <ChainIcon
                className='auth-confirmation__chain-preview-icon'
                chain={selectedChainToPublish}
              />
            </div>

            <span className='auth-confirmation__chain-preview-title'>
              {`Your proof will be submitted on ${config.SUPPORTED_CHAINS_DETAILS[selectedChainToPublish].name} chain`}
            </span>
          </div>

          {chainsToSwitch?.length > 1 ? (
            <Dropdown
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
              head={
                <AppButton
                  className='auth-confirmation__chains-switch-btn'
                  scheme='none'
                  modification='none'
                  iconLeft={ICON_NAMES.plus}
                  text={`Switch chain`}
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                />
              }
            >
              <div className='auth-confirmation__chains'>
                {chainsToSwitch?.map?.((el, idx) => (
                  <button
                    key={idx}
                    className='auth-confirmation__chain-item'
                    onClick={() => handleSelectChain(el)}
                  >
                    <ChainIcon
                      className='auth-confirmation__chain-preview-icon'
                      chain={el}
                    />
                    <span className='auth-confirmation__chain-item-title'>
                      {config.SUPPORTED_CHAINS_DETAILS[el].name}
                    </span>
                  </button>
                ))}
              </div>
            </Dropdown>
          ) : (
            <></>
          )}

          <div className='auth-confirmation__divider' />

          {provider?.isConnected ? (
            isProviderValidChain ? (
              <AppButton
                className='auth-confirmation__submit-btn'
                text={`SUBMIT PROOF`}
                iconRight={ICON_NAMES.arrowRight}
                size='large'
                onClick={submitZkp}
                isDisabled={isPending}
              />
            ) : (
              <AppButton
                className='auth-confirmation__submit-btn'
                text={`SWITCH NETWORK`}
                iconRight={ICON_NAMES.switchHorizontal}
                size='large'
                onClick={() => trySwitchChain()}
              />
            )
          ) : (
            <AppButton
              className='auth-confirmation__submit-btn'
              text={`CONNECT WALLET`}
              iconRight={ICON_NAMES.metamask}
              size='large'
              onClick={connectWallet}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default AuthConfirmation
