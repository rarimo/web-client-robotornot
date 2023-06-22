import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentWrapper,
  TableWithPagination,
  ValidatorUnbondingDelegationsListRow,
} from '@/components'
import {
  GetValidatorUnbondingDelegationListQuery,
  TableColumn,
  TableListProps,
  ValidatorBaseFragment,
  ValidatorUnbondingDelegation,
} from '@/types'

export enum ColumnIds {
  ADDRESS = 'address',
  AMOUNT = 'amount',
  AGE = 'age',
}

const ValidatorUnbondingDelegationsList = ({
  data,
  limit,
  offset,
  isLoading,
  isLoadingError,
  handleChangePage,
  handleChangeRowsPerPage,
}: Omit<TableListProps<ValidatorBaseFragment>, 'count' | 'list'> & {
  data: GetValidatorUnbondingDelegationListQuery
}) => {
  const { t } = useTranslation()

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.ADDRESS,
      label: t('validator-unbonding-delegations-list.address-col-lbl'),
      sx: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 150,
        maxWidth: 250,
      },
    },
    {
      id: ColumnIds.AMOUNT,
      label: t('validator-unbonding-delegations-list.amount-col-lbl'),
      sx: {
        minWidth: 100,
      },
    },
    {
      id: ColumnIds.AGE,
      label: t('validator-unbonding-delegations-list.age-col-lbl'),
      minWidth: 100,
    },
  ]

  const headCells = columns.map(column => (
    <TableCell key={column.id} align={column.align} sx={column.sx}>
      {column.label}
    </TableCell>
  ))

  const rows = (
    isLoading
      ? new Array(limit).fill({} as ValidatorUnbondingDelegation)
      : data?.action_validator_unbonding_delegations?.unbonding_delegations
  )?.map((row, idx) => (
    <ValidatorUnbondingDelegationsListRow
      columns={columns}
      delegation={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('validator-unbonding-delegations-list.table-lbl')}
        noDataMessage={t('validator-unbonding-delegations-list.no-data-msg')}
        isLoadingError={isLoadingError}
        isLoading={isLoading}
        limit={limit}
        offset={offset}
        count={
          data?.action_validator_unbonding_delegations?.pagination?.total ?? 0
        }
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        headCells={headCells}
        rows={rows as JSX.Element[]}
      />
    </ContentWrapper>
  )
}

export default ValidatorUnbondingDelegationsList
