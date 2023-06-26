import { motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import LoginForm from '@/forms/LoginForm'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

const ComplexForm: FC<Props> = ({ className, ...rest }) => {
  return (
    <motion.section className={`ui-kit__form ${className}`} {...rest}>
      <LoginForm />
    </motion.section>
  )
}

export default ComplexForm
