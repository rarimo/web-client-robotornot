import './styles.scss'

import { FC, HTMLAttributes, ReactNode } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string | ReactNode
  iconName?: ICON_NAMES
  color?: 'success' | 'error' | 'warning' | 'info'
}

const CautionTip: FC<Props> = ({
  color = 'warning',
  message,
  iconName = ICON_NAMES.informationCircle,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={`caution-tip caution-tip--color-${color} ${
        rest.className ?? ''
      }`}
    >
      <Icon className='caution-tip__icon' name={iconName} />
      <span className='caution-tip__message'>{message}</span>
    </div>
  )
}

export default CautionTip
