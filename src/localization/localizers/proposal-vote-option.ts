import {
  VoteOption,
  voteOptionFromJSON,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/types/cosmos/gov/v1beta1/gov'
import { TFunction } from 'i18next'

export const localizeProposalVoteOption = (t: TFunction, option: unknown) => {
  const enumStatus = voteOptionFromJSON(option)

  return {
    [VoteOption.VOTE_OPTION_UNSPECIFIED]: t('proposal-vote.unspecified-lbl'),
    [VoteOption.VOTE_OPTION_YES]: t('proposal-vote.yes-lbl'),
    [VoteOption.VOTE_OPTION_ABSTAIN]: t('proposal-vote.abstain-lbl'),
    [VoteOption.VOTE_OPTION_NO]: t('proposal-vote.no-lbl'),
    [VoteOption.VOTE_OPTION_NO_WITH_VETO]: t('proposal-vote.no-with-veto-lbl'),
    [VoteOption.UNRECOGNIZED]: t('proposal-vote.unrecognized-lbl'),
  }[enumStatus]
}
