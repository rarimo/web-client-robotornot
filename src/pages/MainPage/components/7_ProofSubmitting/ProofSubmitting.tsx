import './styles.scss'

import { config, SUPPORTED_CHAINS } from '@config'
import { motion } from 'framer-motion'
import { type FC, useCallback, useState } from 'react'

import { AppButton } from '@/common'
import { useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const ProofSubmitting: FC<StepProps> = ({
  nextStepCb,
  onErrorCb,
  className,
  ...rest
}) => {
  const [isPending, setIsPending] = useState(false)
  const [selectedChainToPublish] = useState<SUPPORTED_CHAINS>(
    config.DEFAULT_CHAIN,
  )

  const { submitZkp } = useZkpContext()

  const requestSubmitZkp = useCallback(async () => {
    setIsPending(true)

    nextStepCb()

    try {
      await submitZkp(selectedChainToPublish)
    } catch (error) {
      ErrorHandler.process(error)
      onErrorCb?.(error as Error)
    }

    setIsPending(false)
  }, [nextStepCb, onErrorCb, selectedChainToPublish, submitZkp])

  return (
    <motion.div className={['proof-submitting', className].join(' ')} {...rest}>
      <AppButton
        iconLeft={ICON_NAMES.metamask}
        text={`Submit Proof`}
        modification='border-circle'
        onClick={requestSubmitZkp}
        isDisabled={isPending}
      />
    </motion.div>
  )
}

export default ProofSubmitting
