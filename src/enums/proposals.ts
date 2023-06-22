export enum ProposalTypes {
  // rarimocore
  AddSignerParty,
  RemoveSignerParty,
  ReshareKeys,
  ChangeThreshold,
  UnfreezeSignerParty,
  Slash,
  DropParties,

  // tokenmanager
  SetNetwork,
  CreateCollection,
  UpdateCollectionData,
  AddCollectionData,
  RemoveCollectionData,
  RemoveCollection,
  SetTokenInfo,
  SetTokenItem,
  RemoveTokenItem,
  RemoveTokenInfo,
  UpdateTokenItem,

  // oracle
  OracleUnfreeze,
  OracleChangeParams,

  // bridge
  BridgeChangeParams,

  // Cosmos default proposals
  // upgrade
  SoftwareUpgrade,
  CancelSoftwareUpgrade,
  // params
  ParameterChange,
  // distribution
  CommunityPoolSpend,
  // bank
  MintTokens,
}
