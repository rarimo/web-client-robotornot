import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentBox,
  ContentWrapper,
  ProposalDepositsListRow,
  TableWithPagination,
} from '@/components'
import { ProposalDepositFragment, TableColumn, TableListProps } from '@/types'

export enum ColumnIds {
  DEPOSITOR = 'depositor_address',
  AMOUNT = 'amount',
  BLOCK_HEIGHT = 'height',
  AGE = 'timestamp',
  TX_HASH = 'hash',
}

const ProposalDepositsList = ({
  isLoading,
  isLoadingError,
  limit,
  offset,
  list,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableListProps<ProposalDepositFragment>) => {
  const { t } = useTranslation()

  const overflowSx = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.DEPOSITOR,
      label: t('proposal-deposits-list.depositor-account-id-col-lbl'),
      sx: {
        ...overflowSx,
        minWidth: 100,
        maxWidth: 200,
      },
    },
    {
      id: ColumnIds.TX_HASH,
      label: t('proposal-deposits-list.tx-hash-col-lbl'),
      sx: {
        ...overflowSx,
        minWidth: 100,
        maxWidth: 200,
      },
    },
    {
      id: ColumnIds.BLOCK_HEIGHT,
      label: t('proposal-deposits-list.block-height-col-lbl'),
      sx: {
        ...overflowSx,
        minWidth: 40,
        maxWidth: 80,
      },
    },
    {
      id: ColumnIds.AGE,
      label: t('proposal-deposits-list.age-col-lbl'),
      sx: { ...overflowSx, minWidth: 40, maxWidth: 80 },
    },
    {
      id: ColumnIds.AMOUNT,
      label: t('proposal-deposits-list.amount-col-lbl'),
      sx: { minWidth: 70 },
      align: 'right',
    },
  ]

  const headCells = columns.map(column => (
    <TableCell key={column.id} align={column.align} sx={column.sx}>
      {column.label}
    </TableCell>
  ))

  const rows = (
    isLoading ? new Array(limit).fill({} as ProposalDepositFragment) : list
  ).map((row, idx) => (
    <ProposalDepositsListRow
      columns={columns}
      deposit={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentBox>
      <ContentWrapper>
        <TableWithPagination
          label={t('proposal-deposits-list.table-lbl')}
          noDataMessage={t('proposal-deposits-list.no-data-msg')}
          isLoadingError={isLoadingError}
          minHeighted={false}
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
    </ContentBox>
  )
}

export default ProposalDepositsList
