import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentWrapper,
  ProposalListRow,
  TableWithPagination,
} from '@/components'
import { ProposalBaseFragment, TableColumn, TableListProps } from '@/types'

export enum ColumnIds {
  ID = 'id',
  TITLE = 'title',
  TYPE = 'type',
  PROPOSER = 'proposer_address',
  STATUS = 'status',
}

const ProposalList = ({
  isLoading,
  isLoadingError,
  limit,
  offset,
  list,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableListProps<ProposalBaseFragment>) => {
  const { t } = useTranslation()

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.ID,
      label: t('proposal-list.id-col-lbl'),
      minWidth: 40,
    },
    {
      id: ColumnIds.TITLE,
      label: t('proposal-list.title-col-lbl'),
      minWidth: 150,
    },
    {
      id: ColumnIds.TYPE,
      label: t('proposal-list.type-col-lbl'),
      minWidth: 150,
    },
    {
      id: ColumnIds.PROPOSER,
      label: t('proposal-list.proposer-col-lbl'),
      minWidth: 170,
    },
    {
      id: ColumnIds.STATUS,
      label: t('proposal-list.status-col-lbl'),
      minWidth: 70,
      align: 'center',
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
    isLoading ? new Array(limit).fill({} as ProposalBaseFragment) : list
  ).map((row, idx) => (
    <ProposalListRow
      columns={columns}
      proposal={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('proposal-list.table-lbl')}
        noDataMessage={t('proposal-list.no-data-msg')}
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

export default ProposalList
