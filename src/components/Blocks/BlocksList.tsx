import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  BlocksListRow,
  ContentWrapper,
  TableWithPagination,
} from '@/components'
import { BlockListFragment, TableColumn, TableListProps } from '@/types'

export enum ColumnIds {
  BLOCK = 'block',
  TXN = 'txn',
  DATE = 'date',
  VALIDATOR = 'validator',
  GAS = 'gas',
}

const BlockList = ({
  isLoading,
  isLoadingError,
  limit,
  offset,
  list,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableListProps<BlockListFragment>) => {
  const { t } = useTranslation()

  const overflow = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.BLOCK,
      label: t('block-list.block-col-lbl'),
      sx: {
        minWidth: 150,
        maxWidth: 250,
      },
    },
    {
      id: ColumnIds.DATE,
      label: t('block-list.date-col-lbl'),
      sx: { minWidth: 70 },
    },
    {
      id: ColumnIds.VALIDATOR,
      label: t('block-list.validator-col-lbl'),
      sx: { ...overflow, minWidth: 100, maxWidth: 250 },
    },
    {
      id: ColumnIds.GAS,
      label: t('block-list.gas-col-lbl'),
      sx: {
        minWidth: 100,
      },
      align: 'right',
    },
    {
      id: ColumnIds.TXN,
      label: t('block-list.tnx-col-lbl'),
      sx: {
        minWidth: 70,
      },
      align: 'right',
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
    isLoading ? new Array(limit).fill({} as BlockListFragment) : list
  ).map((row, idx) => (
    <BlocksListRow
      columns={columns}
      block={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('block-list.table-lbl')}
        noDataMessage={t('block-list.no-data-msg')}
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

export default BlockList
