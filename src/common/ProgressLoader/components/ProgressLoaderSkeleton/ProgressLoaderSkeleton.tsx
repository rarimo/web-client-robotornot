import './styles.scss'

import { motion, type MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { Icon } from '@/common'
import { Skeleton } from '@/common/Loader/variants'
import { ICON_NAMES } from '@/enums'

const ProgressLoaderSkeleton: FC<
  MotionProps & HTMLAttributes<HTMLDivElement>
> = ({ className, ...rest }) => {
  return (
    <motion.div
      className={['progress-loader-skeleton', className].join(' ')}
      {...rest}
    >
      <motion.div className='progress-loader-skeleton__inner'>
        <Icon
          className='progress-loader-skeleton__icon'
          name={ICON_NAMES.providerUnstoppable}
        />
      </motion.div>

      <Skeleton className='progress-loader-skeleton__item' scheme='medium' />
      <Skeleton className='progress-loader-skeleton__item' scheme='thin' />
      <Skeleton className='progress-loader-skeleton__item' scheme='thin' />
      <Skeleton className='progress-loader-skeleton__item' scheme='thin' />
    </motion.div>
  )
}

export default ProgressLoaderSkeleton
