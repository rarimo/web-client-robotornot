import './styles.scss'

import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'

import { BasicModal } from '@/common'
import { useFormStepperContext, useKycContext } from '@/contexts'
import { SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { ErrorHandler, GaCategories, gaSendCustomEvent } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

import { KycProvidersItem } from './components'

const KycProviders: FC<StepProps> = ({ nextStepCb, className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)
  const [isErrorMsgModalShown, setIsErrorMsgModalShown] = useState(false)

  const {
    KYC_PROVIDERS_DETAILS_MAP,
    verificationErrorMessages,

    login,
    clearKycError,
    setIsVCRequestFailed,
    setIsVCRequestPending,
  } = useKycContext()

  const { getVerificationErrorComponent } = useKycContext()
  const { nextStep } = useFormStepperContext()

  const handleLogin = useCallback(
    async (kycProvider: SUPPORTED_KYC_PROVIDERS) => {
      setIsPending(true)

      try {
        await login(kycProvider, () => {
          if (nextStepCb) {
            nextStepCb()

            return
          }

          nextStep()
        })

        gaSendCustomEvent(GaCategories.ProviderSelection, {
          provider: kycProvider,
        })

        gaSendCustomEvent(kycProvider)
      } catch (error) {
        ErrorHandler.process(error)
      }

      setIsPending(false)
    },
    [login, nextStep, nextStepCb],
  )

  const hideErrorMsgModal = useCallback(() => {
    setIsErrorMsgModalShown(false)
    setIsVCRequestFailed(false)
    setIsVCRequestPending(false)
    clearKycError()
  }, [clearKycError, setIsVCRequestFailed, setIsVCRequestPending])

  useEffect(() => {
    if (!verificationErrorMessages) return

    setIsErrorMsgModalShown(true)
  }, [verificationErrorMessages])

  const verificationErrorComponent = useMemo(
    () => getVerificationErrorComponent?.(hideErrorMsgModal),
    [getVerificationErrorComponent, hideErrorMsgModal],
  )

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
              isAvailable={KYC_PROVIDERS_DETAILS_MAP[provider].isAvailable}
              tooltipMsg={KYC_PROVIDERS_DETAILS_MAP[provider].tooltipElement}
            />
          ))}
        </div>
      </div>

      {verificationErrorComponent && (
        <BasicModal
          isShown={isErrorMsgModalShown}
          updateIsShown={setIsErrorMsgModalShown}
        >
          {verificationErrorComponent}
        </BasicModal>
      )}
    </motion.div>
  )
}

export default KycProviders
