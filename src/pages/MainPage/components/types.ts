import { MotionProps } from 'framer-motion'
import { HTMLAttributes } from 'react'

export type StepProps = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    nextStepCb: () => void
    onErrorCb?: (error: Error) => void
  }

export type SidebarProps = HTMLAttributes<HTMLDivElement> & MotionProps
