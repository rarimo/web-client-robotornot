import { useTranslation } from 'react-i18next'

import { BlocksList, ContentBox, ContentSection } from '@/components'
import { useBlocks, useLoading, useTablePagination } from '@/hooks'
import { BlockListFragment } from '@/types'

const BlocksSection = () => {
  const { t } = useTranslation()
  const { getBlocksList, getBlockCount } = useBlocks()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: blocksCount,
    isLoading: isLoadingBlockCount,
    isLoadingError: isLoadingBlockCountError,
  } = useLoading<number>(0, getBlockCount)

  const { data, isLoading, isLoadingError } = useLoading<BlockListFragment[]>(
    [],
    () => getBlocksList({ limit, offset }),
    { loadArgs: [limit, offset] },
  )

  return (
    <ContentSection withBackButton title={t('block-list.table-lbl')}>
      <ContentBox>
        <BlocksList
          limit={limit}
          offset={offset}
          list={data}
          count={blocksCount}
          isLoading={isLoading || isLoadingBlockCount}
          isLoadingError={isLoadingError || isLoadingBlockCountError}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </ContentBox>
    </ContentSection>
  )
}

export default BlocksSection
