import { TableCell, TableSortLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentWrapper,
  TableHeadCellWithTip,
  TableWithPagination,
  ValidatorConditionTableHead,
  ValidatorListRow,
} from '@/components'
import {
  SlashingParamsFragment,
  SortOrder,
  StakingPoolFragment,
  TableColumn,
  TableListProps,
  ValidatorBaseFragment,
} from '@/types'
import {
  ValidatorListColumnIds,
  ValidatorListSortBy,
} from '@/types/validator-list'

const ValidatorList = ({
  limit,
  offset,
  order,
  orderBy,
  list,
  slashingParams,
  stakingPool,
  count,
  isLoading,
  isLoadingError,
  setSort,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableListProps<ValidatorBaseFragment> & {
  slashingParams?: SlashingParamsFragment
  stakingPool?: StakingPoolFragment
  order?: SortOrder
  orderBy?: ValidatorListSortBy
  setSort: (orderBy: ValidatorListSortBy) => void
}) => {
  const { t } = useTranslation()

  const overflow = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const columns: readonly TableColumn<ValidatorListColumnIds>[] = [
    {
      id: ValidatorListColumnIds.VALIDATOR,
      label: t('validator-list.validator-col-lbl'),
      sx: { ...overflow, minWidth: 250, maxWidth: 250 },
    },
    {
      id: ValidatorListColumnIds.VOTING_POWER,
      label: t('validator-list.voting-power-col-lbl'),
      sx: { minWidth: 200, maxWidth: 200 },
      align: 'left',
    },
    {
      id: ValidatorListColumnIds.COMMISSION,
      label: t('validator-list.commission-col-lbl'),
      sx: { minWidth: 40 },
      align: 'center',
    },
    {
      id: ValidatorListColumnIds.CONDITION,
      label: t('validator-list.condition-col-lbl'),
      sx: { minWidth: 40 },
      align: 'center',
    },
    {
      id: ValidatorListColumnIds.STATUS,
      label: t('validator-list.status-col-lbl'),
      sx: { minWidth: 70 },
      align: 'center',
    },
  ]

  const getColumnHeadContent = (
    column: TableColumn<ValidatorListColumnIds>,
  ) => {
    if (column.id === ValidatorListColumnIds.CONDITION) {
      return <ValidatorConditionTableHead label={column.label} />
    }

    if (column.id === ValidatorListColumnIds.VOTING_POWER) {
      return (
        <TableSortLabel
          active={orderBy === ValidatorListColumnIds.VOTING_POWER}
          direction={
            orderBy === ValidatorListColumnIds.VOTING_POWER ? order : 'asc'
          }
          onClick={() => {
            setSort(ValidatorListColumnIds.VOTING_POWER)
          }}
        >
          <TableHeadCellWithTip
            label={column.label}
            align={'flex-start'}
            message={t('validator-list.voting-power-col-tip-lbl')}
          />
        </TableSortLabel>
      )
    }

    if (column.id === ValidatorListColumnIds.COMMISSION) {
      return (
        <TableSortLabel
          active={orderBy === ValidatorListColumnIds.COMMISSION}
          direction={
            orderBy === ValidatorListColumnIds.COMMISSION ? order : 'asc'
          }
          onClick={() => {
            setSort(ValidatorListColumnIds.COMMISSION)
          }}
        >
          {column.label}
        </TableSortLabel>
      )
    }

    return column.label
  }

  const rows = (
    isLoading ? new Array(limit).fill({} as ValidatorBaseFragment) : list
  )?.map((row, idx) => (
    <ValidatorListRow
      columns={columns}
      validator={row}
      slashingParams={slashingParams}
      bondedTokens={stakingPool?.bonded_tokens}
      isLoading={isLoading}
      key={idx}
    />
  ))

  const headCells = columns?.map(column => (
    <TableCell
      key={column.id}
      align={column.align}
      sx={column.sx}
      sortDirection={orderBy === column.id ? order : false}
    >
      {getColumnHeadContent(column)}
    </TableCell>
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('validator-list.table-lbl')}
        noDataMessage={t('validator-list.no-data-msg')}
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

export default ValidatorList
