import { time } from '@distributedlab/tools'
import { Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  AvatarName,
  ContentBox,
  ContentWrapper,
  CopyToClipboardWrapper,
  OverviewTable,
} from '@/components'
import { BlockFragment } from '@/types'

type IBlockOverviewProps = {
  isLoading: boolean
  isLoadingError: boolean
  block: BlockFragment
  isEmpty: boolean
}
const BlockOverviewSection = ({
  isLoading,
  isLoadingError,
  block,
  isEmpty,
}: IBlockOverviewProps) => {
  const { t } = useTranslation()

  const rows = [
    {
      head: t('block-overview-section.height-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <CopyToClipboardWrapper value={block?.height}>
          {block?.height}
        </CopyToClipboardWrapper>
      ),
    },
    {
      head: t('block-overview-section.age-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        time(block?.timestamp, { utc: true }).fromNow
      ),
    },
    {
      head: t('block-overview-section.hash-lbl'),
      body: isLoading ? <Skeleton /> : block?.hash,
    },
    {
      head: t('block-overview-section.validator-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <AvatarName
          address={block.validator?.validator_info?.operator_address ?? ''}
          name={block.validator?.validator_descriptions?.[0]?.moniker ?? ''}
          imageUrl={
            block.validator?.validator_descriptions?.[0]?.avatar_url ?? ''
          }
        />
      ),
    },
    {
      head: t('block-overview-section.gas-total-lbl'),
      body: isLoading ? <Skeleton width={'100%'} /> : block?.total_gas,
    },
    {
      head: t('block-overview-section.tnx-lbl'),
      body: isLoading ? <Skeleton width={'100%'} /> : block?.num_txs,
    },
  ]

  return (
    <ContentBox>
      <ContentWrapper>
        <OverviewTable
          label={t('block-overview-section.table-lbl')}
          noDataMessage={t('block-overview-section.no-data-message')}
          isEmpty={isEmpty}
          isLoadingError={isLoadingError}
          rows={rows}
        />
      </ContentWrapper>
    </ContentBox>
  )
}

export default BlockOverviewSection
