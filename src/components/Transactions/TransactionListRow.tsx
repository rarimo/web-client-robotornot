import { time } from '@distributedlab/tools'
import { Chip, Link, Skeleton, TableCell, TableRow } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName, TransactionStatus } from '@/components'
import { RoutePaths } from '@/enums'
import {
  addressFromPublicKey,
  createColumnMap,
  formatCurrencyWithDenom,
} from '@/helpers'
import { useLocalize } from '@/hooks'
import { TableColumn, TransactionListFragment } from '@/types'

import { ColumnIds } from './TransactionList'

const TransactionListRow = ({
  transaction,
  columns,
  isLoading,
}: {
  columns: readonly TableColumn<ColumnIds>[]
  transaction?: TransactionListFragment
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ColumnIds>(columns)

  const { t } = useTranslation()
  const { localizeMsgType } = useLocalize()

  const amount = transaction?.fee?.amount[0]?.amount

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell
        sx={{
          minWidth: columnMap[ColumnIds.HASH]?.minWidth,
          maxWidth: columnMap[ColumnIds.HASH]?.maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Link
            component={NavLink}
            to={generatePath(RoutePaths.Transaction, {
              hash: `${transaction?.hash}`,
            })}
          >
            {transaction?.hash}
          </Link>
        )}
      </TableCell>

      <TableCell
        sx={{
          minWidth: columnMap[ColumnIds.SENDER]?.minWidth,
          maxWidth: columnMap[ColumnIds.SENDER]?.maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <AvatarName
            address={
              addressFromPublicKey(
                transaction?.signer_infos?.[0]?.public_key ?? {},
              ) ?? ''
            }
          />
        )}
      </TableCell>

      <TableCell
        sx={{
          minWidth: columnMap[ColumnIds.VALIDATOR]?.minWidth,
          maxWidth: columnMap[ColumnIds.VALIDATOR]?.maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <AvatarName
            address={
              transaction?.block?.validator?.validator_info?.operator_address ??
              ''
            }
            name={
              transaction?.block?.validator?.validator_descriptions?.[0]
                ?.moniker ?? ''
            }
            imageUrl={
              transaction?.block?.validator?.validator_descriptions?.[0]
                ?.avatar_url ?? ''
            }
          />
        )}
      </TableCell>

      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.OPERATION]?.minWidth }}
        align={columnMap[ColumnIds.OPERATION].align}
      >
        {isLoading ? (
          <Skeleton sx={{ ml: 'auto' }} />
        ) : (
          <Chip
            label={
              localizeMsgType(transaction?.messages?.[0]?.['@type']) ??
              t('message-types.unknown-lbl')
            }
          />
        )}
      </TableCell>

      <TableCell sx={{ minWidth: columnMap[ColumnIds.BLOCK]?.minWidth }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Link
            component={NavLink}
            to={generatePath(RoutePaths.Block, {
              height: String(transaction?.block.height),
            })}
          >
            {transaction?.block.height}
          </Link>
        )}
      </TableCell>

      <TableCell sx={{ minWidth: columnMap[ColumnIds.DATE]?.minWidth }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          time(transaction?.block.timestamp, { utc: true }).fromNow
        )}
      </TableCell>
      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.STATUS]?.minWidth }}
        align={columnMap[ColumnIds.STATUS].align}
      >
        {isLoading ? (
          <Skeleton sx={{ ml: 'auto' }} />
        ) : (
          <TransactionStatus status={transaction?.success} />
        )}
      </TableCell>
      <TableCell
        sx={{ minWidth: columnMap[ColumnIds.FEE]?.minWidth }}
        align={columnMap[ColumnIds.FEE].align}
      >
        {isLoading ? (
          <Skeleton sx={{ ml: 'auto' }} />
        ) : (
          formatCurrencyWithDenom(amount)
        )}
      </TableCell>
    </TableRow>
  )
}

export default TransactionListRow
