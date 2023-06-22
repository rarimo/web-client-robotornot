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
import { ProposalFormFieldNames, ProposalTypes } from '@/enums'
import { useLoading, useProposals } from '@/hooks'
import { GetProposalCollectionQuery, NestedFormProps } from '@/types'

const INDEX_LABEL_ID = 'index-label-id'

function ProposalFormRemove({
  control,
  isFormDisabled,
  formErrors,
  getErrorMessage,
  proposalType,
}: NestedFormProps<ProposalFormData> & { proposalType: ProposalTypes }) {
  const { t } = useTranslation()

  const { getProposalCollection } = useProposals()

  const { data } = useLoading<GetProposalCollectionQuery>(
    { collection: [{ index: '' }] },
    () => getProposalCollection(),
  )
  const indexArr = data.collection

  const content =
    ProposalTypes.RemoveCollection === proposalType ? (
      <>
        <Controller
          name={ProposalFormFieldNames.Index}
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel
                id={INDEX_LABEL_ID}
                error={Boolean(formErrors[ProposalFormFieldNames.Index])}
              >
                {t('proposal-form.collection-lbl')}
              </InputLabel>
              <Select
                {...field}
                labelId={INDEX_LABEL_ID}
                label={t('proposal-form.collection-lbl')}
                disabled={isFormDisabled}
                error={Boolean(formErrors[ProposalFormFieldNames.Index])}
              >
                {indexArr.length ? (
                  indexArr.map((item, idx) => (
                    <MenuItem value={item.index} key={idx}>
                      {item.index}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={''} disabled>
                    {t('proposal-form.no-collection-lbl')}
                  </MenuItem>
                )}
              </Select>
              {Boolean(formErrors[ProposalFormFieldNames.Index]) && (
                <FormHelperText error>
                  {getErrorMessage(formErrors[ProposalFormFieldNames.Index])}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </>
    ) : (
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
              label={t('proposal-form.on-chain-address-lbl')}
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
      </>
    )

  return <>{content}</>
}

export default ProposalFormRemove
