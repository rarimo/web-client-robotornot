import { useTranslation } from 'react-i18next'

import { ContentBox, ContentSection, TransactionList } from '@/components'
import { useLoading, useTablePagination, useTransactions } from '@/hooks'
import { TransactionListFragment } from '@/types'

const TransactionSection = () => {
  const { t } = useTranslation()
  const { getTransactionsList, getTransactionCount } = useTransactions()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: transactionCount,
    isLoading: isLoadingTransactionCount,
    isLoadingError: isLoadingTransactionCountError,
  } = useLoading<number>(0, () => getTransactionCount())

  const {
    data: transactionList,
    isLoading,
    isLoadingError,
  } = useLoading<TransactionListFragment[]>(
    [],
    () => getTransactionsList({ limit, offset }),
    {
      loadArgs: [limit, offset],
    },
  )

  return (
    <ContentSection withBackButton title={t('transactions-list.table-lbl')}>
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

export default TransactionSection
