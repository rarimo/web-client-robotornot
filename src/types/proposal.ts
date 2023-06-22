import {
  CollectionData,
  CollectionMetadata,
  NetworkParams,
} from '@rarimo/client'

import { NetworkType, ProposalFormFieldNames, ProposalTypes } from '@/enums'

export type resultProposalFormData<T = string> = {
  [ProposalFormFieldNames.Title]: string
  [ProposalFormFieldNames.Description]: string
  [ProposalFormFieldNames.Type]: ProposalTypes
  [ProposalFormFieldNames.Deposit]: string
  [ProposalFormFieldNames.Account]: string
  [ProposalFormFieldNames.Address]: string
  [ProposalFormFieldNames.TrialPublicKey]: string
  [ProposalFormFieldNames.NetworkParams]: NetworkParams
  [ProposalFormFieldNames.NetworkParamsName]: string
  [ProposalFormFieldNames.NetworkParamsContract]: string
  [ProposalFormFieldNames.NetworkParamsNetworkType]: NetworkType
  [ProposalFormFieldNames.Index]: T
  [ProposalFormFieldNames.Chain]: string
  [ProposalFormFieldNames.CollectionDataIndexAddress]: string
  [ProposalFormFieldNames.MetaData]: CollectionMetadata | undefined
  [ProposalFormFieldNames.MetaDataName]: string
  [ProposalFormFieldNames.MetaSymbol]: string
  [ProposalFormFieldNames.MetadataURI]: string
  [ProposalFormFieldNames.Collection]: string
  [ProposalFormFieldNames.TokenType]: string
  [ProposalFormFieldNames.Wrapped]: number | boolean
  [ProposalFormFieldNames.Decimals]: string
  [ProposalFormFieldNames.Chain]: string
  [ProposalFormFieldNames.CollectionDataIndexAddress]: string
  [ProposalFormFieldNames.Data]: CollectionData[]
  [ProposalFormFieldNames.Item]: []
  [ProposalFormFieldNames.OnChainItem]: []
}
