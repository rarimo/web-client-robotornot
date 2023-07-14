import 'react-toastify/dist/ReactToastify.css'
import './styles.scss'

import { FC, HTMLAttributes, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: 'pending' | 'error' | 'success'
  link: string
}

const TransactionToast: FC<Props> = ({ type, link }) => {
  const { t } = useTranslation()

  const iconName = useMemo(() => {
    switch (type) {
      case 'pending':
        return ICON_NAMES.exclamationCircle
      case 'success':
        return ICON_NAMES.checkCircle
      case 'error':
        return ICON_NAMES.exclamationCircle
      default:
        return ICON_NAMES.exclamationCircle
    }
  }, [type])

  const toastTitle = useMemo(() => {
    switch (type) {
      case 'pending':
        return t('notifications.tx-pending-title')
      case 'success':
        return t('notifications.tx-success-title')
      case 'error':
        return t('notifications.tx-error-title')
      default:
        return ''
    }
  }, [t, type])

  const toastMessage = useMemo(() => {
    switch (type) {
      case 'pending':
        return t('notifications.tx-pending-message')
      case 'success':
        return t('notifications.tx-success-message')
      case 'error':
        return t('notifications.tx-error-message')
      default:
        return ''
    }
  }, [t, type])

  return (
    <div className='transaction-toast__body'>
      <div className='transaction-toast__icon-wrp'>
        <Icon className='transaction-toast__icon' name={iconName} />
      </div>
      <div className='transaction-toast__details'>
        <h4 className='transaction-toast__title'>{toastTitle}</h4>
        <a
          href={link}
          target='_blank'
          rel='noreferrer noopener'
          className='transaction-toast__message'
        >
          {toastMessage}
          <Icon
            className='transaction-toast__message-icon'
            name={ICON_NAMES.externalLink}
          />
        </a>
      </div>
    </div>
  )
}

export default TransactionToast
