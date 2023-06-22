import { CONFIG } from '@config'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {
  ProposalStatus,
  proposalStatusFromJSON,
  VoteOption,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/types/cosmos/gov/v1beta1/gov'
import { omit } from 'lodash-es'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormWrapper } from '@/components'
import { Bus, createVote, ErrorHandler, handleTxResponse } from '@/helpers'
import { useForm, useLocalize, useWeb3 } from '@/hooks'
import { FormProps } from '@/types'
import { client } from '@/utils'

const VOTE_OPTION_LABEL_ID = 'vote-option-label'

enum VOTE_FORM_FIELD_NAMES {
  Option = 'option',
}

const defaultValues = {
  [VOTE_FORM_FIELD_NAMES.Option]: VoteOption.VOTE_OPTION_YES,
}

export type VoteFormData = typeof defaultValues

const VoteForm = ({
  id,
  onSubmit,
  setIsDialogDisabled,
  proposalId,
}: FormProps & { proposalId: number }) => {
  const { t } = useTranslation()
  const { address } = useWeb3()
  const { localizeProposalVoteOption } = useLocalize()

  const {
    handleSubmit,
    formErrors,
    control,
    isFormDisabled,
    getErrorMessage,
    disableForm,
    enableForm,
  } = useForm(defaultValues, yup =>
    yup.object({
      [VOTE_FORM_FIELD_NAMES.Option]: yup.number().required(),
    }),
  )

  const submit = async (formData: VoteFormData) => {
    disableForm()
    setIsDialogDisabled(true)
    try {
      const proposalRes = await client.CosmosGovV1Beta1.query.queryProposal(
        String(proposalId),
      )
      const enumStatus = proposalStatusFromJSON(
        proposalRes?.data?.proposal?.status,
      )
      if (enumStatus !== ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD) {
        Bus.error(t('proposal-votes-section.voting-time-expired-error'))
        enableForm()
        setIsDialogDisabled(false)
        return
      }
      const res = await client.CosmosGovV1Beta1.tx.sendMsgVote({
        value: createVote(formData, proposalId, address),
        fee: {
          amount: [{ denom: CONFIG.DENOM, amount: '200000' }],
          gas: '200000',
        },
      })

      handleTxResponse(res)

      await onSubmit({
        message: t('proposal-details.proposal-vote-submitted-msg', {
          id: proposalId,
        }),
      })
    } catch (e) {
      ErrorHandler.process(e)
    }
    enableForm()
    setIsDialogDisabled(false)
  }

  const voteOptions = omit(
    VoteOption,
    'VOTE_OPTION_UNSPECIFIED',
    'UNRECOGNIZED',
  )

  return (
    <FormWrapper
      id={id}
      onSubmit={handleSubmit(submit)}
      isFormDisabled={isFormDisabled}
    >
      <Controller
        name={VOTE_FORM_FIELD_NAMES.Option}
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel
              id={VOTE_OPTION_LABEL_ID}
              error={Boolean(formErrors[VOTE_FORM_FIELD_NAMES.Option])}
            >
              {t('vote-form.option-lbl')}
            </InputLabel>
            <Select
              {...field}
              labelId={VOTE_OPTION_LABEL_ID}
              label={t('vote-form.option-lbl')}
              disabled={isFormDisabled}
              error={Boolean(formErrors[VOTE_FORM_FIELD_NAMES.Option])}
            >
              {Object.values(voteOptions)
                .filter(i => Number.isInteger(i))
                .map((type, idx) => (
                  <MenuItem value={type} key={idx}>
                    {localizeProposalVoteOption(type as VoteOption)}
                  </MenuItem>
                ))}
            </Select>
            {Boolean(formErrors[VOTE_FORM_FIELD_NAMES.Option]) && (
              <FormHelperText error>
                {getErrorMessage(formErrors[VOTE_FORM_FIELD_NAMES.Option])}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </FormWrapper>
  )
}

export default VoteForm
