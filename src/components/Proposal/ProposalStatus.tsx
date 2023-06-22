import { Chip } from '@mui/material'
import {
  ProposalStatus as ProposalStatusEnum,
  proposalStatusFromJSON,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/types/cosmos/gov/v1beta1/gov'

import { useLocalize } from '@/hooks'

const ProposalStatus = ({ status }: { status?: string | number }) => {
  const { localizeProposalStatus } = useLocalize()

  const getProposalStatusColor = (status: unknown) => {
    const enumStatus = proposalStatusFromJSON(status)

    switch (enumStatus) {
      case ProposalStatusEnum.PROPOSAL_STATUS_DEPOSIT_PERIOD:
        return 'primary'
      case ProposalStatusEnum.PROPOSAL_STATUS_VOTING_PERIOD:
        return 'secondary'
      case ProposalStatusEnum.PROPOSAL_STATUS_PASSED:
        return 'success'
      case ProposalStatusEnum.PROPOSAL_STATUS_REJECTED:
      case ProposalStatusEnum.PROPOSAL_STATUS_FAILED:
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Chip
      label={localizeProposalStatus(status) ?? ''}
      color={getProposalStatusColor(status) ?? 'primary'}
    />
  )
}

export default ProposalStatus
