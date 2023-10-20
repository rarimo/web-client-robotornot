import './styles.scss'

import { motion, type MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useMemo } from 'react'

import { Icon } from '@/common'
import { Skeleton } from '@/common/Loader/variants'
import { ICON_NAMES } from '@/enums'

type Props = MotionProps &
  HTMLAttributes<HTMLDivElement> & {
    iconNameOrImgUrl?: ICON_NAMES | string
  }

const ProgressLoaderSkeleton: FC<Props> = ({
  iconNameOrImgUrl,
  className,
  ...rest
}) => {
  const isIcon = useMemo(() => {
    if (!iconNameOrImgUrl) return null

    return (
      Boolean(iconNameOrImgUrl) &&
      (Object.values(ICON_NAMES) as string[]).includes(iconNameOrImgUrl)
    )
  }, [iconNameOrImgUrl])

  return (
    <motion.div
      className={['progress-loader-skeleton', className].join(' ')}
      {...rest}
    >
      {iconNameOrImgUrl && (
        <motion.div className='progress-loader-skeleton__inner'>
          {isIcon ? (
            <Icon
              className='progress-loader-skeleton__icon'
              name={iconNameOrImgUrl as ICON_NAMES}
            />
          ) : (
            <motion.img
              className='progress-loader-skeleton__icon'
              alt='icon'
              src={iconNameOrImgUrl}
            />
          )}
        </motion.div>
      )}

      <Skeleton className='progress-loader-skeleton__item' scheme='medium' />
      <Skeleton className='progress-loader-skeleton__item' scheme='thin' />
      <Skeleton className='progress-loader-skeleton__item' scheme='thin' />
      <Skeleton className='progress-loader-skeleton__item' scheme='thin' />
    </motion.div>
  )
}

export default ProgressLoaderSkeleton
