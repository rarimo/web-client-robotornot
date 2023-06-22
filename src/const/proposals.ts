import { ProposalTypes } from '@/enums'

export const PROPOSAL_NAMES = {
  [ProposalTypes.AddSignerParty]: 'Add Signer Party Proposal',
  [ProposalTypes.RemoveSignerParty]: 'Remove Signer Party Proposal',
  [ProposalTypes.ReshareKeys]: 'Reshare Keys Proposal',
  [ProposalTypes.ChangeThreshold]: 'Change Threshold Proposal',
  [ProposalTypes.CreateCollection]: 'Create Collection Proposal',
  [ProposalTypes.UpdateCollectionData]: 'Update Collection Data Proposal',
  [ProposalTypes.AddCollectionData]: 'Add Collection Data Proposal',
  [ProposalTypes.RemoveCollectionData]: 'Remove Collection Data Proposal',
  [ProposalTypes.RemoveCollection]: 'Remove Collection Proposal',
  [ProposalTypes.SetNetwork]: 'Set Network Proposal',
  [ProposalTypes.UpdateCollectionData]: 'Update Collection Data Proposal',
  [ProposalTypes.SetTokenInfo]: 'Set Token Info Proposal',
  [ProposalTypes.SetTokenItem]: 'Set Token Item Proposal',
  [ProposalTypes.RemoveTokenItem]: 'Remove Token Item Proposal',
  [ProposalTypes.RemoveTokenInfo]: 'Remove Token Info Proposal',

  // Cosmos default proposals
  [ProposalTypes.ParameterChange]: 'Parameter Change Proposal',
  [ProposalTypes.CommunityPoolSpend]: 'Community Pool Spend Proposal',
  [ProposalTypes.SoftwareUpgrade]: 'Software Upgrade Proposal',
  [ProposalTypes.CancelSoftwareUpgrade]: 'Cancel Software Upgrade Proposal',

  // custom
  [ProposalTypes.MintTokens]: 'Mint Tokens Proposal',
}

export const PROPOSAL_TYPES_MAP = {
  AddSignerParty: ProposalTypes.AddSignerParty,
  RemoveSignerParty: ProposalTypes.RemoveSignerParty,
  reshare_keys: ProposalTypes.ReshareKeys,
  change_threshold: ProposalTypes.ChangeThreshold,
  UpdateCollectionData: ProposalTypes.UpdateCollectionData,
  AddCollectionData: ProposalTypes.AddCollectionData,
  RemoveCollectionData: ProposalTypes.RemoveCollectionData,
  RemoveCollection: ProposalTypes.RemoveCollection,
  CreateCollection: ProposalTypes.CreateCollection,
  SetNetwork: ProposalTypes.SetNetwork,

  'rarimocore/UnfreezeSignerParty': ProposalTypes.UnfreezeSignerParty,
  'rarimocore/ReshareKeys': ProposalTypes.ReshareKeys,
  'rarimocore/SlashProposal': ProposalTypes.Slash,
  'rarimocore/DropPartiesProposal': ProposalTypes.DropParties,

  'tokenmanager/SetNetwork': ProposalTypes.SetNetwork,
  'tokenmanager/UpdateTokenItem': ProposalTypes.UpdateTokenItem,
  'tokenmanager/RemoveTokenItem': ProposalTypes.RemoveTokenItem,
  'tokenmanager/CreateCollection': ProposalTypes.CreateCollection,
  'tokenmanager/UpdateCollectionData': ProposalTypes.UpdateCollectionData,
  'tokenmanager/AddCollectionData': ProposalTypes.AddCollectionData,
  'tokenmanager/RemoveCollectionData': ProposalTypes.RemoveCollectionData,
  'tokenmanager/RemoveCollection': ProposalTypes.RemoveCollection,

  'bridge/ChangeParams': ProposalTypes.BridgeChangeParams,

  'oraclemanager/OracleUnfreeze': ProposalTypes.OracleUnfreeze,
  'oraclemanager/ChangeParams': ProposalTypes.OracleChangeParams,

  // Cosmos default proposals
  ParameterChange: ProposalTypes.ParameterChange,
  SoftwareUpgrade: ProposalTypes.SoftwareUpgrade,
  CancelSoftwareUpgrade: ProposalTypes.CancelSoftwareUpgrade,
  CommunityPoolSpend: ProposalTypes.CommunityPoolSpend,

  // custom
  mint_tokens: ProposalTypes.MintTokens,
}
