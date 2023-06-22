import { time } from '@distributedlab/tools'
import { Chip, Link, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { generatePath, NavLink } from 'react-router-dom'

import {
  AvatarName,
  ContentBox,
  ContentWrapper,
  CopyToClipboardWrapper,
  OverviewTable,
  TransactionOverviewContentRow,
  TransactionStatus,
} from '@/components'
import { RoutePaths } from '@/enums'
import { addressFromPublicKey, formatCurrencyWithDenom } from '@/helpers'
import { useLocalize } from '@/hooks'
import { TransactionFragment } from '@/types'

type TransactionOverviewProps = {
  isLoading: boolean
  isLoadingError: boolean
  transaction: TransactionFragment
  isEmpty: boolean
}
const TransactionOverviewSection = ({
  isLoading,
  isLoadingError,
  transaction,
  isEmpty,
}: TransactionOverviewProps) => {
  const { t } = useTranslation()
  const { localizeMsgType } = useLocalize()

  const rows = [
    {
      head: t('transaction-overview-section.hash-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <CopyToClipboardWrapper value={transaction?.hash}>
          {transaction?.hash}
        </CopyToClipboardWrapper>
      ),
    },
    {
      head: t('transaction-overview-section.status-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <TransactionStatus status={transaction?.success} />
      ),
    },
    {
      head: t('transaction-overview-section.block-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Link
          component={NavLink}
          to={generatePath(RoutePaths.Block, {
            height: String(transaction?.height),
          })}
        >
          {transaction?.height}
        </Link>
      ),
    },
    {
      head: t('transaction-overview-section.age-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        time(transaction?.block.timestamp, { utc: true }).fromNow
      ),
    },
    {
      head: t('transaction-overview-section.sender-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <AvatarName
          address={
            addressFromPublicKey(
              transaction?.signer_infos?.[0]?.public_key ?? {},
            ) ?? ''
          }
        />
      ),
    },
    {
      head: t('transaction-overview-section.validator-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <AvatarName
          address={
            transaction?.block.validator?.validator_info?.operator_address ?? ''
          }
          name={
            transaction?.block.validator?.validator_descriptions?.[0]
              ?.moniker ?? ''
          }
          imageUrl={
            transaction?.block.validator?.validator_descriptions?.[0]
              ?.avatar_url ?? ''
          }
        />
      ),
    },
    {
      head: t('transaction-overview-section.gas-used-lbl'),
      body: isLoading ? <Skeleton width={'100%'} /> : transaction?.gas_used,
    },
    {
      head: t('transaction-overview-section.fee-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        formatCurrencyWithDenom(transaction?.fee.amount[0]?.amount)
      ),
    },
    {
      head: t('transaction-overview-section.operation-lbl'),
      body: isLoading ? (
        <Skeleton sx={{ ml: 'auto' }} />
      ) : (
        <Chip
          label={
            localizeMsgType(transaction?.messages?.[0]?.['@type']) ??
            t('message-types.unknown-lbl')
          }
        />
      ),
    },
  ]

  return (
    <ContentBox>
      <ContentWrapper>
        <OverviewTable
          label={t('proposal-overview-section.table-lbl')}
          noDataMessage={t('transaction-overview-section.no-data-message')}
          isEmpty={isEmpty}
          isLoadingError={isLoadingError}
          rows={rows}
          sx={{}}
        />
        <OverviewTable
          sx={{
            '& > tr:last-child td, & > tr:nth-last-of-type(-n + 3) td': {
              border: 0,
            },
          }}
        >
          <TransactionOverviewContentRow transaction={transaction} />
        </OverviewTable>
      </ContentWrapper>
    </ContentBox>
  )
}

export default TransactionOverviewSection
