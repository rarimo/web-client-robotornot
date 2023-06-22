import { Skeleton, TableCell, TableRow } from '@mui/material'

import { AvatarName } from '@/components'
import { createColumnMap, formatCurrencyWithDenom } from '@/helpers'
import { TableColumn, ValidatorDelegation } from '@/types'

import { ColumnIds } from './ValidatorDelegationsList'

const ValidatorDelegationsListRow = ({
  delegation,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  delegation?: ValidatorDelegation
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
          formatCurrencyWithDenom(delegation?.coins?.[0]?.amount)
        )}
      </TableCell>
    </TableRow>
  )
}

export default ValidatorDelegationsListRow
