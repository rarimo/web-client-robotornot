import './styles.scss'

import { motion } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'
import { type FC, useEffect } from 'react'

import { ProgressLoader } from '@/common'
import { useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { StepProps } from '@/pages/MainPage/components/types'

const ProofGeneratingLoader: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const { zkProof } = useZkpContext()

  useEffect(() => {
    if (!zkProof || isEmpty(zkProof)) return

    nextStepCb()
  }, [nextStepCb, zkProof])

  return (
    <motion.div
      className={['proof-generating-loader', className].join(' ')}
      {...rest}
    >
      <ProgressLoader
        className='proof-generating-loader__progress-loader'
        delay={2_000}
        checkpoints={[100]}
        checkpointIndex={zkProof?.pub_signals ? 0 : undefined}
        iconNameOrImgUrl={ICON_NAMES.shieldExclamation}
      />

      <h2 className='proof-generating-loader__title'>
        {`Generating ZK-Proof`}
      </h2>
      <span className='proof-generating-loader__subtitle'>
        {`Please wait. Ensuring the privacy`}
      </span>
    </motion.div>
  )
}

export default ProofGeneratingLoader
