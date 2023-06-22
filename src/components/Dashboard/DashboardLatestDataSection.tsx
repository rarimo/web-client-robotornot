import { CONFIG } from '@config'
import { Stack, useTheme } from '@mui/material'

import {
  ContentBox,
  ContentSection,
  DashboardLatestBlocks,
  DashboardLatestTransactions,
} from '@/components'
import { useInterval, useLoading, useTransactions } from '@/hooks'
import { GetTransactionBaseQuery } from '@/types'

const ROW_LIMIT = 5

const DashboardLatestDataSection = () => {
  const { getLatestTxAndBlocks } = useTransactions()
  const theme = useTheme()

  const {
    data: { transaction, block },
    isLoading,
    isLoadingError,
    update,
  } = useLoading<GetTransactionBaseQuery>({ transaction: [], block: [] }, () =>
    getLatestTxAndBlocks(ROW_LIMIT),
  )

  useInterval(update, CONFIG.UPDATE_INTERVAL)

  const itemProps = { sx: { flex: 1, minWidth: 0 } }

  return (
    <ContentSection>
      <Stack spacing={theme.spacing(2)} direction={{ xs: 'column', md: 'row' }}>
        <ContentBox {...itemProps}>
          <DashboardLatestTransactions
            isLoadingError={isLoadingError}
            isLoading={isLoading}
            transactionList={transaction}
            limitRow={ROW_LIMIT}
          />
        </ContentBox>
        <ContentBox {...itemProps}>
          <DashboardLatestBlocks
            isLoadingError={isLoadingError}
            isLoading={isLoading}
            blockList={block}
            limitRow={ROW_LIMIT}
          />
        </ContentBox>
      </Stack>
    </ContentSection>
  )
}
export default DashboardLatestDataSection
