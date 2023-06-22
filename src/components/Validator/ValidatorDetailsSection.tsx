import { CONFIG } from '@config'
import { Button, Stack } from '@mui/material'
import { V1Beta1QueryDelegationRewardsResponse } from '@rarimo/client/lib/cosmos.distribution.v1beta1/rest'
import { V1Beta1DelegationResponse } from '@rarimo/client/lib/cosmos.staking.v1beta1/rest'
import { useTranslation } from 'react-i18next'

import {
  ContentBox,
  ContentSection,
  ContentWrapper,
  DelegateForm,
  DialogFormWrapper,
  OverviewTable,
  Tooltip,
} from '@/components'
import { DelegateTypes } from '@/enums'
import { ErrorHandler, handleTxResponse } from '@/helpers'
import {
  useAccounts,
  useLoading,
  useValidatorDetailsSection,
  useValidators,
  useWeb3,
} from '@/hooks'
import { SlashingParamsFragment, ValidatorFragment } from '@/types'
import { client } from '@/utils'

type ValidatorDetailsSectionProps = {
  isLoading: boolean
  isLoadingError: boolean
  validator?: ValidatorFragment
  slashingParams?: SlashingParamsFragment
  bondedTokens?: string
  isEmpty: boolean
  reload: () => Promise<void>
}

const DELEGATE_FORM_ID = 'delegate-form'

const ValidatorDetailsSection = ({
  isLoading,
  isLoadingError,
  validator,
  slashingParams,
  bondedTokens,
  isEmpty,
  reload,
}: ValidatorDetailsSectionProps) => {
  const { t } = useTranslation()
  const { isConnected, address } = useWeb3()
  const { getAccountDelegations, getAccountRewardsValidator } = useAccounts()
  const { getValidatorCommissionAmount } = useValidators()

  const {
    rows,
    delegateType,
    setDelegateType,
    closeDialog,
    openDialog,
    setIsDisabled,
    onSubmit,
    isDisabled,
    isDialogOpened,
  } = useValidatorDetailsSection({
    validator,
    isLoading,
    slashingParams,
    bondedTokens,
    reload,
  })

  const {
    data: accountDelegations,
    isLoading: isDelegationLoading,
    isLoadingError: isDelegationLoadingError,
    isEmpty: isDelegationEmpty,
    reload: reloadDelegation,
  } = useLoading<V1Beta1DelegationResponse>(
    {} as V1Beta1DelegationResponse,
    () =>
      getAccountDelegations(
        validator?.validator_info?.operator_address ?? '',
        address,
      ),
    {
      loadOnMount: isConnected && !isEmpty,
      loadArgs: [address, validator?.validator_info?.operator_address],
    },
  )

  const {
    data: accountReward,
    isLoading: isRewardLoading,
    isLoadingError: isRewardLoadingError,
    isEmpty: isRewardEmpty,
    reload: reloadReward,
  } = useLoading<V1Beta1QueryDelegationRewardsResponse>(
    {} as V1Beta1QueryDelegationRewardsResponse,
    () =>
      getAccountRewardsValidator(
        validator?.validator_info?.operator_address ?? '',
        address,
      ),
    {
      loadOnMount: isConnected && !isEmpty,
      loadArgs: [address, validator?.validator_info?.operator_address],
    },
  )
  const isValidator = address === validator?.validator_info?.account?.address
  const getRewards = async () => {
    try {
      const res =
        await client.CosmosDistributionV1Beta1.tx.sendMsgWithdrawDelegatorReward(
          {
            value: {
              delegatorAddress: address,
              validatorAddress: String(
                validator?.validator_info?.operator_address,
              ),
            },
            fee: {
              amount: [{ denom: 'stake', amount: '200000' }],
              gas: '200000',
            },
          },
        )

      handleTxResponse(res)

      const args = {
        amount: `${accountReward?.rewards?.[0]?.amount} ${CONFIG.DENOM}`,
        address,
      }

      await reloadReward()
      await onSubmit({
        message: t('validator-details-section.reward-submitted-msg', args),
      })
    } catch (e) {
      ErrorHandler.process(e)
    }
  }

  const getValidatorCommission = async () => {
    const validatorAddress = String(validator?.validator_info?.operator_address)
    try {
      const validatorCommissionAmount = await getValidatorCommissionAmount({
        address: validatorAddress,
      })
      const res =
        await client.CosmosDistributionV1Beta1.tx.sendMsgWithdrawValidatorCommission(
          {
            value: {
              validatorAddress: validatorAddress,
            },
            fee: {
              amount: [{ denom: 'stake', amount: '200000' }],
              gas: '200000',
            },
          },
        )

      handleTxResponse(res)

      const args = {
        amount: `${validatorCommissionAmount} ${CONFIG.DENOM}`,
        address,
      }

      await onSubmit({
        message: t('validator-details-section.reward-submitted-msg', args),
      })
    } catch (e) {
      ErrorHandler.process(e)
    }
  }

  return (
    <ContentSection
      withBackButton
      title={t('validator-details-section.title')}
      action={
        <Tooltip
          message={t('validator-details-section.delegate-btn-tip-lbl')}
          sx={{
            minWidth: 'auto',
            textAlign: 'center',
          }}
          disabled={isConnected}
        >
          <span>
            <Stack flexDirection={'row'}>
              <Button
                onClick={() => {
                  setDelegateType(DelegateTypes.Delegate)
                  openDialog()
                }}
                disabled={
                  !isConnected ||
                  isDisabled ||
                  isDelegationLoading ||
                  isDelegationLoadingError
                }
              >
                {t('validator-details-section.delegate-btn')}
              </Button>
              {!isDelegationEmpty && (
                <Button
                  onClick={() => {
                    setDelegateType(DelegateTypes.Undelegate)
                    openDialog()
                  }}
                  sx={{ ml: 1 }}
                  variant={'outlined'}
                  disabled={
                    !isConnected ||
                    isDisabled ||
                    isDelegationLoading ||
                    isDelegationLoadingError
                  }
                >
                  {t('validator-details-section.undelegate-btn')}
                </Button>
              )}
              {!isRewardEmpty && (
                <Button
                  onClick={getRewards}
                  sx={{ ml: 1 }}
                  variant={'outlined'}
                  disabled={
                    !isConnected ||
                    isDisabled ||
                    isRewardLoading ||
                    isRewardLoadingError
                  }
                >
                  {t('validator-details-section.get-reward-btn')}
                </Button>
              )}
              {isValidator && (
                <Button
                  onClick={getValidatorCommission}
                  sx={{ ml: 1 }}
                  variant={'outlined'}
                  disabled={
                    !isConnected ||
                    isDisabled ||
                    isRewardLoading ||
                    isRewardLoadingError
                  }
                >
                  {t('validator-details-section.get-commission-btn')}
                </Button>
              )}
            </Stack>
          </span>
        </Tooltip>
      }
    >
      <ContentBox>
        <ContentWrapper>
          <OverviewTable
            label={t('validator-details-section.table-lbl')}
            noDataMessage={t('validator-details-section.no-data-message')}
            isEmpty={isEmpty}
            isLoadingError={isLoadingError}
            rows={rows}
          />
        </ContentWrapper>
      </ContentBox>
      <DialogFormWrapper
        formId={DELEGATE_FORM_ID}
        isDisabled={isDisabled}
        isDialogOpened={isDialogOpened}
        closeDialog={closeDialog}
        actionBtnText={t('common.submit-btn')}
        title={
          delegateType === DelegateTypes.Delegate
            ? t('validator-details-section.dialog-heading-delegate')
            : t('validator-details-section.dialog-heading-undelegate')
        }
      >
        <DelegateForm
          id={DELEGATE_FORM_ID}
          operator={validator?.validator_info?.operator_address ?? ''}
          minDelegationAmount={
            validator?.validator_commissions?.[0]?.min_self_delegation ?? ''
          }
          delegateType={delegateType}
          maxUndelegationAmount={accountDelegations?.balance?.amount}
          reloadDelegation={reloadDelegation}
          onSubmit={onSubmit}
          setIsDialogDisabled={setIsDisabled}
        />
      </DialogFormWrapper>
    </ContentSection>
  )
}

export default ValidatorDetailsSection
