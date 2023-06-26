import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string
  iconName?: ICON_NAMES
}

const NoDataMessage: FC<Props> = ({
  message,
  iconName = ICON_NAMES.archive,
  className = '',
  ...rest
}) => {
  return (
    <div className={`no-data-message ${className}`} {...rest}>
      <Icon className='no-data-message__img' name={iconName} />
      <span className='no-data-message__message'>{message}</span>
    </div>
  )
}

export default NoDataMessage
