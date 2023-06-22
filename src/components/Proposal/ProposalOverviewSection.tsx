import {
  Chip,
  Link,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, NavLink } from 'react-router-dom'

import {
  AvatarName,
  ContentBox,
  ContentWrapper,
  OverviewTable,
  ProposalOverviewContentRow,
  ProposalStatus,
} from '@/components'
import { PROPOSAL_TYPES_MAP } from '@/const'
import { RoutePaths } from '@/enums'
import { calculateTallyResults } from '@/helpers'
import { useLocalize } from '@/hooks'
import { ProposalFragment } from '@/types'

type IProposalOverviewProps = {
  isLoading: boolean
  isLoadingError: boolean
  proposal: ProposalFragment
}
const ProposalOverviewSection = ({
  isLoading,
  isLoadingError,
  proposal,
}: IProposalOverviewProps) => {
  const { t } = useTranslation()
  const { localizeProposalType } = useLocalize()
  const theme = useTheme()

  const isProposalExist = useMemo(() => !isEmpty(proposal), [proposal])

  const tallyResults = useMemo(
    () =>
      proposal?.proposal_tally_result
        ? calculateTallyResults(proposal.proposal_tally_result)
        : null,
    [proposal],
  )

  const tallyResultsStack = [
    {
      label: t('proposal-overview-section.tally-result-yes-lbl', {
        percent: tallyResults?.yes,
      }),
    },
    {
      label: t('proposal-overview-section.tally-result-abstain-lbl', {
        percent: tallyResults?.abstain,
      }),
    },
    {
      label: t('proposal-overview-section.tally-result-no-lbl', {
        percent: tallyResults?.no,
      }),
    },
    {
      label: t('proposal-overview-section.tally-result-no-with-veto-lbl', {
        percent: tallyResults?.no_with_veto,
      }),
    },
  ]

  const rows = [
    {
      head: t('proposal-overview-section.proposer-account-id-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <AvatarName address={proposal?.proposer_address ?? ''} />
      ),
    },
    {
      head: t('proposal-overview-section.type-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Chip
          label={localizeProposalType(
            PROPOSAL_TYPES_MAP[
              proposal?.proposal_type as keyof typeof PROPOSAL_TYPES_MAP
            ] ?? '',
          )}
        />
      ),
    },
    {
      head: t('proposal-overview-section.title-lbl'),
      body: isLoading ? <Skeleton /> : proposal?.title,
    },
    {
      head: t('proposal-overview-section.description-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Typography variant={'caption'}>{proposal?.description}</Typography>
      ),
    },
    {
      head: t('proposal-overview-section.status-lbl'),
      body: isLoading ? (
        <Skeleton>
          <ProposalStatus status={proposal?.status ?? ''} />
        </Skeleton>
      ) : (
        <ProposalStatus status={proposal?.status ?? ''} />
      ),
    },
    {
      head: t('proposal-overview-section.submit-block-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Link
          component={NavLink}
          to={generatePath(RoutePaths.Block, {
            height: String(proposal?.submit_block),
          })}
        >
          {proposal?.submit_block}
        </Link>
      ),
    },
    {
      head: t('proposal-overview-section.voting-start-block-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Link
          component={NavLink}
          to={generatePath(RoutePaths.Block, {
            height: String(proposal?.voting_start_block),
          })}
        >
          {proposal?.voting_start_block}
        </Link>
      ),
    },
    {
      head: t('proposal-overview-section.voting-end-block-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Link
          component={NavLink}
          to={generatePath(RoutePaths.Block, {
            height: String(proposal?.voting_end_block),
          })}
        >
          {proposal?.voting_end_block}
        </Link>
      ),
    },
    {
      head: t('proposal-overview-section.deposit-end-block-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <Link
          component={NavLink}
          to={generatePath(RoutePaths.Block, {
            height: String(proposal?.deposit_end_block),
          })}
        >
          {proposal?.deposit_end_block}
        </Link>
      ),
    },
    ...(tallyResults
      ? [
          {
            head: t('proposal-overview-section.tally-result-lbl'),
            body: (
              <Stack spacing={theme.spacing(1)}>
                {tallyResultsStack.map((item, idx) => (
                  <Typography variant={'caption'} key={idx}>
                    {item.label}
                  </Typography>
                ))}
              </Stack>
            ),
          },
        ]
      : []),
  ]

  return (
    <ContentBox>
      <ContentWrapper>
        <OverviewTable
          label={t('proposal-overview-section.table-lbl')}
          noDataMessage={t('proposal-overview-section.no-data-msg')}
          isEmpty={!isProposalExist}
          isLoadingError={isLoadingError}
          rows={rows}
          sx={{}}
        />
        <OverviewTable
          sx={{
            '& > tr:last-child td, & > tr:last-child th, & > tr:nth-last-of-type(-n + 2) td':
              {
                border: 0,
              },
          }}
        >
          <ProposalOverviewContentRow proposal={proposal} />
        </OverviewTable>
      </ContentWrapper>
    </ContentBox>
  )
}

export default ProposalOverviewSection
