import './styles.scss'

import { type FC, useEffect } from 'react'

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
    <div className={['proof-submitting-loader', className].join(' ')} {...rest}>
      {`ProofSubmittingLoader`}
    </div>
  )
}

export default ProofSubmittingLoader
