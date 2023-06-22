import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentBox,
  ContentSection,
  DialogFormWrapper,
  ProposalForm,
  ProposalList,
} from '@/components'
import { sleep } from '@/helpers'
import {
  useContentSectionAction,
  useLoading,
  useProposals,
  useTablePagination,
} from '@/hooks'
import { ProposalBaseFragment } from '@/types'

const PROPOSAL_FORM_ID = 'proposal-form'

const ProposalSection = () => {
  const { t } = useTranslation()

  const { getProposalList, getProposalCount } = useProposals()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: proposalCount,
    isLoading: isLoadingProposalCount,
    isLoadingError: isLoadingProposalCountError,
  } = useLoading<number>(0, getProposalCount)

  const {
    data: proposalList,
    isLoading,
    isLoadingError,
    reload,
  } = useLoading<ProposalBaseFragment[]>(
    [],
    () => getProposalList(limit, offset),
    { loadArgs: [limit, offset] },
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
  })

  return (
    <ContentSection
      withBackButton
      title={t('proposal-section.title')}
      action={
        <Button onClick={openDialog} disabled={isDisabled}>
          {t('common.create-btn')}
        </Button>
      }
    >
      <ContentBox>
        <ProposalList
          isLoading={isLoading || isLoadingProposalCount}
          isLoadingError={isLoadingError || isLoadingProposalCountError}
          limit={limit}
          offset={offset}
          list={proposalList}
          count={proposalCount}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </ContentBox>
      <DialogFormWrapper
        formId={PROPOSAL_FORM_ID}
        isDisabled={isDisabled}
        isDialogOpened={isDialogOpened}
        closeDialog={closeDialog}
        title={t('proposals-section.new-proposal-dialog-heading')}
      >
        <ProposalForm
          id={PROPOSAL_FORM_ID}
          onSubmit={onSubmit}
          setIsDialogDisabled={setIsDisabled}
        />
      </DialogFormWrapper>
    </ContentSection>
  )
}

export default ProposalSection
