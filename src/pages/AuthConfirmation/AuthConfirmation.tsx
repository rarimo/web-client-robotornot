import './styles.scss'

import { config, SUPPORTED_CHAINS, SUPPORTED_CHAINS_DETAILS } from '@config'
import { Chain, errors, PROVIDERS } from '@distributedlab/w3p'
import { getTransitStateTxBody } from '@rarimo/shared-zkp-iden3'
import { utils } from 'ethers'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { querier } from '@/api'
import { AppButton, Dropdown, Icon } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useIdentityVerifier } from '@/hooks/contracts'

type Props = HTMLAttributes<HTMLDivElement>

const AuthConfirmation: FC<Props> = () => {
  const [isStateManuallyTransited, setIsStateManuallyTransited] =
    useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigate = useNavigate()
  const { getProveIdentityTxBody } = useIdentityVerifier()

  const { isNaturalZkp, publishedChains, CHAINS_DETAILS_MAP } = useZkpContext()
  const { provider, init } = useWeb3Context()

  const [selectedChainToPublish, setSelectedChainToPublish] =
    useState<SUPPORTED_CHAINS>(config.DEFAULT_CHAIN)

  const selectedChainToPublishDetails = useMemo(() => {
    return SUPPORTED_CHAINS_DETAILS[selectedChainToPublish]
  }, [selectedChainToPublish])

  const isStatesActual = useMemo(
    () => isNaturalZkp?.isStatesActual(),
    [isNaturalZkp],
  )

  const submitZkp = useCallback(async () => {
    setIsPending(true)

    try {
      if (
        !isNaturalZkp ||
        !isNaturalZkp.coreStateDetails ||
        !isNaturalZkp.merkleProof
      )
        throw new TypeError('ZKP is not defined')

      const txBody = getProveIdentityTxBody(
        {
          issuerId: config.ISSUER_ID,
          // StateInfo.hash
          issuerState: isNaturalZkp.coreStateDetails.hash,
          // StateInfo.createdAtTimestamp
          createdAtTimestamp: isNaturalZkp.coreStateDetails.createdAtTimestamp,
          merkleProof: isNaturalZkp.merkleProof.proof.map(el =>
            utils.arrayify(el),
          ),
        },
        isNaturalZkp?.subjectProof.pub_signals.map(el => BigInt(el)),
        [
          isNaturalZkp?.subjectProof.proof.pi_a[0],
          isNaturalZkp?.subjectProof.proof.pi_a[1],
        ],
        [
          [
            isNaturalZkp?.subjectProof.proof.pi_b[0][1],
            isNaturalZkp?.subjectProof.proof.pi_b[0][0],
          ],
          [
            isNaturalZkp?.subjectProof.proof.pi_b[1][1],
            isNaturalZkp?.subjectProof.proof.pi_b[1][0],
          ],
        ],
        [
          isNaturalZkp?.subjectProof.proof.pi_c[0],
          isNaturalZkp?.subjectProof.proof.pi_c[1],
        ],
      )

      await provider?.signAndSendTx?.({
        to: config?.[
          `IDENTITY_VERIFIER_CONTRACT_ADDRESS_${selectedChainToPublish}`
        ],
        ...txBody,
      })

      publishedChains.set(prev => [...prev, selectedChainToPublish])

      navigate(RoutesPaths.authSuccess)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [
    getProveIdentityTxBody,
    isNaturalZkp,
    navigate,
    provider,
    publishedChains,
    selectedChainToPublish,
  ])

  const transitState = useCallback(async () => {
    setIsPending(true)

    try {
      const transitParams = await isNaturalZkp?.loadParamsForTransitState(
        querier,
      )

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

      setIsStateManuallyTransited(true)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [isNaturalZkp, provider, selectedChainToPublish])

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
    async (el: SUPPORTED_CHAINS) => {
      try {
        setIsDropdownOpen(false)
        await trySwitchChain(SUPPORTED_CHAINS_DETAILS[el])
        setSelectedChainToPublish(el)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
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
          {`Proof is generated using Zero-Knowledge Proof (ZKP) and none of the personal info is shared with any party`}
        </span>
      </div>

      <div className='auth-confirmation__card'>
        <div className='auth-confirmation__chain-preview'>
          <div className='auth-confirmation__chain-preview-icon-wrp'>
            <Icon
              className='auth-confirmation__chain-preview-icon'
              name={CHAINS_DETAILS_MAP[selectedChainToPublish].iconName}
            />
          </div>

          <span className='auth-confirmation__chain-preview-title'>
            {`Your proof will be submitted on ${CHAINS_DETAILS_MAP[selectedChainToPublish].title}`}
          </span>
        </div>

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
            {Object.values(SUPPORTED_CHAINS)?.map?.((el, idx) => (
              <button
                key={idx}
                className='auth-confirmation__chain-item'
                onClick={() => handleSelectChain(el)}
              >
                <Icon
                  className='auth-confirmation__chain-item-icon'
                  name={CHAINS_DETAILS_MAP[el].iconName}
                />
                <span className='auth-confirmation__chain-item-title'>
                  {CHAINS_DETAILS_MAP[el].title}
                </span>
              </button>
            ))}
          </div>
        </Dropdown>

        <div className='auth-confirmation__divider' />

        {provider?.isConnected ? (
          isProviderValidChain ? (
            <>
              {isStatesActual || isStateManuallyTransited ? (
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
                  text={`TRANSIT STATE`}
                  iconRight={ICON_NAMES.arrowRight}
                  size='large'
                  onClick={transitState}
                  isDisabled={isPending}
                />
              )}
            </>
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
    </div>
  )
}

export default AuthConfirmation
