import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, Modal } from '@/common'
import { ICON_NAMES } from '@/enums'

interface Props extends HTMLAttributes<HTMLDivElement> {
  isShown: boolean
  updateIsShown: (isShown: boolean) => void
  isCloseByClickOutside?: boolean
  title?: string
  subtitle?: string
}

const BasicModal: FC<Props> = ({
  isShown,
  updateIsShown,
  isCloseByClickOutside,
  title,
  subtitle,
  children,
  className,
  ...rest
}) => {
  return (
    <Modal
      isShown={isShown}
      updateIsShown={updateIsShown}
      isCloseByClickOutside={isCloseByClickOutside}
    >
      <div className={`basic-modal__pane ${className}`} {...rest}>
        <div className='basic-modal__header'>
          <div className='basic-modal__header-titles'>
            {title && <h5 className='basic-modal__title'>{title}</h5>}
            {subtitle && (
              <span className='basic-modal__subtitle'>{subtitle}</span>
            )}
          </div>
          <AppButton
            className='basic-modal__close-btn'
            scheme='none'
            size='none'
            iconRight={ICON_NAMES.x}
            onClick={() => updateIsShown(false)}
          />
        </div>
        {children}
      </div>
    </Modal>
  )
}

export default BasicModal
