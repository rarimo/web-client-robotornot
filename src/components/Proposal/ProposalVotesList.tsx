import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentBox,
  ContentWrapper,
  ProposalVotesListRow,
  TableWithPagination,
} from '@/components'
import { ProposalVoteFragment, TableColumn, TableListProps } from '@/types'

export enum ColumnIds {
  VOTER = 'voter_address',
  TX_HASH = 'hash',
  BLOCK_HEIGHT = 'height',
  AGE = 'timestamp',
  OPTION = 'option',
}

const ProposalVotesList = ({
  isLoading,
  isLoadingError,
  limit,
  offset,
  list,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableListProps<ProposalVoteFragment>) => {
  const { t } = useTranslation()

  const overflowSx = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.VOTER,
      label: t('proposal-votes-list.voter-account-id-col-lbl'),
      sx: {
        ...overflowSx,
        minWidth: 100,
        maxWidth: 200,
      },
    },
    {
      id: ColumnIds.TX_HASH,
      label: t('proposal-votes-list.tx-hash-col-lbl'),
      sx: {
        ...overflowSx,
        minWidth: 100,
        maxWidth: 200,
      },
    },
    {
      id: ColumnIds.BLOCK_HEIGHT,
      label: t('proposal-votes-list.block-height-col-lbl'),
      sx: {
        ...overflowSx,
        minWidth: 40,
        maxWidth: 80,
      },
    },
    {
      id: ColumnIds.AGE,
      label: t('proposal-votes-list.age-col-lbl'),
      sx: { ...overflowSx, minWidth: 40, maxWidth: 80 },
    },
    {
      id: ColumnIds.OPTION,
      label: t('proposal-votes-list.option-col-lbl'),
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
    isLoading ? new Array(limit).fill({} as ProposalVoteFragment) : list
  ).map((row, idx) => (
    <ProposalVotesListRow
      columns={columns}
      vote={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentBox>
      <ContentWrapper>
        <TableWithPagination
          label={t('proposal-votes-list.table-lbl')}
          noDataMessage={t('proposal-votes-list.no-data-msg')}
          isLoadingError={isLoadingError}
          isLoading={isLoading}
          minHeighted={false}
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

export default ProposalVotesList
