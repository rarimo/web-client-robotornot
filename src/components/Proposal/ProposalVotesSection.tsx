import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ContentSection, ProposalVotesList } from '@/components'
import { Bus } from '@/helpers'
import { useLoading, useProposals, useTablePagination } from '@/hooks'
import { ProposalVoteFragment } from '@/types'

const ProposalVotesSection = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { getProposalVotesListByID, getProposalVotesCountByID } = useProposals()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: voteCount,
    isLoading: isLoadingVotesCount,
    isLoadingError: isLoadingVotesCountError,
    reload: reloadVotesCount,
  } = useLoading<number>(0, () => getProposalVotesCountByID(id as string))

  const {
    data: votesList,
    isLoading,
    isLoadingError,
    reload: reloadVotes,
  } = useLoading<ProposalVoteFragment[]>(
    [],
    () => getProposalVotesListByID(id as string, limit, offset),
    { loadArgs: [limit, offset] },
  )
  useEffect(() => {
    Bus.on('reloadVotes', () => {
      reloadVotes(), reloadVotesCount()
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ContentSection title={t('proposal-votes-section.title-lbl')}>
      <ProposalVotesList
        limit={limit}
        offset={offset}
        list={votesList}
        count={voteCount}
        isLoading={isLoading || isLoadingVotesCount}
        isLoadingError={isLoadingError || isLoadingVotesCountError}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </ContentSection>
  )
}

export default ProposalVotesSection
