import './styles.scss'

import { config, SUPPORTED_CHAINS } from '@config'
import { motion } from 'framer-motion'
import { type FC, useCallback, useMemo, useState } from 'react'

import { AppButton, Icon } from '@/common'
import { useKycContext, useZkpContext } from '@/contexts'
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
  const { questPlatformDetails } = useKycContext()

  const selectedChainDetails = useMemo(
    () => config.SUPPORTED_CHAINS_DETAILS[selectedChainToPublish],
    [selectedChainToPublish],
  )

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
      <div className='proof-submitting__flow'>
        <div className='proof-submitting__flow-item'>
          <Icon
            className='proof-submitting__flow-item-icon'
            name={ICON_NAMES.rarimeSnapFilled}
          />
        </div>
        {/*TODO: replace by motion.path*/}
        <div className='proof-submitting__flow-line' />
        <div className='proof-submitting__flow-item'>
          <Icon
            className='proof-submitting__flow-item-icon'
            name={selectedChainDetails.icon as ICON_NAMES}
          />
        </div>
        <div className='proof-submitting__flow-line' />
        <div className='proof-submitting__flow-item'>
          {/*TODO: detect website where user come from*/}
          <img
            className='proof-submitting__flow-item-icon'
            src={questPlatformDetails?.destinationDetails?.iconLink}
            alt={questPlatformDetails?.destinationDetails?.name}
          />
        </div>
      </div>

      <h2 className='proof-submitting__title'>{`Share proof with Galxe`}</h2>

      <span className='proof-submitting__subtitle'>
        {`Submitting a proof via blockchain`}
      </span>

      <AppButton
        text={`Share`}
        modification='border-circle'
        onClick={requestSubmitZkp}
        isDisabled={isPending}
      />
    </motion.div>
  )
}

export default ProofSubmitting
