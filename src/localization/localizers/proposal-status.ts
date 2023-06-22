import {
  ProposalStatus,
  proposalStatusFromJSON,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/types/cosmos/gov/v1beta1/gov'
import { TFunction } from 'i18next'

export const localizeProposalStatus = (
  t: TFunction,
  status: unknown,
): string => {
  const enumStatus = proposalStatusFromJSON(status)

  return {
    [ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED]: t(
      'proposal-status.unspecified-lbl',
    ),
    [ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD]: t(
      'proposal-status.deposit-period-lbl',
    ),
    [ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD]: t(
      'proposal-status.voting-period-lbl',
    ),
    [ProposalStatus.PROPOSAL_STATUS_PASSED]: t('proposal-status.passed-lbl'),
    [ProposalStatus.PROPOSAL_STATUS_REJECTED]: t(
      'proposal-status.rejected-lbl',
    ),
    [ProposalStatus.PROPOSAL_STATUS_FAILED]: t('proposal-status.failed-lbl'),
    [ProposalStatus.UNRECOGNIZED]: t('proposal-status.unrecognized-lbl'),
  }[enumStatus]
}
