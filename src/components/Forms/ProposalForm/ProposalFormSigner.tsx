import { TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ProposalFormData } from '@/components'
import { ProposalFormFieldNames, ProposalTypes } from '@/enums'
import { isAddSignerPartyProposal as _isAddSignerPartyProposal } from '@/helpers'
import { NestedFormProps } from '@/types'

function ProposalFormSigner({
  control,
  isFormDisabled,
  formErrors,
  getErrorMessage,
  proposalType,
}: NestedFormProps<ProposalFormData> & { proposalType: ProposalTypes }) {
  const { t } = useTranslation()

  const isAddSignerPartyProposal = _isAddSignerPartyProposal(proposalType)

  return (
    <>
      <Controller
        name={ProposalFormFieldNames.Account}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('proposal-form.account-lbl')}
            disabled={isFormDisabled}
            error={Boolean(formErrors[ProposalFormFieldNames.Account])}
            helperText={getErrorMessage(
              formErrors[ProposalFormFieldNames.Account],
            )}
          />
        )}
      />

      {isAddSignerPartyProposal && (
        <>
          <Controller
            name={ProposalFormFieldNames.Address}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('proposal-form.address-lbl')}
                disabled={isFormDisabled}
                error={Boolean(formErrors[ProposalFormFieldNames.Address])}
                helperText={getErrorMessage(
                  formErrors[ProposalFormFieldNames.Address],
                )}
              />
            )}
          />

          <Controller
            name={ProposalFormFieldNames.TrialPublicKey}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('proposal-form.trial-public-key-lbl')}
                disabled={isFormDisabled}
                error={Boolean(
                  formErrors[ProposalFormFieldNames.TrialPublicKey],
                )}
                helperText={getErrorMessage(
                  formErrors[ProposalFormFieldNames.TrialPublicKey],
                )}
              />
            )}
          />
        </>
      )}
    </>
  )
}

export default ProposalFormSigner
