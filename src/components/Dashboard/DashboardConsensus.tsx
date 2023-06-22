import { Box, Grid, Skeleton, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts'

import { AvatarName } from '@/components'
import { useConsensus, useLoading, useValidators } from '@/hooks'
import { GetValidatorByConsensusAddressQuery } from '@/types'

const DashboardConsensus = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { state } = useConsensus()
  const { getValidatorByConsensusAddress } = useValidators()

  const { data: validator } = useLoading<GetValidatorByConsensusAddressQuery>(
    {} as GetValidatorByConsensusAddressQuery,
    () => getValidatorByConsensusAddress(state.proposer as string),
    {
      loadArgs: [state.proposer],
    },
  )

  const accountAddress =
    validator?.validator?.[0]?.validator_info?.account?.address
  const validatorDescription =
    validator?.validator?.[0]?.validator_descriptions?.[0]

  const data = [
    {
      value: state.roundCompletion,
      fill: theme.palette.primary.main,
    },
  ]
  const circleSize = 200

  return (
    <>
      <Typography component={'h3'} variant={'h6'}>
        {t('dashboard-consensus.heading')}
      </Typography>
      <Grid container spacing={0} alignItems='center' justifyContent='center'>
        <Grid item xs={6}>
          <Typography variant='caption'>
            {t('dashboard-consensus.height-lbl')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='caption'>
            {t('dashboard-consensus.proposer-lbl')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={'button'}>
            {state.loadingNewRound ? (
              <Skeleton width={100} height={16} sx={{ marginTop: 0.5 }} />
            ) : (
              state.height
            )}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box marginTop={0.5}>
            {!state.loadingNewStep && accountAddress ? (
              <AvatarName
                address={accountAddress ?? ''}
                name={validatorDescription?.moniker || state.proposer}
                imageUrl={validatorDescription?.avatar_url ?? ''}
                imageSize={'18px'}
                fontSize={'12px'}
                padding={0.5}
              />
            ) : (
              <Box display='flex' alignItems='center' gap={0.5}>
                <Skeleton width={18} height={18} sx={{ borderRadius: '50%' }} />
                <Skeleton width={100} height={10} />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center' marginTop={2}>
          {state.loadingNewStep ? (
            <Skeleton
              width={circleSize}
              height={circleSize}
              sx={{
                borderRadius: '50%',
              }}
            />
          ) : (
            <RadialBarChart
              width={circleSize}
              height={circleSize}
              cx={circleSize / 2}
              cy={circleSize / 2}
              innerRadius={90}
              outerRadius={90}
              barSize={10}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type='number'
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey='value'
                cornerRadius={circleSize / 2}
              />
              <Tooltip />
              <text
                x={circleSize / 2}
                y={circleSize / 2}
                textAnchor='middle'
                dominantBaseline='middle'
              >
                <tspan
                  style={{
                    fontSize: '32px',
                    fill: 'var(--col-txt-primary-light)',
                  }}
                >
                  {t('dashboard-consensus.step-lbl', {
                    step: state.step,
                  })}
                </tspan>
              </text>
              <text x={circleSize / 2 - 32} y={circleSize / 2 + 35}>
                <tspan
                  style={{
                    fontSize: '16px',
                    fill: 'var(--col-txt-primary-light)',
                  }}
                >
                  {t('dashboard-consensus.round-lbl', {
                    round: state.round,
                  })}
                </tspan>
              </text>
            </RadialBarChart>
          )}
        </Grid>
      </Grid>
    </>
  )
}
export default DashboardConsensus
