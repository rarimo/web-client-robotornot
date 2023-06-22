import { time } from '@distributedlab/tools'
import { Link, Skeleton, TableCell, TableRow } from '@mui/material'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName, ProposalVoteOption } from '@/components'
import { RoutePaths } from '@/enums'
import { createColumnMap } from '@/helpers'
import { ProposalVoteFragment, TableColumn } from '@/types'

import { ColumnIds } from './ProposalVotesList'

const ProposalVotesListRow = ({
  vote,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  vote?: ProposalVoteFragment
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ColumnIds>(columns)

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell
        sx={columnMap[ColumnIds.VOTER]?.sx}
        align={columnMap[ColumnIds.VOTER].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <AvatarName address={vote?.voter_address ?? ''} />
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
              hash: `${vote?.block?.transactions[0].hash}`,
            })}
          >
            {vote?.block?.transactions[0].hash}
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
              height: `${vote?.height}` ?? '',
            })}
          >
            {vote?.height}
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
          time(vote?.block?.timestamp, { utc: true }).fromNow
        )}
      </TableCell>
      <TableCell
        sx={columnMap[ColumnIds.OPTION]?.sx}
        align={columnMap[ColumnIds.OPTION].align}
      >
        {isLoading ? (
          <Skeleton sx={{ ml: 'auto' }}>
            <ProposalVoteOption vote={vote?.option ?? ''} />
          </Skeleton>
        ) : (
          <ProposalVoteOption vote={vote?.option ?? ''} />
        )}
      </TableCell>
    </TableRow>
  )
}

export default ProposalVotesListRow
