import { CONFIG } from '@config'
import { BN } from '@distributedlab/tools'
import { InputAdornment, TextField } from '@mui/material'
import { useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'

import { FormWrapper } from '@/components'
import { DelegateTypes } from '@/enums'
import { ErrorHandler, handleTxResponse } from '@/helpers'
import { useForm, useWeb3 } from '@/hooks'
import { FormProps } from '@/types'
import { client } from '@/utils'

enum DelegateFormFieldNames {
  Validator = 'validator',
  Amount = 'amount',
}

const defaultValues = {
  [DelegateFormFieldNames.Amount]: '',
}

export type DelegateFormData = typeof defaultValues

const DelegateForm = ({
  id,
  onSubmit,
  setIsDialogDisabled,
  operator,
  minDelegationAmount,
  delegateType,
  reloadDelegation,
  maxUndelegationAmount,
}: FormProps & {
  operator?: string
  minDelegationAmount?: string
  delegateType: DelegateTypes
  maxUndelegationAmount?: string
  reloadDelegation: () => Promise<void>
}) => {
  const { address } = useWeb3()
  const { t } = useTranslation()

  const isDelegation = useMemo(
    () => delegateType === DelegateTypes.Delegate,
    [delegateType],
  )

  const {
    handleSubmit,
    formErrors,
    control,
    isFormDisabled,
    getErrorMessage,
    disableForm,
    enableForm,
  } = useForm(defaultValues, yup =>
    yup.object().shape(
      {
        [DelegateFormFieldNames.Amount]: yup
          .string()
          .required()
          .when(DelegateFormFieldNames.Amount, {
            is: () => isDelegation,
            then: rule =>
              rule.minNumber(
                BN.fromRaw(
                  String(minDelegationAmount),
                  CONFIG.DECIMALS,
                ).toString(),
              ),
          })
          .when(DelegateFormFieldNames.Amount, {
            is: () => !isDelegation,
            then: rule => rule.maxNumber(String(maxUndelegationAmount)),
          }),
      },
      [[DelegateFormFieldNames.Amount, DelegateFormFieldNames.Amount]],
    ),
  )

  const submit = async (formData: DelegateFormData) => {
    disableForm()
    setIsDialogDisabled(true)
    try {
      const txFn = isDelegation
        ? client.CosmosStakingV1Beta1.tx.sendMsgDelegate
        : client.CosmosStakingV1Beta1.tx.sendMsgUndelegate

      const res = await txFn({
        value: {
          delegatorAddress: address,
          validatorAddress: String(operator),
          amount: {
            denom: CONFIG.MINIMAL_DENOM,
            amount: BN.fromRaw(formData.amount, CONFIG.DECIMALS).toString(),
          },
        },
        fee: {
          amount: [{ denom: 'stake', amount: '200000' }],
          gas: '200000',
        },
      })

      handleTxResponse(res)

      const args = {
        amount: `${formData.amount} ${CONFIG.DENOM}`,
        address,
      }

      await reloadDelegation()
      await onSubmit({
        message: isDelegation
          ? t('validator-details-section.delegation-submitted-msg', args)
          : t('validator-details-section.undelegation-submitted-msg', args),
      })
    } catch (e) {
      ErrorHandler.process(e)
    }
    enableForm()
    setIsDialogDisabled(false)
  }

  return (
    <FormWrapper
      id={id}
      onSubmit={handleSubmit(submit)}
      isFormDisabled={isFormDisabled}
    >
      <Controller
        name={DelegateFormFieldNames.Amount}
        control={control}
        render={({ field: { onChange, onBlur, name, value, ref } }) => (
          <NumericFormat
            type='text'
            displayType='input'
            decimalScale={CONFIG.DECIMALS}
            name={name}
            value={value}
            allowNegative={false}
            customInput={TextField}
            inputRef={ref}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {CONFIG.DENOM.toUpperCase()}
                </InputAdornment>
              ),
            }}
            label={t('delegate-form.amount-lbl')}
            error={Boolean(formErrors[DelegateFormFieldNames.Amount])}
            disabled={isFormDisabled}
            onValueChange={values => onChange(values.floatValue)}
            onBlur={onBlur}
            helperText={getErrorMessage(
              formErrors[DelegateFormFieldNames.Amount],
            )}
          />
        )}
      />
    </FormWrapper>
  )
}

export default DelegateForm
