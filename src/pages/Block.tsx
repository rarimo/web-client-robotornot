import { useParams } from 'react-router-dom'

import {
  BlockDetailsSection,
  BlockTransactionsSection,
  PageContainer,
} from '@/components'
import { useBlocks, useLoading } from '@/hooks'
import { BlockFragment } from '@/types'

const Block = () => {
  const { getBlockByHeight } = useBlocks()
  const { height } = useParams()

  const { data, isLoading, isLoadingError } = useLoading<BlockFragment>(
    {} as BlockFragment,
    () => getBlockByHeight(Number(height)),
  )
  return (
    <PageContainer>
      <BlockDetailsSection />
      <BlockTransactionsSection
        isBlockLoading={isLoading}
        amountTX={Number(data?.num_txs ?? 0)}
        isBlockLoadingError={isLoadingError}
        blockHeight={Number(height)}
      />
    </PageContainer>
  )
}
export default Block
