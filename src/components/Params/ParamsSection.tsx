import { duration } from '@distributedlab/tools'
import { Grid, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ContentBox, ContentSection, ParamsBox } from '@/components'
import {
  formatAmount,
  formatCurrencyWithDenom,
  formatNanoToMilliseconds,
  formatToPercent,
} from '@/helpers'
import { useLoading, useParams } from '@/hooks'
import {
  DepositParams,
  DistributionParamsType,
  GetParamsQuery,
  SlashingParamsType,
  StakingParamsType,
  TallyParams,
  VotingParams,
} from '@/types'

const ParamsSection = () => {
  const { t } = useTranslation()
  const { getParams } = useParams()
  const theme = useTheme()

  const { data, isLoading } = useLoading<GetParamsQuery>(
    {} as GetParamsQuery,
    () => getParams(),
  )
  const nanoToMillisecondsDuration = (value?: number) =>
    duration(formatNanoToMilliseconds(value ?? 0), 'ms').humanized
  const toPercent = (value?: number) => (value ?? 0) * 100
  const stakingParams = data?.stakingParams?.[0]?.params as StakingParamsType
  const slashingParams = data?.slashingParams?.[0]?.params as SlashingParamsType
  const distributionParams = data?.distributionParams?.[0]
    ?.params as DistributionParamsType
  const govParams = data?.govParams?.[0]
  const params = [
    {
      title: t('params.staking.lbl'),
      details: [
        {
          label: t('params.staking.bond-denom'),
          detail: stakingParams?.bond_denom ?? '',
        },
        {
          label: t('params.staking.unbonding-time'),
          detail: nanoToMillisecondsDuration(stakingParams?.unbonding_time),
        },
        {
          label: t('params.staking.max-entries'),
          detail: formatAmount(stakingParams?.max_entries, { decimals: 0 }),
        },
        {
          label: t('params.staking.historical-entries'),
          detail: formatAmount(stakingParams?.historical_entries, {
            decimals: 0,
          }),
        },
        {
          label: t('params.staking.max-validators'),
          detail: formatAmount(stakingParams?.max_validators, { decimals: 0 }),
        },
      ],
    },
    {
      title: t('params.slashing.lbl'),
      details: [
        {
          label: t('params.slashing.downtime-jail-duration'),
          detail: nanoToMillisecondsDuration(
            slashingParams?.downtime_jail_duration,
          ),
        },
        {
          label: t('params.slashing.min-signed-per-window'),
          detail: formatToPercent(
            toPercent(slashingParams?.min_signed_per_window),
          ),
        },
        {
          label: t('params.slashing.signed-block-window'),
          detail: formatAmount(slashingParams?.signed_blocks_window ?? 0, {
            decimals: 0,
          }),
        },
        {
          label: t('params.slashing.slash-fraction-double-sign'),
          detail: `${
            (slashingParams?.slash_fraction_double_sign ?? 0) * 100
          } / 100`,
        },
        {
          label: t('params.slashing.slash-fraction-downtime'),
          detail: `${
            (slashingParams?.slash_fraction_downtime ?? 0) * 10000
          } / ${formatAmount(10000, { decimals: 0 })}`,
        },
      ],
    },
    {
      title: t('params.distribution.lbl'),
      details: [
        {
          label: t('params.distribution.base-proposer-reward'),
          detail: formatToPercent(
            toPercent(distributionParams?.base_proposer_reward),
          ),
        },
        {
          label: t('params.distribution.bonus-proposer-reward'),
          detail: formatToPercent(
            toPercent(distributionParams?.bonus_proposer_reward),
          ),
        },
        {
          label: t('params.distribution.community-tax'),
          detail: formatToPercent(toPercent(distributionParams?.community_tax)),
        },
        {
          label: t('params.distribution.withdraw-address-enabled'),
          detail: String(
            distributionParams?.withdraw_addr_enabled ?? '',
          ).toUpperCase(),
        },
      ],
    },
    {
      title: t('params.gov.lbl'),
      details: [
        {
          label: t('params.gov.min-deposit'),
          detail: formatCurrencyWithDenom(
            (govParams?.depositParams as DepositParams)?.min_deposit?.[0]
              ?.amount,
            (govParams?.depositParams as DepositParams)?.min_deposit?.[0]
              ?.denom,
          ),
        },
        {
          label: t('params.gov.max-deposit-period'),
          detail: (govParams?.depositParams as DepositParams)
            ?.max_deposit_period,
        },
        {
          label: t('params.gov.quorum'),
          detail: formatToPercent(
            toPercent((govParams?.tallyParams as TallyParams)?.quorum),
          ),
        },
        {
          label: t('params.gov.threshold'),
          detail: formatToPercent(
            toPercent((govParams?.tallyParams as TallyParams)?.threshold),
          ),
        },
        {
          label: t('params.gov.veto-threshold'),
          detail: formatToPercent(
            toPercent((govParams?.tallyParams as TallyParams)?.veto_threshold),
          ),
        },
        {
          label: t('params.gov.voting-period'),
          detail: (govParams?.votingParams as VotingParams)?.voting_period,
        },
      ],
    },
  ]

  const itemProps = {
    sx: { flex: 1, minWidth: 0, height: '100%' },
  }

  return (
    <ContentSection withBackButton title={t('params.page-lbl')}>
      <Grid
        columnSpacing={{ md: theme.spacing(2) }}
        rowSpacing={theme.spacing(2)}
        container
        maxWidth={'100%'}
      >
        {params.map((item, idx) => (
          <Grid key={idx} item xs={12} md={6}>
            <ContentBox {...itemProps}>
              <ParamsBox {...item} isLoading={isLoading} />
            </ContentBox>
          </Grid>
        ))}
      </Grid>
    </ContentSection>
  )
}

export default ParamsSection
