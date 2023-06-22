import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ProposalFormData } from '@/components'
import { ProposalFormFieldNames, TokenType } from '@/enums'
import { useLocalize } from '@/hooks'
import { NestedFormProps } from '@/types'
const WRAPPED_TYPE_LABEL_ID = 'wrapped-type-label'
const TOKEN_TYPE_LABEL_ID = 'token-type-label'

const tokenTypeArr = Object.values(TokenType).filter(
  i => Number.isInteger(i) && i !== TokenType.UNRECOGNIZED,
)

function ProposalFormCollectionData({
  control,
  isFormDisabled,
  formErrors,
  getErrorMessage,
}: NestedFormProps<ProposalFormData>) {
  enum wrappedArrValue {
    No,
    Yes,
  }
  const { t } = useTranslation()
  const { localizeTokenType } = useLocalize()
  const wrappedArr = [
    { label: t('proposal-form.yes-option-lbl'), value: wrappedArrValue.Yes },
    { label: t('proposal-form.no-option-lbl'), value: wrappedArrValue.No },
  ]

  return (
    <>
      <Controller
        name={ProposalFormFieldNames.Chain}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('proposal-form.chain-lbl')}
            disabled={isFormDisabled}
            error={Boolean(formErrors[ProposalFormFieldNames.Chain])}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.Chain],
            )}
          />
        )}
      />
      <Controller
        name={ProposalFormFieldNames.CollectionDataIndexAddress}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('proposal-form.contract-address-lbl')}
            disabled={isFormDisabled}
            error={Boolean(
              formErrors[ProposalFormFieldNames.CollectionDataIndexAddress],
            )}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.CollectionDataIndexAddress],
            )}
          />
        )}
      />
      <Controller
        name={ProposalFormFieldNames.Decimals}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('proposal-form.decimals-lbl')}
            disabled={isFormDisabled}
            error={Boolean(formErrors[ProposalFormFieldNames.Decimals])}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.Decimals],
            )}
          />
        )}
      />
      <Controller
        name={ProposalFormFieldNames.Wrapped}
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel
              id={WRAPPED_TYPE_LABEL_ID}
              error={Boolean(formErrors[ProposalFormFieldNames.Wrapped])}
            >
              {t('proposal-form.wrapped-lbl')}
            </InputLabel>
            <Select
              {...field}
              labelId={TOKEN_TYPE_LABEL_ID}
              label={t('proposal-form.wrapped-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.Wrapped])}
            >
              {wrappedArr.map((item, idx) => (
                <MenuItem value={item.value} key={idx}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {Boolean(formErrors[ProposalFormFieldNames.Wrapped]) && (
              <FormHelperText error>
                {getErrorMessage(formErrors[ProposalFormFieldNames.Wrapped])}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
      <Controller
        name={ProposalFormFieldNames.TokenType}
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel
              id={TOKEN_TYPE_LABEL_ID}
              error={Boolean(formErrors[ProposalFormFieldNames.TokenType])}
            >
              {t('proposal-form.type-proposal-lbl')}
            </InputLabel>
            <Select
              {...field}
              labelId={TOKEN_TYPE_LABEL_ID}
              label={t('proposal-form.type-proposal-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.TokenType])}
            >
              {tokenTypeArr.map((type, idx) => (
                <MenuItem value={type} key={idx}>
                  {localizeTokenType(type as TokenType)}
                </MenuItem>
              ))}
            </Select>
            {Boolean(formErrors[ProposalFormFieldNames.TokenType]) && (
              <FormHelperText error>
                {getErrorMessage(formErrors[ProposalFormFieldNames.TokenType])}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </>
  )
}

export default ProposalFormCollectionData
