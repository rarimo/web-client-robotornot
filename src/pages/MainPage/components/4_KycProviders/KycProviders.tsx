import './styles.scss'

import { HTTP_STATUS_CODES } from '@distributedlab/jac'
import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useState } from 'react'

import { AppButton, BasicModal, Icon } from '@/common'
import { useFormStepperContext, useKycContext } from '@/contexts'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { ErrorHandler, GaCategories, gaSendCustomEvent } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

import { KycProvidersItem } from './components'

const KycProviders: FC<StepProps> = ({ nextStepCb, className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)
  const [isErrorMsgModalShown, setIsErrorMsgModalShown] = useState(false)

  const {
    KYC_PROVIDERS_DETAILS_MAP,
    verificationErrorMessages,
    isVCRequestPending,
    isVCRequestFailed,

    login,
    clearKycError,
    setIsVCRequestFailed,
    setIsVCRequestPending,
  } = useKycContext()

  const { selectedKycProvider, kycError } = useKycContext()
  const { nextStep } = useFormStepperContext()

  const handleLogin = useCallback(
    async (kycProvider: SUPPORTED_KYC_PROVIDERS) => {
      setIsPending(true)

      try {
        await login(kycProvider)

        gaSendCustomEvent(GaCategories.ProviderSelection, {
          provider: kycProvider,
        })

        gaSendCustomEvent(kycProvider)
      } catch (error) {
        ErrorHandler.process(error)
      }

      setIsPending(false)
    },
    [login],
  )

  const hideErrorMsgModal = useCallback(() => {
    setIsErrorMsgModalShown(false)
    setIsVCRequestFailed(false)
    setIsVCRequestPending(false)
    clearKycError()
  }, [clearKycError, setIsVCRequestFailed, setIsVCRequestPending])

  useEffect(() => {
    nextStepCb()
    if (!isVCRequestPending || !!verificationErrorMessages) return

    nextStepCb?.()
  }, [
    isVCRequestPending,
    isVCRequestFailed,
    nextStep,
    nextStepCb,
    verificationErrorMessages,
  ])

  useEffect(() => {
    if (!verificationErrorMessages) return

    setIsErrorMsgModalShown(true)
  }, [verificationErrorMessages])

  return (
    <motion.div className={['kyc-providers', className].join(' ')} {...rest}>
      <div className='kyc-providers__content'>
        <h2 className='kyc-providers__title'>
          {`Select the identity provider of your choice`}
        </h2>

        <div className='kyc-providers__list'>
          {Object.values(SUPPORTED_KYC_PROVIDERS).map((provider, idx) => (
            <KycProvidersItem
              key={idx}
              className='kyc-providers__list-item'
              supportedKycProvider={provider}
              name={KYC_PROVIDERS_DETAILS_MAP[provider].name}
              iconName={KYC_PROVIDERS_DETAILS_MAP[provider].iconName}
              handleLogin={handleLogin}
              isDisabled={isPending}
              tooltipMsg={KYC_PROVIDERS_DETAILS_MAP[provider].tooltipElement}
            />
          ))}
        </div>
      </div>

      <BasicModal
        isShown={isErrorMsgModalShown}
        updateIsShown={setIsErrorMsgModalShown}
      >
        <div className='kyc-providers__card'>
          <div className='kyc-providers__card-error'>
            <div className='kyc-providers__card-error-icon-wrp'>
              <Icon
                className='kyc-providers__card-error-icon'
                name={ICON_NAMES.x}
              />
            </div>

            <span className='kyc-providers__card-error-title'>
              {kycError?.httpStatus === HTTP_STATUS_CODES.CONFLICT
                ? `This KYC provider / Address was already claimed by another identity`
                : verificationErrorMessages}
            </span>
            <span className='kyc-providers__card-error-message'>
              {kycError?.httpStatus === HTTP_STATUS_CODES.CONFLICT
                ? 'Seem like you are trying to use a provider that you used already. Please choose another one'
                : `Unable to Generate Proof of Human Identity. Please Complete Your Profile with an Identity Provider.`}
            </span>
          </div>

          <AppButton
            className='kyc-providers__card-button'
            text={
              (selectedKycProvider &&
                KYC_PROVIDERS_DETAILS_MAP?.[selectedKycProvider]
                  ?.completeKycMessage) ||
              `RETURN TO PROVIDER LIST`
            }
            modification='border-circle'
            iconRight={ICON_NAMES.arrowRight}
            size='large'
            onClick={hideErrorMsgModal}
          />
        </div>
      </BasicModal>
    </motion.div>
  )
}

export default KycProviders
