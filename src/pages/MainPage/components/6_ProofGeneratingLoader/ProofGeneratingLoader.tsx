import './styles.scss'

import { motion } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'
import { type FC, useEffect } from 'react'

import { useZkpContext } from '@/contexts'
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
      {`proof-generating-loader`}
    </motion.div>
  )
}

export default ProofGeneratingLoader
