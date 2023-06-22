import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ContentSection, ProposalDepositsList } from '@/components'
import { useLoading, useProposals, useTablePagination } from '@/hooks'
import { ProposalDepositFragment } from '@/types'

const ProposalDepositsSection = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { getProposalDepositsListByID, getProposalDepositsCountByID } =
    useProposals()

  const { limit, offset, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination()

  const {
    data: depositCount,
    isLoading: isLoadingDepositCount,
    isLoadingError: isLoadingDepositCountError,
  } = useLoading<number>(0, () => getProposalDepositsCountByID(id as string))

  const {
    data: depositList,
    isLoading,
    isLoadingError,
  } = useLoading<ProposalDepositFragment[]>(
    [],
    () => getProposalDepositsListByID(id as string, limit, offset),
    { loadArgs: [limit, offset] },
  )

  return (
    <ContentSection title={t('proposal-deposits-section.title-lbl')}>
      <ProposalDepositsList
        limit={limit}
        offset={offset}
        list={depositList}
        count={depositCount}
        isLoading={isLoading || isLoadingDepositCount}
        isLoadingError={isLoadingError || isLoadingDepositCountError}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </ContentSection>
  )
}

export default ProposalDepositsSection
