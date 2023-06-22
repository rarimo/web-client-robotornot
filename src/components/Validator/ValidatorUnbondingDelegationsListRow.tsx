import { time } from '@distributedlab/tools'
import { Skeleton, TableCell, TableRow } from '@mui/material'

import { AvatarName } from '@/components'
import { createColumnMap, formatCurrencyWithDenom } from '@/helpers'
import { TableColumn, ValidatorUnbondingDelegation } from '@/types'

import { ColumnIds } from './ValidatorUnbondingDelegationsList'

const ValidatorUnbondingDelegationsListRow = ({
  delegation,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  delegation?: ValidatorUnbondingDelegation
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ColumnIds>(columns)

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell sx={columnMap[ColumnIds.ADDRESS]?.sx}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <AvatarName address={delegation?.delegator_address ?? ''} />
        )}
      </TableCell>

      <TableCell sx={columnMap[ColumnIds.AMOUNT]?.sx}>
        {isLoading ? (
          <Skeleton />
        ) : (
          formatCurrencyWithDenom(delegation?.entries?.[0]?.balance)
        )}
      </TableCell>

      <TableCell sx={columnMap[ColumnIds.AGE]?.sx}>
        {isLoading ? (
          <Skeleton />
        ) : (
          time(delegation?.entries?.[0]?.completion_time, { utc: true }).fromNow
        )}
      </TableCell>
    </TableRow>
  )
}

export default ValidatorUnbondingDelegationsListRow
