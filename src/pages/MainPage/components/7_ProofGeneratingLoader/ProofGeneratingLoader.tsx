import './styles.scss'

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
    <div className={['proof-generating-loader', className].join(' ')} {...rest}>
      {`proof-generating-loader`}
    </div>
  )
}

export default ProofGeneratingLoader
