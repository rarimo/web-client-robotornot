import { HTMLAttributes } from 'react'

export interface StepProps extends HTMLAttributes<HTMLDivElement> {
  nextStepCb: () => void
  onErrorCb?: (error: Error) => void
}
