import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ContentSection, TransactionOverviewSection } from '@/components'
import { useLoading, useTransactions } from '@/hooks'
import { TransactionFragment } from '@/types'

const TransactionDetailsSection = () => {
  const { t } = useTranslation()
  const { hash } = useParams()
  const { getTransactionByHash } = useTransactions()

  const {
    data: transaction,
    isLoading,
    isLoadingError,
    isEmpty,
  } = useLoading<TransactionFragment>({} as TransactionFragment, () =>
    getTransactionByHash(hash as string),
  )
  return (
    <ContentSection withBackButton title={t('transaction-details.title')}>
      <TransactionOverviewSection
        isLoading={isLoading}
        isLoadingError={isLoadingError}
        transaction={transaction}
        isEmpty={isEmpty}
      />
    </ContentSection>
  )
}

export default TransactionDetailsSection
