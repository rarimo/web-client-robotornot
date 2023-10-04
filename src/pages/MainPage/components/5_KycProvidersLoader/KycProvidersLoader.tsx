import './styles.scss'

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
    <div className={['kyc-providers', className].join(' ')} {...rest}>
      {'Loading...'}
    </div>
  )
}

export default KycProvidersLoader
