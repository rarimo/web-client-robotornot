import { Link, Skeleton } from '@mui/material'
import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AvatarName,
  CopyToClipboardWrapper,
  TableHeadCellWithTip,
  ValidatorCondition,
  ValidatorConditionTableHead,
  ValidatorStatus,
  ValidatorVotingPower,
} from '@/components'
import { DelegateTypes } from '@/enums'
import { formatToPercent } from '@/helpers'
import { useContentSectionAction, useValidatorStats } from '@/hooks'
import { SlashingParamsFragment, ValidatorFragment } from '@/types'

export const useValidatorDetailsSection = ({
  validator,
  slashingParams,
  isLoading,
  bondedTokens,
  reload,
}: {
  validator?: ValidatorFragment
  bondedTokens?: string
  slashingParams?: SlashingParamsFragment
  isLoading: boolean
  reload: () => Promise<void>
}) => {
  const [delegateType, setDelegateType] = useState<DelegateTypes>(
    DelegateTypes.Delegate,
  )

  const { t } = useTranslation()

  const {
    closeDialog,
    openDialog,
    setIsDisabled,
    onSubmit,
    isDisabled,
    isDialogOpened,
  } = useContentSectionAction(reload)

  const { condition, comission } = useValidatorStats({
    missedBlocksCounter:
      validator?.validator_signing_infos?.[0]?.missed_blocks_counter,
    signedBlocksWindow: slashingParams?.params?.signed_blocks_window,
    commission: validator?.validator_commissions?.[0]?.commission ?? 0,
  })

  const rows = [
    ...(validator?.validator_descriptions?.[0]?.moniker
      ? [
          {
            head: t('validator-details-section.validator-name-lbl'),
            body: isLoading ? (
              <Skeleton width={'100%'} />
            ) : (
              validator?.validator_descriptions?.[0]?.moniker
            ),
          },
        ]
      : []),
    ...(validator?.validator_descriptions?.[0]?.website
      ? [
          {
            head: t('validator-details-section.website-lbl'),
            body: isLoading ? (
              <Skeleton width={'100%'} />
            ) : (
              <Link
                sx={{ fontSize: 'inherit' }}
                href={validator?.validator_descriptions?.[0]?.website}
                rel={'noopener'}
                target={'_blank'}
              >
                {validator?.validator_descriptions?.[0]?.website}
              </Link>
            ),
          },
        ]
      : []),
    {
      head: t('validator-details-section.validator-operator-address-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <CopyToClipboardWrapper
          value={validator?.validator_info?.operator_address}
        >
          {validator?.validator_info?.operator_address}
        </CopyToClipboardWrapper>
      ),
    },
    {
      head: t('validator-details-section.validator-address-lbl'),
      body: isLoading ? (
        <Skeleton />
      ) : (
        <AvatarName
          address={validator?.validator_info?.account?.address ?? ''}
        />
      ),
    },
    {
      head: t('validator-details-section.status-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <ValidatorStatus
          status={
            (validator?.validator_statuses?.[0]?.status as BondStatus) ?? ''
          }
          jailed={validator?.validator_statuses?.[0]?.jailed ?? false}
        />
      ),
    },
    {
      head: t('validator-details-section.validator-consensus-address-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <CopyToClipboardWrapper value={validator?.consensus_address}>
          {validator?.consensus_address}
        </CopyToClipboardWrapper>
      ),
    },
    {
      head: t('validator-details-section.validator-consensus-pubkey-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <CopyToClipboardWrapper value={validator?.consensus_pubkey}>
          {validator?.consensus_pubkey}
        </CopyToClipboardWrapper>
      ),
    },
    {
      head: t('validator-details-section.commission-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        formatToPercent(comission)
      ),
    },
    {
      head: t('validator-details-section.missed-blocks-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        validator?.validator_signing_infos?.[0]?.missed_blocks_counter ?? 0
      ),
    },
    {
      head: (
        <ValidatorConditionTableHead
          align={'flex-start'}
          label={t('validator-details-section.condition-lbl')}
        />
      ),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <ValidatorCondition condition={condition} />
      ),
    },

    {
      head: (
        <TableHeadCellWithTip
          label={t('validator-details-section.voting-power-lbl')}
          align={'flex-start'}
          message={t('validator-details-section.voting-power-col-tip-lbl')}
        />
      ),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <ValidatorVotingPower
          votingPower={validator?.validator_voting_powers?.[0]?.voting_power}
          bondedTokens={bondedTokens}
          maxWidth={300}
        />
      ),
    },
  ]

  return {
    rows,
    delegateType,
    setDelegateType,
    closeDialog,
    openDialog,
    setIsDisabled,
    onSubmit,
    isDisabled,
    isDialogOpened,
  }
}
