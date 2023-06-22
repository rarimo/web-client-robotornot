import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentWrapper,
  TableWithPagination,
  TransactionListRow,
} from '@/components'
import { TableColumn, TableListProps, TransactionListFragment } from '@/types'

export enum ColumnIds {
  HASH = 'hash',
  SENDER = 'sender',
  VALIDATOR = 'validator',
  OPERATION = 'operation',
  BLOCK = 'title',
  DATE = 'date',
  STATUS = 'status',
  FEE = 'fee',
}

const TransactionList = ({
  isLoading,
  isLoadingError,
  limit,
  offset,
  list,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableListProps<TransactionListFragment>) => {
  const { t } = useTranslation()

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.HASH,
      label: t('transactions-list.hash-col-lbl'),
      minWidth: 150,
      maxWidth: 250,
    },
    {
      id: ColumnIds.SENDER,
      label: t('transactions-list.sender-col-lbl'),
      minWidth: 150,
      maxWidth: 250,
    },
    {
      id: ColumnIds.VALIDATOR,
      label: t('transactions-list.validator-col-lbl'),
      minWidth: 150,
      maxWidth: 250,
    },
    {
      id: ColumnIds.OPERATION,
      label: t('transactions-list.operation-col-lbl'),
      minWidth: 100,
    },
    {
      id: ColumnIds.BLOCK,
      label: t('transactions-list.block-col-lbl'),
      minWidth: 70,
    },
    {
      id: ColumnIds.DATE,
      label: t('transactions-list.date-col-lbl'),
      minWidth: 130,
    },
    {
      id: ColumnIds.STATUS,
      label: t('transactions-list.status-col-lbl'),
      minWidth: 70,
    },
    {
      id: ColumnIds.FEE,
      label: t('transactions-list.fee-col-lbl'),
      minWidth: 70,
    },
  ]

  const headCells = columns.map(column => (
    <TableCell
      key={column.id}
      align={column.align}
      sx={{ minWidth: column.minWidth }}
    >
      {column.label}
    </TableCell>
  ))

  const rows = (
    isLoading ? new Array(limit).fill({} as TransactionListFragment) : list
  ).map((row, idx) => (
    <TransactionListRow
      columns={columns}
      transaction={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('transactions-list.table-lbl')}
        noDataMessage={t('transactions-list.no-data-msg')}
        isLoadingError={isLoadingError}
        isLoading={isLoading}
        limit={limit}
        offset={offset}
        count={count}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        headCells={headCells}
        rows={rows}
      />
    </ContentWrapper>
  )
}

export default TransactionList
