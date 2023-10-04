import './styles.scss'

import { config } from '@config'
import { type FC, useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useCountdown } from 'usehooks-ts'

import { StepProps } from '@/pages/MainPage/components/types'

const SECOND = 1000

const REDIRECT_TIMEOUT = 30

const ProofSubmitted: FC<StepProps> = ({ nextStepCb, className, ...rest }) => {
  const [isManualRedirected] = useState(false)

  const [count, { startCountdown }] = useCountdown({
    countStart: REDIRECT_TIMEOUT,
    intervalMs: SECOND,
  })

  useEffectOnce(() => {
    startCountdown()
  })

  useEffect(() => {
    if (count > 0) return

    if (!config.EXTERNAL_PLATFORM_REDIRECT_URL || isManualRedirected) return

    nextStepCb()
  }, [count, isManualRedirected, nextStepCb])

  return (
    <div className={['proof-submitted', className].join(' ')} {...rest}>
      {`SUCCESS`}
    </div>
  )
}

export default ProofSubmitted
