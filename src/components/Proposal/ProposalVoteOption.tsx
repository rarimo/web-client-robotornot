import { Chip } from '@mui/material'
import {
  VoteOption,
  voteOptionFromJSON,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/types/cosmos/gov/v1beta1/gov'

import { useLocalize } from '@/hooks'

const ProposalVoteOption = ({ vote }: { vote?: string | number }) => {
  const { localizeProposalVoteOption } = useLocalize()

  const getProposalVoteColor = (vote: unknown) => {
    const enumStatus = voteOptionFromJSON(vote)

    switch (enumStatus) {
      case VoteOption.VOTE_OPTION_ABSTAIN:
        return 'secondary'
      case VoteOption.VOTE_OPTION_YES:
        return 'success'
      case VoteOption.VOTE_OPTION_NO:
      case VoteOption.VOTE_OPTION_NO_WITH_VETO:
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Chip
      label={localizeProposalVoteOption(vote) ?? ''}
      color={getProposalVoteColor(vote) ?? 'primary'}
    />
  )
}

export default ProposalVoteOption
