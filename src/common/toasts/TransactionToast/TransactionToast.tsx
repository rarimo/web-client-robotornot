import { config } from '@config'
import { type TransactionResponse } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: 'pending' | 'error' | 'success'
  link?: string
  txHash?: string
  txResponse?: TransactionResponse
}

const TransactionToast: FC<Props> = ({ type, link, txHash, txResponse }) => {
  const { t } = useTranslation()
  const { provider } = useWeb3Context()

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

  const targetLink = useMemo(() => {
    if (link) return link

    if (txHash) {
      const txUrl = provider?.getTxUrl?.(
        config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
        txHash,
      )

      if (!txUrl) return ''

      return txUrl
    }

    if (txResponse) {
      const txHash = provider?.getHashFromTx?.(txResponse)

      if (!txHash) return ''

      const txUrl = provider?.getTxUrl?.(
        config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
        txHash,
      )

      if (!txUrl) return ''

      return txUrl
    }

    return ''
  }, [link, provider, txHash, txResponse])

  return (
    <div className='toast__body'>
      <div className='toast__icon-wrp'>
        <Icon className='toast__icon' name={iconName} />
      </div>
      <div className='toast__details'>
        <h4 className='toast__title'>{toastTitle}</h4>
        <a
          href={targetLink}
          target='_blank'
          rel='noreferrer noopener'
          className='toast__message'
        >
          {toastMessage}
          <Icon
            className='toast__message-icon'
            name={ICON_NAMES.externalLink}
          />
        </a>
      </div>
    </div>
  )
}

export default TransactionToast
