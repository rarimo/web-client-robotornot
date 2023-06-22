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

import { ProposalFormCollectionData, ProposalFormData } from '@/components'
import { ProposalFormFieldNames, ProposalTypes } from '@/enums'
import { useLoading, useProposals } from '@/hooks'
import { GetProposalCollectionQuery, NestedFormProps } from '@/types'

const COLLECTION_LABEL_ID = 'collection-label-id'

function ProposalFormCollection({
  proposalType,
  control,
  isFormDisabled,
  formErrors,
  getErrorMessage,
}: NestedFormProps<ProposalFormData> & { proposalType: ProposalTypes }) {
  const { t } = useTranslation()
  const { getProposalCollection } = useProposals()

  const { data } = useLoading<GetProposalCollectionQuery>(
    { collection: [{ index: '' }] },
    () => getProposalCollection(),
  )
  const collectionArr = data.collection

  const content =
    proposalType === ProposalTypes.CreateCollection ? (
      <>
        <Controller
          name={ProposalFormFieldNames.MetaDataName}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('proposal-form.collection-name-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.MetaDataName])}
              helperText={getErrorMessage(
                formErrors[ProposalFormFieldNames.MetaDataName],
              )}
            />
          )}
        />
        <Controller
          name={ProposalFormFieldNames.MetaSymbol}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('proposal-form.symbol-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.MetaSymbol])}
              helperText={getErrorMessage(
                formErrors[ProposalFormFieldNames.MetaSymbol],
              )}
            />
          )}
        />
        <Controller
          name={ProposalFormFieldNames.MetadataURI}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('proposal-form.uri-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.MetadataURI])}
              helperText={getErrorMessage(
                formErrors[ProposalFormFieldNames.MetadataURI],
              )}
            />
          )}
        />
      </>
    ) : (
      <Controller
        name={ProposalFormFieldNames.Collection}
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel
              id={COLLECTION_LABEL_ID}
              error={Boolean(formErrors[ProposalFormFieldNames.Collection])}
            >
              {t('proposal-form.collection-lbl')}
            </InputLabel>
            <Select
              {...field}
              labelId={COLLECTION_LABEL_ID}
              label={t('proposal-form.collection-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[ProposalFormFieldNames.Collection])}
            >
              {collectionArr.length ? (
                collectionArr.map((item, idx) => (
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
            {Boolean(formErrors[ProposalFormFieldNames.Collection]) && (
              <FormHelperText error>
                {getErrorMessage(formErrors[ProposalFormFieldNames.Collection])}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    )

  return (
    <>
      <ProposalFormCollectionData
        control={control}
        isFormDisabled={isFormDisabled}
        formErrors={formErrors}
        getErrorMessage={getErrorMessage}
      />
      {content}
    </>
  )
}

export default ProposalFormCollection
