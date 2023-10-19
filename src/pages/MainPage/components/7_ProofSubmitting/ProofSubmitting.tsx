import './styles.scss'

import { config, SUPPORTED_CHAINS } from '@config'
import { animate, motion, stagger } from 'framer-motion'
import { type FC, useCallback, useMemo, useState } from 'react'

import { Icon, LoadingButton } from '@/common'
import { useKycContext, useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

// FIXME
const FAKE_ARRAY = ['', '', '', '', '', '']

const LineContainerVariants = {
  initial: {
    transition: {
      staggerChildren: FAKE_ARRAY.length / 75,
    },
  },
  animate: {
    transition: {
      staggerChildren: FAKE_ARRAY.length / 75,
    },
  },
}

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

  const isQuestPlatformDetailsShown = useMemo(
    () =>
      questPlatformDetails?.destinationDetails?.iconLink &&
      questPlatformDetails?.destinationDetails?.name,
    [questPlatformDetails],
  )

  const requestSubmitZkp = useCallback(async () => {
    setIsPending(true)

    animate(
      '.proof-submitting__flow-dot',
      {
        y: ['0%', '25%', '-25%'],
      },
      {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 1,
        ease: 'easeInOut',
        delay: stagger(FAKE_ARRAY.length / 55),
      },
    )

    try {
      await submitZkp(selectedChainToPublish)

      nextStepCb()
    } catch (error) {
      ErrorHandler.process(error)
      onErrorCb?.(error as Error)
    }

    setIsPending(false)
  }, [nextStepCb, onErrorCb, selectedChainToPublish, submitZkp])

  const PendingAnimationLoader = useMemo(() => {
    return (
      <motion.div
        className='proof-submitting__flow-line'
        variants={LineContainerVariants}
        initial='initial'
        animate='animate'
        transition={{
          delay: 1.5,
        }}
      >
        {FAKE_ARRAY.map((_, idx) => (
          <motion.div className='proof-submitting__flow-dot' key={idx} />
        ))}
      </motion.div>
    )
  }, [])

  return (
    <motion.div className={['proof-submitting', className].join(' ')} {...rest}>
      <div
        className={[
          'proof-submitting__flow',
          ...(isQuestPlatformDetailsShown
            ? []
            : ['proof-submitting__flow--thin']),
        ].join(' ')}
      >
        <div className='proof-submitting__flow-item'>
          <Icon
            className='proof-submitting__flow-item-icon'
            name={ICON_NAMES.rarimeSnapFilled}
          />
        </div>
        {PendingAnimationLoader}
        <div className='proof-submitting__flow-item'>
          <Icon
            className='proof-submitting__flow-item-icon'
            name={selectedChainDetails.icon as ICON_NAMES}
          />
        </div>
        {isQuestPlatformDetailsShown && (
          <>
            {PendingAnimationLoader}
            <div className='proof-submitting__flow-item'>
              <img
                className='proof-submitting__flow-item-icon'
                src={questPlatformDetails?.destinationDetails?.iconLink}
                alt={questPlatformDetails?.destinationDetails?.name}
              />
            </div>
          </>
        )}
      </div>

      <h2 className='proof-submitting__title'>{`Share proof ${
        isQuestPlatformDetailsShown
          ? `with ${questPlatformDetails?.destinationDetails?.name}`
          : 'to Ethereum'
      }`}</h2>

      <span className='proof-submitting__subtitle'>
        {`Submitting a proof via blockchain`}
      </span>

      <LoadingButton
        modification='border-circle'
        onClick={requestSubmitZkp}
        isPending={isPending}
        isDisabled={isPending}
      >
        {`Share`}
      </LoadingButton>
    </motion.div>
  )
}

export default ProofSubmitting
