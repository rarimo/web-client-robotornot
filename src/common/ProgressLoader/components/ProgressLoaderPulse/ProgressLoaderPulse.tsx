import './styles.scss'

import { motion, type MotionProps, MotionStyle } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

const ProgressLoaderPulse: FC<MotionProps & HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  const size = 45
  const speed = 4
  const delay = 1.5
  const stroke = 1
  const color = 'var(--primary-main)'

  // const strokeSize = size / 16
  const ripple: MotionStyle = {
    width: size,
    height: size,
    backgroundColor: 'transparent',
    borderRadius: '50%',
    position: 'absolute',
    boxShadow: `0 0 0 ${stroke}px ${color}`,
    zIndex: 0,
  }
  const transition = {
    ease: 'linear',
    duration: speed,
    delay: 0,
    repeat: Infinity,
  }
  const animation = {
    scale: [0, 3],
    opacity: [0.5, 0],
    boxShadow: [`0 0 0 ${stroke * 2}px ${color}`, `0 0 0 ${stroke}px ${color}`],
  }

  return (
    <motion.div
      className={['progress-loader-pulse', className].join(' ')}
      {...rest}
    >
      <motion.div
        style={{ zIndex: 1 }}
        className='progress-loader-pulse__inner'
      >
        <Icon
          className='progress-loader-pulse__icon'
          name={ICON_NAMES.shieldCheck}
        />
      </motion.div>
      <motion.div
        style={ripple}
        animate={animation}
        transition={{ ...transition }}
      />
      <motion.div
        style={ripple}
        animate={animation}
        transition={{ ...transition, delay: delay }}
      />
      <motion.div
        style={ripple}
        animate={animation}
        transition={{ ...transition, delay: delay * 2 }}
      />
      <motion.div
        style={ripple}
        animate={animation}
        transition={{ ...transition, delay: delay * 3 }}
      />
    </motion.div>
  )
}

export default ProgressLoaderPulse
