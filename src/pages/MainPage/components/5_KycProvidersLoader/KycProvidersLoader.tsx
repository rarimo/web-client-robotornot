import './styles.scss'

import { motion } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'
import { type FC, useEffect } from 'react'

import { useZkpContext } from '@/contexts'
import { StepProps } from '@/pages/MainPage/components/types'

const KycProvidersLoader: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const { verifiableCredentials } = useZkpContext()

  useEffect(() => {
    if (!verifiableCredentials || isEmpty(verifiableCredentials)) return

    nextStepCb()
  }, [nextStepCb, verifiableCredentials])

  return (
    <motion.div className={['kyc-providers', className].join(' ')} {...rest}>
      {'Loading...'}
    </motion.div>
  )
}

export default KycProvidersLoader
