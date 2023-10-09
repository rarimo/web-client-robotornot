import './styles.scss'

import { MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    iconName: ICON_NAMES
  }

const WrappedIcon: FC<Props> = ({ iconName, className, ...rest }) => {
  return (
    <div className={['wrapped-icon__wrp', className].join(' ')} {...rest}>
      <div className='wrapped-icon__inner'>
        <Icon className='wrapped-icon' name={iconName} />
      </div>
    </div>
  )
}

export default WrappedIcon
