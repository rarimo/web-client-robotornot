import { useTranslation } from 'react-i18next'

import { ContentBox, ContentSection, TransactionList } from '@/components'
import { useLoading, useTablePagination, useTransactions } from '@/hooks'
import { TransactionListFragment } from '@/types'

type ValidatorTransactionsSectionProps = {
  operator?: string
}

const ValidatorTransactionsSection = ({
  operator,
}: ValidatorTransactionsSectionProps) => {
  const { t } = useTranslation()
  const { getTransactionsList, getTransactionCount } = useTransactions()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: transactionCount,
    isLoading: isLoadingTransactionCount,
    isLoadingError: isLoadingTransactionCountError,
  } = useLoading<number>(0, () => getTransactionCount({ operator }))

  const {
    data: transactionList,
    isLoading,
    isLoadingError,
  } = useLoading<TransactionListFragment[]>(
    [],
    () => getTransactionsList({ limit, offset, operator }),
    { loadArgs: [limit, offset] },
  )

  return (
    <ContentSection title={t('validator-transactions-section.title-lbl')}>
      <ContentBox>
        <TransactionList
          limit={limit}
          offset={offset}
          list={transactionList}
          count={transactionCount}
          isLoading={isLoading || isLoadingTransactionCount}
          isLoadingError={isLoadingError || isLoadingTransactionCountError}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </ContentBox>
    </ContentSection>
  )
}

export default ValidatorTransactionsSection
