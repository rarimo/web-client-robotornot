import './styles.scss'

import { motion } from 'framer-motion'
import { type FC, useEffect } from 'react'

import ZKPLoading from '@/assets/animations/loader.json'
import { Animation } from '@/common'
import { useZkpContext } from '@/contexts'
import { StepProps } from '@/pages/MainPage/components/types'

const ProofSubmittingLoader: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const { isUserSubmittedZkp } = useZkpContext()

  useEffect(() => {
    if (!isUserSubmittedZkp) return

    nextStepCb()
  }, [isUserSubmittedZkp, nextStepCb])

  return (
    <motion.div
      className={['proof-submitting-loader', className].join(' ')}
      {...rest}
    >
      <div className='proof-submitting-loader__animation'>
        <Animation source={ZKPLoading} />
      </div>
      <h2 className='proof-submitting-loader__title'>
        {`Proving your humanity`}
      </h2>
      <span className='proof-submitting-loader__subtitle'>
        {`Submitting transaction`}
      </span>
    </motion.div>
  )
}

export default ProofSubmittingLoader
