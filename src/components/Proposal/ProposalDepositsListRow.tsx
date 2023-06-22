import { CONFIG } from '@config'
import { BN, time } from '@distributedlab/tools'
import { Link, Skeleton, TableCell, TableRow } from '@mui/material'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName } from '@/components'
import { RoutePaths } from '@/enums'
import { createColumnMap } from '@/helpers'
import { ProposalDepositFragment, TableColumn } from '@/types'

import { ColumnIds } from './ProposalDepositsList'

const ProposalDepositsListRow = ({
  deposit,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  deposit?: ProposalDepositFragment
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ColumnIds>(columns)

  const depositAmount = `${BN.fromBigInt(
    deposit?.amount?.[0]?.amount,
    CONFIG.DECIMALS,
  )
    .fromFraction(CONFIG.DECIMALS)
    .format({
      decimals: 2,
    })} ${CONFIG.DENOM.toUpperCase()}`

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell
        sx={columnMap[ColumnIds.DEPOSITOR]?.sx}
        align={columnMap[ColumnIds.DEPOSITOR].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <AvatarName address={deposit?.depositor_address ?? ''} />
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ColumnIds.TX_HASH]?.sx}
        align={columnMap[ColumnIds.TX_HASH].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Link
            component={NavLink}
            to={generatePath(RoutePaths.Transaction, {
              hash: `${deposit?.block?.transactions[0].hash}`,
            })}
          >
            {deposit?.block?.transactions[0].hash}
          </Link>
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ColumnIds.BLOCK_HEIGHT]?.sx}
        align={columnMap[ColumnIds.BLOCK_HEIGHT].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Link
            component={NavLink}
            to={generatePath(RoutePaths.Block, {
              height: `${deposit?.block?.height}` ?? '',
            })}
          >
            {deposit?.block?.height}
          </Link>
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ColumnIds.AGE]?.sx}
        align={columnMap[ColumnIds.AGE].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          time(deposit?.block?.timestamp, { utc: true }).fromNow
        )}
      </TableCell>
      <TableCell
        sx={columnMap[ColumnIds.AMOUNT]?.sx}
        align={columnMap[ColumnIds.AMOUNT].align}
      >
        {isLoading ? <Skeleton /> : depositAmount}
      </TableCell>
    </TableRow>
  )
}

export default ProposalDepositsListRow
