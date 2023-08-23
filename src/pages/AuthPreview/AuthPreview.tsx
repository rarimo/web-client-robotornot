import './styles.scss'

import { config } from '@config'
import { HTTP_STATUS_CODES } from '@distributedlab/fetcher'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loaderJson from '@/assets/animations/loader.json'
import { Animation, AppButton, CautionTip, Icon } from '@/common'
import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
  useZkpContext,
} from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
} from '@/helpers'
import { useIdentityVerifier } from '@/hooks/contracts'

type Props = HTMLAttributes<HTMLDivElement>

const AuthPreview: FC<Props> = () => {
  const [isIdentitySaved, setIsIdentitySaved] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const navigate = useNavigate()

  const { provider } = useWeb3Context()

  const { isSnapConnected } = useMetamaskZkpSnapContext()

  const { isIdentityProved, isSenderAddressProved } = useIdentityVerifier(
    config?.[`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`],
  )

  const {
    selectedKycProvider,

    identity,
    verifiableCredentials,
    getZkProof,
  } = useZkpContext()

  const {
    KYC_PROVIDERS_DETAILS_MAP,

    isLoaded,
    isValidCredentials,
    selectedKycDetails,
    // retryKyc,

    kycError,
    verificationErrorMessages,
  } = useKycContext()

  const exportLink = useMemo(() => {
    if (!identity?.privateKeyHex) return

    const blob = new Blob([identity.privateKeyHex], {
      type: 'application/json',
    })

    return URL.createObjectURL(blob)
  }, [identity?.privateKeyHex])

  const handleGenerateProof = useCallback(async () => {
    setIsPending(true)

    if (!identity?.idBigIntString || !provider?.address)
      throw new TypeError(`Identity or provider is not defined`)

    try {
      const isDIDProved = await isIdentityProved(identity.idBigIntString)

      const isAddressProved = await isSenderAddressProved(provider.address)

      if (isDIDProved || isAddressProved) {
        bus.emit(
          BUS_EVENTS.warning,
          `${isDIDProved ? 'Identity' : ''} has already been proven, ${
            isAddressProved
              ? 'and sender address has already been used to prove the another identity'
              : ''
          }`,
        )

        setIsPending(false)
        return
      }

      await getZkProof()

      navigate(RoutesPaths.authConfirmation)
    } catch (error) {
      ErrorHandler.process(error)
    }

    gaSendCustomEvent(GaCategories.GenerateProof)

    setIsPending(false)
  }, [
    getZkProof,
    identity?.idBigIntString,
    isIdentityProved,
    isSenderAddressProved,
    navigate,
    provider?.address,
  ])

  const completeKyc = useCallback(async () => {
    if (!selectedKycProvider?.get)
      throw new TypeError(`Kyc Provider is not defined`)

    KYC_PROVIDERS_DETAILS_MAP?.[selectedKycProvider?.get]?.completeKycCb?.()

    navigate(RoutesPaths.authProviders)
    // retryKyc()

    gaSendCustomEvent(GaCategories.RetryKyc)
  }, [KYC_PROVIDERS_DETAILS_MAP, navigate, selectedKycProvider?.get])

  const ValidCredentialsPreview = useMemo(
    () => (
      <div className='auth-preview__card'>
        <div className='auth-preview__card-overhead'>
          {`Zero-knowledge proof will be generated. No personal info will be shared with third parties.`}
        </div>
        <CautionTip
          className='auth-preview__card-caution-tip'
          message={
            <div className='auth-preview__card-caution-body'>
              {`Save your profile to continue session anytime, without losing data`}
              <AppButton
                className='auth-preview__card-caution-btn'
                size='small'
                target='_blank'
                download={`pk.json`}
                text={`SAVE`}
                href={exportLink}
                onClick={() => setIsIdentitySaved(true)}
                isDisabled={isIdentitySaved}
              />
            </div>
          }
        />
        <div className='auth-preview__metadata'>
          {selectedKycDetails?.map(([label, value], idx) => (
            <div className='auth-preview__metadata-item' key={idx}>
              <span className='auth-preview__metadata-item-label'>{label}</span>
              <span className='auth-preview__metadata-item-value' title={value}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className='auth-preview__card-divider' />
        <AppButton
          className='auth-preview__card-button'
          text={`GENERATE PROOF`}
          iconRight={ICON_NAMES.arrowRight}
          size='large'
          onClick={handleGenerateProof}
          isDisabled={
            !provider?.address || !isIdentitySaved || !isSnapConnected
          }
        />
      </div>
    ),
    [
      isSnapConnected,
      exportLink,
      handleGenerateProof,
      isIdentitySaved,
      provider?.address,
      selectedKycDetails,
    ],
  )

  const InvalidCredentialsMessage = useMemo(
    () => (
      <div className='auth-preview__card'>
        <div className='auth-preview__card-error'>
          <div className='auth-preview__card-error-icon-wrp'>
            <Icon
              className='auth-preview__card-error-icon'
              name={ICON_NAMES.x}
            />
          </div>
          <span className='auth-preview__card-error-title'>
            {kycError?.httpStatus === HTTP_STATUS_CODES.CONFLICT
              ? `Provider already used`
              : verificationErrorMessages}
          </span>
          <span className='auth-preview__card-error-message'>
            {kycError?.httpStatus === HTTP_STATUS_CODES.CONFLICT
              ? 'Seem like you are trying to use a provider that you used already. Please choose another one'
              : `Unable to Generate Proof of Human Identity. Please Complete Your Profile with an Identity Provider.`}
          </span>
        </div>

        <AppButton
          className='auth-preview__card-button'
          text={
            (selectedKycProvider?.get &&
              KYC_PROVIDERS_DETAILS_MAP?.[selectedKycProvider?.get]
                ?.completeKycMessage) ||
            `RETURN TO PROVIDER LIST`
          }
          iconRight={ICON_NAMES.arrowRight}
          size='large'
          onClick={completeKyc}
        />
      </div>
    ),
    [
      KYC_PROVIDERS_DETAILS_MAP,
      completeKyc,
      kycError?.httpStatus,
      selectedKycProvider?.get,
      verificationErrorMessages,
    ],
  )

  return (
    <div
      className={[
        'auth-preview',
        ...(isValidCredentials ? [] : ['auth-preview--invalid']),
        ...(isPending || !isLoaded ? ['auth-preview--loading'] : []),
      ].join(' ')}
    >
      <div className='auth-preview__header'>
        <h2 className='auth-preview__header-title'>
          {verifiableCredentials && isLoaded
            ? isPending
              ? `Generating Zero-Knowledge Proof`
              : `Proof of Humanity`
            : `Getting a credential `}
        </h2>
        {verificationErrorMessages ? (
          ''
        ) : (
          <span className='auth-preview__header-subtitle'>
            {verifiableCredentials && isLoaded
              ? isPending
                ? `You won't reveal your personal data to any party`
                : `Save your (DiD) Profile to ensure uninterrupted verification across sessions and devices. Next, generate your ZKP proof for credential authentication.`
              : `The Identity Provider creates, signs, and registers your Proof of Humanity credential`}
          </span>
        )}
      </div>

      {isLoaded ? (
        isPending ? (
          <>
            <div className='auth-preview__card'>
              <div className='auth-preview__loader-wrp'>
                <div className='auth-preview__loader-animation'>
                  <Animation source={loaderJson} />
                </div>

                <span className='auth-preview__loader-title'>
                  {`Please wait...`}
                </span>
                <span className='auth-preview__loader-subtitle'>
                  {`Ensuring the privacy`}
                </span>
              </div>
            </div>
          </>
        ) : isValidCredentials ? (
          ValidCredentialsPreview
        ) : (
          InvalidCredentialsMessage
        )
      ) : (
        <div className='auth-preview__card'>
          <div className='auth-preview__loader-wrp'>
            <AnimatePresence>
              <motion.div
                variants={{
                  start: { opacity: 1 },
                  end: { opacity: 0 },
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: '1.5',
                }}
                initial='end'
                animate='start'
                exit='end'
              >
                <Icon name={ICON_NAMES.credentialsLoader} />
              </motion.div>
            </AnimatePresence>

            <span className='auth-preview__loader-title'>
              {`Please wait...`}
            </span>
            <span className='auth-preview__loader-subtitle'>
              {`Identity Provider is creating the credential`}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthPreview
