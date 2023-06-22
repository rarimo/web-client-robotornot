import { CONFIG } from '@config'
import { BN } from '@distributedlab/tools'
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NumberFormatValues, NumericFormat } from 'react-number-format'

import {
  FormWrapper,
  ProposalFormCollection,
  ProposalFormNetwork,
  ProposalFormRemove,
  ProposalFormSigner,
} from '@/components'
import { NetworkType, ProposalFormFieldNames, ProposalTypes } from '@/enums'
import {
  createSubmitProposal,
  ErrorHandler,
  formatFormData,
  formatMaxDepositValue,
  handleTxResponse,
  isProposalType,
} from '@/helpers'
import {
  useAccounts,
  useForm,
  useLocalize,
  useProposals,
  useWeb3,
} from '@/hooks'
import { FormProps, resultProposalFormData } from '@/types'
import { client } from '@/utils'

import { createProposalFormValidation } from './validation'

const PROPOSAL_TYPE_LABEL_ID = 'proposal-type-label'

const defaultValues = {
  [ProposalFormFieldNames.Title]: '',
  [ProposalFormFieldNames.Description]: '',
  [ProposalFormFieldNames.Type]: ProposalTypes.AddSignerParty,
  [ProposalFormFieldNames.Deposit]: '',
  [ProposalFormFieldNames.Account]: '',
  [ProposalFormFieldNames.Address]: '',
  [ProposalFormFieldNames.TrialPublicKey]: '',
  [ProposalFormFieldNames.NetworkParamsName]: '',
  [ProposalFormFieldNames.NetworkParamsContract]: '',
  [ProposalFormFieldNames.NetworkParamsNetworkType]: NetworkType.EVM,
  [ProposalFormFieldNames.Index]: '',
  [ProposalFormFieldNames.Chain]: '',
  [ProposalFormFieldNames.CollectionDataIndexAddress]: '',
  [ProposalFormFieldNames.MetaDataName]: '',
  [ProposalFormFieldNames.MetaSymbol]: '',
  [ProposalFormFieldNames.MetadataURI]: '',
  [ProposalFormFieldNames.Collection]: '',
  [ProposalFormFieldNames.TokenType]: '',
  [ProposalFormFieldNames.Wrapped]: 1,
  [ProposalFormFieldNames.Decimals]: '',
  [ProposalFormFieldNames.Chain]: '',
  [ProposalFormFieldNames.CollectionDataIndexAddress]: '',
  [ProposalFormFieldNames.Data]: {},
}

export type ProposalFormData = typeof defaultValues

const ProposalForm = ({ id, onSubmit, setIsDialogDisabled }: FormProps) => {
  const { getDepositMinAmount } = useProposals()
  const { t } = useTranslation()
  const { localizeProposalType } = useLocalize()
  const [minDepositValue, setMinDepositValue] = useState('')
  const [maxDepositValue, setMaxDepositValue] = useState('')
  const { address, handleWalletConnection } = useWeb3()
  const { getAccountBalanceByAddress } = useAccounts()

  useEffect(() => {
    async function getDepositMinValue() {
      try {
        const val = await getDepositMinAmount()
        if (!val) return
        setMinDepositValue(String(val))
      } catch (e) {
        ErrorHandler.process(e)
      }
    }
    async function getDepositMaxValue() {
      try {
        const val = await getAccountBalanceByAddress(address)
        if (!val?.amount) return
        const value = BN.fromBigInt(val.amount, CONFIG.DECIMALS)
          .sub(BN.fromBigInt(CONFIG.FEE_AMOUNT, CONFIG.DECIMALS))
          .add(BN.fromBigInt(CONFIG.GAS_AMOUNT, CONFIG.DECIMALS))
          .toFraction(CONFIG.DECIMALS)
          .toString()
        setMaxDepositValue(String(formatMaxDepositValue(value)))
      } catch (e) {
        ErrorHandler.process(e)
      }
    }
    getDepositMaxValue()
    getDepositMinValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    handleSubmit,
    formErrors,
    formState,
    control,
    isFormDisabled,
    getErrorMessage,
    disableForm,
    enableForm,
  } = useForm(defaultValues, createProposalFormValidation(minDepositValue))

  const submit = async (formData: ProposalFormData) => {
    disableForm()
    const resultFormData = formatFormData(formData)
    setIsDialogDisabled(true)
    try {
      await handleWalletConnection()
      const res = await client.CosmosGovV1Beta1.tx.sendMsgSubmitProposal({
        value: createSubmitProposal(
          resultFormData as resultProposalFormData,
          address,
        ),
        fee: {
          amount: [{ denom: 'stake', amount: String(CONFIG.FEE_AMOUNT) }],
          gas: String(CONFIG.GAS_AMOUNT),
        },
      })

      handleTxResponse(res)

      await onSubmit({
        message: t('proposal-section.proposal-created-msg', {
          name: localizeProposalType(formData[ProposalFormFieldNames.Type]),
        }),
      })
    } catch (e) {
      ErrorHandler.process(e)
    }
    enableForm()
    setIsDialogDisabled(false)
  }

  const proposalTypes = Object.values(ProposalTypes).filter(i =>
    isProposalType(i as ProposalTypes | undefined),
  )
  const getTypeRelatedFormContent = (type: ProposalTypes): JSX.Element => {
    switch (type) {
      case ProposalTypes.AddSignerParty:
      case ProposalTypes.RemoveSignerParty:
        return (
          <ProposalFormSigner
            control={control}
            proposalType={type}
            isFormDisabled={isFormDisabled}
            formErrors={formErrors}
            getErrorMessage={getErrorMessage}
          />
        )
      case ProposalTypes.SetNetwork:
        return (
          <ProposalFormNetwork
            control={control}
            isFormDisabled={isFormDisabled}
            formErrors={formErrors}
            getErrorMessage={getErrorMessage}
          />
        )
      case ProposalTypes.CreateCollection:
      case ProposalTypes.UpdateCollectionData:
      case ProposalTypes.AddCollectionData:
        return (
          <ProposalFormCollection
            control={control}
            proposalType={type}
            isFormDisabled={isFormDisabled}
            formErrors={formErrors}
            getErrorMessage={getErrorMessage}
          />
        )
      case ProposalTypes.RemoveCollection:
      case ProposalTypes.RemoveCollectionData:
        return (
          <ProposalFormRemove
            control={control}
            proposalType={type}
            isFormDisabled={isFormDisabled}
            formErrors={formErrors}
            getErrorMessage={getErrorMessage}
          />
        )
      default:
        return <></>
    }
  }
  const formContent = getTypeRelatedFormContent(
    formState[ProposalFormFieldNames.Type],
  )
  const changeDeposit = (
    values: NumberFormatValues,
    onChange: (...event: (number | string)[]) => void,
  ): void => {
    if ((values.floatValue ?? 0) > Number(maxDepositValue)) {
      return onChange(maxDepositValue)
    }
    return onChange(values.floatValue ?? 0)
  }

  return (
    <FormWrapper
      id={id}
      onSubmit={handleSubmit(submit)}
      isFormDisabled={isFormDisabled}
    >
      <Controller
        name={ProposalFormFieldNames.Title}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('proposal-form.title-proposal-lbl')}
            disabled={isFormDisabled}
            error={Boolean(formErrors[ProposalFormFieldNames.Title])}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.Title],
            )}
          />
        )}
      />
      <Controller
        name={ProposalFormFieldNames.Description}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            multiline
            rows={4}
            label={t('proposal-form.description-lbl')}
            disabled={isFormDisabled}
            error={Boolean(formErrors[ProposalFormFieldNames.Description])}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.Description],
            )}
          />
        )}
      />
      <Controller
        name={ProposalFormFieldNames.Deposit}
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
            label={t('proposal-form.deposit-lbl')}
            error={Boolean(formErrors[ProposalFormFieldNames.Deposit])}
            disabled={isFormDisabled}
            onValueChange={values => changeDeposit(values, onChange)}
            onBlur={onBlur}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.Deposit],
            )}
          />
        )}
      />
      <Controller
        name={ProposalFormFieldNames.Type}
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel
              id={PROPOSAL_TYPE_LABEL_ID}
              error={Boolean(formErrors[ProposalFormFieldNames.Type])}
            >
              {t('proposal-form.type-proposal-lbl')}
            </InputLabel>
            <Select
              {...field}
              labelId={PROPOSAL_TYPE_LABEL_ID}
              label={t('proposal-form.type-proposal-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.Type])}
            >
              {proposalTypes.map((type, idx) => (
                <MenuItem value={type} key={idx}>
                  {localizeProposalType(type as ProposalTypes)}
                </MenuItem>
              ))}
            </Select>
            {Boolean(formErrors[ProposalFormFieldNames.Type]) && (
              <FormHelperText error>
                {getErrorMessage(formErrors[ProposalFormFieldNames.Type])}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
      {formContent}
    </FormWrapper>
  )
}

export default ProposalForm
