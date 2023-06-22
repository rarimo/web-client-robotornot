import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { BlockOverviewSection, ContentSection } from '@/components'
import { useBlocks, useLoading } from '@/hooks'
import { BlockFragment } from '@/types'

const BlockDetailsSection = () => {
  const { t } = useTranslation()
  const { height } = useParams()
  const { getBlockByHeight } = useBlocks()

  const {
    data: block,
    isLoading,
    isLoadingError,
    isEmpty,
  } = useLoading<BlockFragment>({} as BlockFragment, () =>
    getBlockByHeight(Number(height)),
  )
  return (
    <ContentSection withBackButton title={t('block-details.title')}>
      <BlockOverviewSection
        isLoading={isLoading}
        isLoadingError={isLoadingError}
        block={block}
        isEmpty={isEmpty}
      />
    </ContentSection>
  )
}

export default BlockDetailsSection
