import './styles.scss'

import { config } from '@config'
import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useState } from 'react'

import { AppButton, ProgressLoader } from '@/common'
import { useFormStepperContext, useKycContext, useZkpContext } from '@/contexts'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
} from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const ProofGenerating: FC<StepProps> = ({
  nextStepCb,
  className,
  onErrorCb,
  ...rest
}) => {
  const [isPending, setIsPending] = useState(false)

  const { prevStep } = useFormStepperContext()
  const { verifiableCredentials, getZkProof, getIsIdentityProvedMsg } =
    useZkpContext()
  const {
    isVCRequestPending,
    isKycFinished,
    selectedKycProvider,
    KYC_PROVIDERS_DETAILS_MAP,
    verificationErrorMessages,
  } = useKycContext()

  const checkIsIdentityProved = useCallback(async () => {
    const provedMsg = await getIsIdentityProvedMsg()

    if (provedMsg) {
      bus.emit(BUS_EVENTS.warning, provedMsg)

      setIsPending(false)
      return true
    }

    return false
  }, [getIsIdentityProvedMsg])

  const handleGenerateProof = useCallback(async () => {
    setIsPending(true)

    try {
      nextStepCb()

      if (config.ENVIRONMENT !== 'dev') {
        if (await checkIsIdentityProved())
          throw new TypeError(`Identity already proved`)
      }

      await getZkProof()
    } catch (error) {
      ErrorHandler.process(error)
      onErrorCb?.(error as Error)
    }

    gaSendCustomEvent(GaCategories.GenerateProof)
    setIsPending(false)
  }, [checkIsIdentityProved, getZkProof, nextStepCb, onErrorCb])

  useEffect(() => {
    if (!verificationErrorMessages) return

    prevStep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationErrorMessages])

  return (
    <motion.div className={['proof-generating', className].join(' ')} {...rest}>
      <div className='proof-generating__content'>
        <ProgressLoader
          className='proof-generating__progress'
          checkpoints={[50, 100]}
          checkpointIndex={
            verifiableCredentials ? 1 : isKycFinished ? 0 : undefined
          }
          delay={500}
          variant='skeleton'
          iconNameOrImgUrl={
            selectedKycProvider &&
            KYC_PROVIDERS_DETAILS_MAP[selectedKycProvider].iconName
          }
        />

        <h2 className='proof-generating__title'>
          {isVCRequestPending ? `Getting a credentials` : `Proof of Human`}
        </h2>

        {isVCRequestPending && (
          <span className='proof-generating__subtitle'>
            {`The identity provider issues a credential, which is then stored in your wallet`}
          </span>
        )}

        <div className='proof-generating__actions'>
          <AppButton
            text={`Generate proof`}
            modification='border-circle'
            onClick={handleGenerateProof}
            isDisabled={
              isPending || isVCRequestPending || !verifiableCredentials
            }
          />
        </div>
      </div>
    </motion.div>
  )
}

export default ProofGenerating
