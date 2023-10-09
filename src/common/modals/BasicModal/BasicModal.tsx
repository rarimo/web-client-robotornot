import './styles.scss'

import { MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { AppButton, Modal } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
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
      className={['basic-modal', className].join(' ')}
      isShown={isShown}
      updateIsShown={updateIsShown}
      isCloseByClickOutside={isCloseByClickOutside}
      {...rest}
    >
      <div className='basic-modal__inner'>
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
        <div className='basic-modal__body'>{children}</div>
      </div>
    </Modal>
  )
}

export default BasicModal
