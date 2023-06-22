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

import { ProposalFormData, TableHeadCellWithTip } from '@/components'
import { NetworkType, ProposalFormFieldNames } from '@/enums'
import { useLocalize } from '@/hooks'
import { NestedFormProps } from '@/types'

const NETWORK_TYPE_LABEL_ID = 'network-type-label'

function ProposalFormNetwork({
  control,
  isFormDisabled,
  formErrors,
  getErrorMessage,
}: NestedFormProps<ProposalFormData>) {
  const { t } = useTranslation()
  const { localizeNetworkType } = useLocalize()
  const networkTypeArr = Object.values(NetworkType).filter(
    i => Number.isInteger(i) && i !== NetworkType.UNRECOGNIZED,
  )

  return (
    <>
      <Controller
        name={ProposalFormFieldNames.NetworkParamsName}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('proposal-form.network-name-lbl')}
            disabled={isFormDisabled}
            error={Boolean(
              formErrors[ProposalFormFieldNames.NetworkParamsName],
            )}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.NetworkParamsName],
            )}
          />
        )}
      />

      <>
        <Controller
          name={ProposalFormFieldNames.NetworkParamsContract}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('proposal-form.network-contract-lbl')}
              disabled={isFormDisabled}
              error={Boolean(
                formErrors[ProposalFormFieldNames.NetworkParamsContract],
              )}
              helperText={getErrorMessage(
                formErrors[ProposalFormFieldNames.NetworkParamsContract],
              )}
              InputProps={{
                endAdornment: (
                  <TableHeadCellWithTip
                    label={''}
                    align={'flex-start'}
                    message={t('proposal-form.network-contract-tip-lbl')}
                  />
                ),
              }}
            />
          )}
        />

        <Controller
          name={ProposalFormFieldNames.NetworkParamsNetworkType}
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel
                id={NETWORK_TYPE_LABEL_ID}
                error={Boolean(
                  formErrors[ProposalFormFieldNames.NetworkParamsNetworkType],
                )}
              >
                {t('proposal-form.type-proposal-lbl')}
              </InputLabel>
              <Select
                {...field}
                labelId={NETWORK_TYPE_LABEL_ID}
                label={t('proposal-form.type-proposal-lbl')}
                disabled={isFormDisabled}
                error={Boolean(
                  formErrors[ProposalFormFieldNames.NetworkParamsNetworkType],
                )}
              >
                {networkTypeArr.map((type, idx) => (
                  <MenuItem value={type} key={idx}>
                    {localizeNetworkType(type as NetworkType)}
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
      </>
    </>
  )
}

export default ProposalFormNetwork
