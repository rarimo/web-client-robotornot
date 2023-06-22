import { Chip, Link, Skeleton, TableCell, TableRow } from '@mui/material'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName, ProposalStatus } from '@/components'
import { PROPOSAL_TYPES_MAP } from '@/const'
import { RoutePaths } from '@/enums'
import { createColumnMap } from '@/helpers'
import { useLocalize } from '@/hooks'
import { ProposalBaseFragment, TableColumn } from '@/types'

import { ColumnIds } from './ProposalList'

const ProposalListRow = ({
  proposal,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  proposal?: ProposalBaseFragment
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ColumnIds>(columns)
  const { localizeProposalType } = useLocalize()

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell
        sx={{
          minWidth: columnMap[ColumnIds.ID]?.minWidth,
        }}
        align={columnMap[ColumnIds.ID].align}
      >
        {isLoading ? <Skeleton /> : `#${proposal?.id}`}
      </TableCell>

      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.TITLE]?.minWidth }}
        align={columnMap[ColumnIds.TITLE].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Link
            component={NavLink}
            to={generatePath(RoutePaths.Proposal, { id: `${proposal?.id}` })}
          >
            {proposal?.title}
          </Link>
        )}
      </TableCell>

      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.TYPE]?.minWidth }}
        align={columnMap[ColumnIds.TYPE].align}
      >
        {isLoading ? (
          <Skeleton sx={{ ml: 'auto' }} />
        ) : (
          <Chip
            label={localizeProposalType(
              PROPOSAL_TYPES_MAP[
                proposal?.proposal_type as keyof typeof PROPOSAL_TYPES_MAP
              ] ?? '',
            )}
          />
        )}
      </TableCell>

      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.PROPOSER]?.minWidth }}
        align={columnMap[ColumnIds.PROPOSER].align}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <AvatarName address={proposal?.proposer_address ?? ''} />
        )}
      </TableCell>

      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.STATUS]?.minWidth }}
        align={columnMap[ColumnIds.STATUS].align}
      >
        {isLoading ? (
          <Skeleton sx={{ ml: 'auto' }}>
            <ProposalStatus status={proposal?.status ?? ''} />
          </Skeleton>
        ) : (
          <ProposalStatus status={proposal?.status ?? ''} />
        )}
      </TableCell>
    </TableRow>
  )
}

export default ProposalListRow
