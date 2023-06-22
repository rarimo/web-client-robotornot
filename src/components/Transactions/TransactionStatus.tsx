import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'

const TransactionStatus = ({ status }: { status?: boolean }) => {
  const { t } = useTranslation()
  const getTransactionStatusColor = (status: boolean | undefined) =>
    status ? 'success' : 'error'
  const getTransactionStatusText = (status: boolean | undefined) =>
    status
      ? t('transactions-list.successful')
      : t('transactions-list.unsuccessful')

  return (
    <Chip
      label={getTransactionStatusText(status) ?? ''}
      color={getTransactionStatusColor(status) ?? 'primary'}
    />
  )
}

export default TransactionStatus
