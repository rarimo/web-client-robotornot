import { useTranslation } from 'react-i18next'

import { ContentBox, ContentSection, TransactionList } from '@/components'
import { useLoading, useTablePagination, useTransactions } from '@/hooks'
import { TransactionListFragment } from '@/types'

type BlockTransactionsSectionProps = {
  blockHeight?: number | bigint
  amountTX: number
  isBlockLoading: boolean
  isBlockLoadingError: boolean
}

const BlockTransactionsSection = ({
  blockHeight,
  isBlockLoading,
  isBlockLoadingError,
  amountTX,
}: BlockTransactionsSectionProps) => {
  const { t } = useTranslation()
  const { getTransactionsListByBlock } = useTransactions()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: transactionList,
    isLoading,
    isLoadingError,
  } = useLoading<TransactionListFragment[]>(
    [],
    () => getTransactionsListByBlock(limit, offset, blockHeight),
    { loadArgs: [limit, offset] },
  )

  return (
    <ContentSection title={t('block-transactions-section.title-lbl')}>
      <ContentBox>
        <TransactionList
          limit={limit}
          offset={offset}
          list={transactionList}
          count={amountTX}
          isLoading={isLoading || isBlockLoading}
          isLoadingError={isLoadingError || isBlockLoadingError}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </ContentBox>
    </ContentSection>
  )
}

export default BlockTransactionsSection
