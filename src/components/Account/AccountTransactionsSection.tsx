import { useTranslation } from 'react-i18next'

import { ContentBox, ContentSection, TransactionList } from '@/components'
import { useLoading, useTablePagination, useTransactions } from '@/hooks'
import { PubKeyModel, TransactionListFragment } from '@/types'

type AccountTransactionsSectionProps = {
  sender?: PubKeyModel
  isAccountLoading: boolean
  isAccountLoadingError: boolean
}

const AccountTransactionsSection = ({
  sender,
  isAccountLoading,
  isAccountLoadingError,
}: AccountTransactionsSectionProps) => {
  const { t } = useTranslation()
  const { getTransactionsList, getTransactionCount } = useTransactions()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: transactionCount,
    isLoading: isLoadingTransactionCount,
    isLoadingError: isLoadingTransactionCountError,
  } = useLoading<number>(0, () => getTransactionCount({ sender }))

  const {
    data: transactionList,
    isLoading,
    isLoadingError,
  } = useLoading<TransactionListFragment[]>(
    [],
    () => getTransactionsList({ limit, offset, sender }),
    { loadArgs: [limit, offset] },
  )

  return (
    <ContentSection title={t('account-transactions-section.title-lbl')}>
      <ContentBox>
        <TransactionList
          limit={limit}
          offset={offset}
          list={transactionList}
          count={transactionCount}
          isLoading={isLoading || isLoadingTransactionCount || isAccountLoading}
          isLoadingError={
            isLoadingError ||
            isLoadingTransactionCountError ||
            isAccountLoadingError
          }
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </ContentBox>
    </ContentSection>
  )
}

export default AccountTransactionsSection
