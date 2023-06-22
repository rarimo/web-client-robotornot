import { Button } from '@mui/material'
import {
  ProposalStatus,
  proposalStatusFromJSON,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/types/cosmos/gov/v1beta1/gov'
import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {
  ContentSection,
  DialogFormWrapper,
  ProposalOverviewSection,
  Tooltip,
  VoteForm,
} from '@/components'
import { Bus, sleep } from '@/helpers'
import {
  useContentSectionAction,
  useLoading,
  useProposals,
  useWeb3,
} from '@/hooks'
import { ProposalFragment } from '@/types'

const VOTE_FORM_ID = 'vote-form'

const ProposalDetailsSection = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { getProposalByID } = useProposals()
  const { isConnected, isValidator } = useWeb3()

  const { data, isLoading, isLoadingError, reload } =
    useLoading<ProposalFragment>({} as ProposalFragment, () =>
      getProposalByID(id as string),
    )

  const {
    closeDialog,
    openDialog,
    setIsDisabled,
    onSubmit,
    isDisabled,
    isDialogOpened,
  } = useContentSectionAction(async () => {
    await sleep(2000)
    await reload()
    await Bus.emit('reloadVotes')
  })

  const isVotingAllowed = useMemo(() => {
    if (isEmpty(data)) return false

    const enumStatus = proposalStatusFromJSON(data?.status)

    return enumStatus === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
  }, [data])

  const tooltipText = useMemo(() => {
    if (!isVotingAllowed) return t('proposal-details.vote-not-allowed-msg')
    if (!isConnected) return t('proposal-details.connect-wallet-msg')
    if (!isValidator) return t('proposal-details.not-validator-msg')

    return ''
  }, [isValidator, isVotingAllowed, isConnected, t])

  return (
    <ContentSection
      withBackButton
      title={t('proposal-details.title', { id })}
      action={
        <Tooltip
          message={tooltipText}
          sx={{
            minWidth: 'auto',
            textAlign: 'center',
          }}
          disabled={isValidator && isVotingAllowed && isConnected}
        >
          <span>
            <Button
              onClick={() => {
                openDialog()
              }}
              disabled={
                isDisabled || !isVotingAllowed || !isValidator || !isConnected
              }
            >
              {t('proposal-details.vote-btn')}
            </Button>
          </span>
        </Tooltip>
      }
    >
      <ProposalOverviewSection
        proposal={data}
        isLoading={isLoading}
        isLoadingError={isLoadingError}
      />
      <DialogFormWrapper
        formId={VOTE_FORM_ID}
        isDisabled={isDisabled}
        isDialogOpened={isDialogOpened}
        closeDialog={closeDialog}
        title={t('proposal-details.vote-dialog-heading', { id })}
      >
        <VoteForm
          id={VOTE_FORM_ID}
          proposalId={Number(id)}
          onSubmit={onSubmit}
          setIsDialogDisabled={setIsDisabled}
        />
      </DialogFormWrapper>
    </ContentSection>
  )
}

export default ProposalDetailsSection
