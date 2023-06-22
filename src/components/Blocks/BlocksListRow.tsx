import { time } from '@distributedlab/tools'
import { Link, Skeleton, TableCell, TableRow } from '@mui/material'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName } from '@/components'
import { RoutePaths } from '@/enums'
import { createColumnMap } from '@/helpers'
import { BlockListFragment, TableColumn } from '@/types'

import { ColumnIds } from './BlocksList'

const BlockListRow = ({
  block,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  block?: BlockListFragment
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ColumnIds>(columns)

  const overflow = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell
        sx={{
          ...columnMap[ColumnIds.BLOCK]?.sx,
          ...overflow,
        }}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Link
            component={NavLink}
            to={generatePath(RoutePaths.Block, { height: block?.height })}
          >
            {block?.height}
          </Link>
        )}
      </TableCell>

      <TableCell sx={{ minWidth: columnMap[ColumnIds.DATE]?.minWidth }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          time(block?.timestamp, { utc: true }).fromNow
        )}
      </TableCell>
      <TableCell
        sx={{
          ...columnMap[ColumnIds.VALIDATOR]?.sx,
          ...overflow,
        }}
      >
        {isLoading ? (
          <Skeleton width={'100%'} />
        ) : (
          <AvatarName
            address={block?.validator?.validator_info?.operator_address ?? ''}
            name={block?.validator?.validator_descriptions?.[0]?.moniker ?? ''}
            imageUrl={
              block?.validator?.validator_descriptions?.[0]?.avatar_url ?? ''
            }
          />
        )}
      </TableCell>
      <TableCell
        sx={columnMap[ColumnIds.GAS]?.sx}
        align={columnMap[ColumnIds.GAS]?.align}
      >
        {isLoading ? <Skeleton /> : block?.total_gas}
      </TableCell>

      <TableCell
        sx={columnMap[ColumnIds.TXN]?.sx}
        align={columnMap[ColumnIds.TXN]?.align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          block?.transactions_aggregate.aggregate?.count
        )}
      </TableCell>
    </TableRow>
  )
}

export default BlockListRow
