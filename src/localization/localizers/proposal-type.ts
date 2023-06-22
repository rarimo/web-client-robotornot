import { TFunction } from 'i18next'

import { ProposalTypes } from '@/enums'

export const localizeProposalType = (t: TFunction, type: ProposalTypes) =>
  ({
    [ProposalTypes.AddSignerParty]: t(
      'proposal-type.add-signer-party-proposal-lbl',
    ),
    [ProposalTypes.RemoveSignerParty]: t(
      'proposal-type.remove-signer-party-proposal-lbl',
    ),
    [ProposalTypes.ReshareKeys]: t('proposal-type.reshare-keys-proposal-lbl'),
    [ProposalTypes.ChangeThreshold]: t(
      'proposal-type.change-threshold-proposal-lbl',
    ),
    [ProposalTypes.SetTokenInfo]: t(
      'proposal-type.set-token-info-proposal-lbl',
    ),
    [ProposalTypes.SetTokenItem]: t(
      'proposal-type.set-token-item-proposal-lbl',
    ),
    [ProposalTypes.RemoveTokenItem]: t(
      'proposal-type.remove-token-item-proposal-lbl',
    ),
    [ProposalTypes.RemoveTokenInfo]: t(
      'proposal-type.remove-token-info-proposal-lbl',
    ),
    [ProposalTypes.SetNetwork]: t('proposal-type.set-network-proposal-lbl'),
    [ProposalTypes.CreateCollection]: t(
      'proposal-type.create-collection-proposal-lbl',
    ),
    [ProposalTypes.UpdateCollectionData]: t(
      'proposal-type.update-collection-data-proposal-lbl',
    ),
    [ProposalTypes.AddCollectionData]: t(
      'proposal-type.add-collection-data-proposal-lbl',
    ),
    [ProposalTypes.RemoveCollectionData]: t(
      'proposal-type.remove-collection-data-proposal-lbl',
    ),
    [ProposalTypes.RemoveCollection]: t(
      'proposal-type.remove-collection-proposal-lbl',
    ),
    [ProposalTypes.SoftwareUpgrade]: t(
      'proposal-type.software-upgrade-proposal-lbl',
    ),
    [ProposalTypes.CancelSoftwareUpgrade]: t(
      'proposal-type.cancel-software-upgrade-proposal-lbl',
    ),
    [ProposalTypes.ParameterChange]: t(
      'proposal-type.parameter-change-proposal-lbl',
    ),
    [ProposalTypes.CommunityPoolSpend]: t(
      'proposal-type.community-pool-spend-proposal-lbl',
    ),
    [ProposalTypes.MintTokens]: t('proposal-type.mint-tokens-proposal-lbl'),
    [ProposalTypes.UnfreezeSignerParty]: t(
      'proposal-type.unfreeze-signer-party-lbl',
    ),
    [ProposalTypes.Slash]: t('proposal-type.slash-lbl'),
    [ProposalTypes.DropParties]: t('proposal-type.drop-parties-lbl'),
    [ProposalTypes.UpdateTokenItem]: t('proposal-type.update-token-item-lbl'),
    [ProposalTypes.OracleUnfreeze]: t('proposal-type.oracle-unfreeze-lbl'),
    [ProposalTypes.OracleChangeParams]: t(
      'proposal-type.oracle-change-params-lbl',
    ),
    [ProposalTypes.BridgeChangeParams]: t(
      'proposal-type.bridge-change-params-lbl',
    ),
  }[type])
