import { CONFIG } from '@config'
import { Skeleton, Stack, Typography, useTheme } from '@mui/material'
import {
  DataTransferBoth,
  DbCheck,
  Svg3DSelectSolid,
  Timer,
} from 'iconoir-react'
import { useTranslation } from 'react-i18next'

import { ContentSection, DashboardStatisticRow } from '@/components'
import { formatCurrencyWithDenom, formatSeconds } from '@/helpers'
import { useInterval, useLoading, useStatistic } from '@/hooks'
import { GetStatisticQuery } from '@/types'

const DashboardStatistic = () => {
  const theme = useTheme()
  const { getStatisticData } = useStatistic()
  const { t } = useTranslation()

  const { data, isLoading, isLoadingError, update } =
    useLoading<GetStatisticQuery>({} as GetStatisticQuery, getStatisticData)

  useInterval(update, CONFIG.UPDATE_INTERVAL)

  const sx = {
    wordBreak: 'break-word',
  }

  const rows = [
    {
      left: {
        header: {
          title: (
            <Typography sx={sx} variant={'caption'}>
              {t('dashboard-statistic.height')}
            </Typography>
          ),
          body: isLoading ? (
            <Skeleton width={'100%'} />
          ) : (
            <Typography sx={sx} variant={'button'}>
              {data?.block?.[0]?.height}
            </Typography>
          ),
          icon: <Svg3DSelectSolid />,
        },
        footer: {
          title: (
            <Typography sx={sx} variant={'caption'}>
              {t('dashboard-statistic.transaction')}
            </Typography>
          ),
          body: isLoading ? (
            <Skeleton width={'100%'} />
          ) : (
            <Typography sx={sx} variant={'button'}>
              {data?.transaction_aggregate?.aggregate?.count}
            </Typography>
          ),
          icon: <DataTransferBoth />,
        },
      },
      right: {
        header: {
          title: (
            <Typography sx={sx} variant={'caption'}>
              {t('dashboard-statistic.supply')}
            </Typography>
          ),
          body: isLoading ? (
            <Skeleton width={'100%'} />
          ) : (
            <Typography sx={sx} variant={'button'}>
              {formatCurrencyWithDenom(data?.supply?.[0]?.coins?.[0]?.amount)}
            </Typography>
          ),
          icon: <DbCheck />,
        },
        footer: {
          title: (
            <Typography sx={sx} variant={'caption'}>
              {t('dashboard-statistic.average-block-time')}
            </Typography>
          ),
          body: isLoading ? (
            <Skeleton width={'100%'} />
          ) : (
            <Typography sx={sx} variant={'button'}>
              {formatSeconds(data?.averageBlockTime?.[0]?.averageTime || 0)}
            </Typography>
          ),
          icon: <Timer />,
        },
      },
    },
  ]
  return (
    <ContentSection>
      <Stack spacing={theme.spacing(2)} direction={{ xs: 'column', md: 'row' }}>
        {!isLoadingError &&
          rows.map(({ left, right }, index) => (
            <Stack
              direction={'row'}
              spacing={theme.spacing(2)}
              justifyContent={'space-between'}
              flex={'1'}
              key={index}
            >
              <DashboardStatisticRow
                header={left.header}
                footer={left.footer}
              />
              <DashboardStatisticRow
                header={right.header}
                footer={right.footer}
              />
            </Stack>
          ))}
      </Stack>
    </ContentSection>
  )
}
export default DashboardStatistic
