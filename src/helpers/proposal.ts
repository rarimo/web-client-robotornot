import { CONFIG } from '@config'
import { BN } from '@distributedlab/tools'
import {
  AddCollectionDataProposal,
  AddSignerPartyProposal,
  CollectionDataIndex,
  CreateCollectionProposal,
  RemoveCollectionDataProposal,
  RemoveCollectionProposal,
  RemoveSignerPartyProposal,
  SetNetworkProposal,
  UpdateCollectionDataProposal,
} from '@rarimo/client'
import { protobufPackage as distributionProtobufPackage } from '@rarimo/client/lib/cosmos.distribution.v1beta1/types/cosmos/distribution/v1beta1/distribution'
import {
  MsgSubmitProposal,
  MsgVote,
} from '@rarimo/client/lib/cosmos.gov.v1beta1/module'
import { protobufPackage as paramsProtobufPackage } from '@rarimo/client/lib/cosmos.params.v1beta1/types/cosmos/params/v1beta1/params'
import { protobufPackage as upgradeProtobufPackage } from '@rarimo/client/lib/cosmos.upgrade.v1beta1/types/cosmos/upgrade/v1beta1/upgrade'
import { Any } from '@rarimo/client/lib/rarimo.rarimocore.rarimocore/types/google/protobuf/any'
import { protobufPackage as rarimocoreProtobufPackage } from '@rarimo/client/lib/rarimo.rarimocore.rarimocore/types/rarimocore/proposal'
import { protobufPackage as tokenmanagerProtobufPackage } from '@rarimo/client/lib/rarimo.rarimocore.tokenmanager/types/tokenmanager/tx'
import { v4 as uuid } from 'uuid'

import { ProposalFormData, VoteFormData } from '@/components'
import { PROPOSAL_NAMES } from '@/const'
import { ProposalFormFieldNames, ProposalTypes } from '@/enums'
import { resultProposalFormData } from '@/types'

export const isAddSignerPartyProposal = (type?: ProposalTypes) =>
  type === ProposalTypes.AddSignerParty

export const isRemoveSignerPartyProposal = (type?: ProposalTypes) =>
  type === ProposalTypes.RemoveSignerParty

export const isSetNetworkProposal = (type?: ProposalTypes) =>
  type === ProposalTypes.SetNetwork

export const isCreateCollectionProposal = (type?: ProposalTypes) =>
  type === ProposalTypes.CreateCollection

export const isCollectionDataProposal = (type?: ProposalTypes) =>
  type === ProposalTypes.UpdateCollectionData || ProposalTypes.AddCollectionData

export const isRemoveCollectionData = (type?: ProposalTypes) =>
  type === ProposalTypes.RemoveCollectionData

export const isRemoveCollection = (type?: ProposalTypes) =>
  type === ProposalTypes.RemoveCollection

export const isSignerProposal = (type?: ProposalTypes) =>
  isAddSignerPartyProposal(type) || isRemoveSignerPartyProposal(type)

const proposalTypes: { [key in ProposalTypes]?: boolean } = {
  [ProposalTypes.AddSignerParty]: true,
  [ProposalTypes.RemoveSignerParty]: true,
  [ProposalTypes.AddCollectionData]: true,
  [ProposalTypes.CreateCollection]: true,
  [ProposalTypes.UpdateCollectionData]: true,
  [ProposalTypes.SetNetwork]: true,
  [ProposalTypes.RemoveCollection]: true,
  [ProposalTypes.RemoveCollectionData]: true,
}

export const isProposalType = (type?: ProposalTypes) => {
  if (!type && type !== 0) return false
  return Boolean(proposalTypes[type])
}
export const createSubmitProposal = (
  data: resultProposalFormData,
  proposer: string,
): MsgSubmitProposal => {
  return MsgSubmitProposal.fromPartial({
    content: getContent(data),
    initialDeposit: getDeposit(data[ProposalFormFieldNames.Deposit]),
    proposer,
  })
}

export const createVote = (
  { option }: VoteFormData,
  proposalId: number,
  voter: string,
): MsgVote => {
  return MsgVote.fromPartial({
    proposalId,
    voter,
    option,
  })
}

export const formatMaxDepositValue = (deposit: string | number): number => {
  return Number(BN.fromBigInt(deposit, CONFIG.DECIMALS).toString())
}

const getDeposit = (deposit: string) => {
  return deposit
    ? [
        {
          amount: BN.fromRaw(deposit, CONFIG.DECIMALS).toString(),
          denom: CONFIG.MINIMAL_DENOM,
        },
      ]
    : []
}

const getCollectionDataIndex = (formData: ProposalFormData) => {
  return {
    [ProposalFormFieldNames.Chain]: formData[ProposalFormFieldNames.Chain],
    [ProposalFormFieldNames.Address]:
      formData[ProposalFormFieldNames.CollectionDataIndexAddress],
  }
}

const getCollectionData = (formData: ProposalFormData) => {
  return [
    {
      [ProposalFormFieldNames.Index]: getCollectionDataIndex(formData),
      [ProposalFormFieldNames.Collection]:
        formData[ProposalFormFieldNames.Collection] !== ''
          ? formData[ProposalFormFieldNames.CollectionDataIndexAddress]
          : uuid(),
      [ProposalFormFieldNames.TokenType]:
        formData[ProposalFormFieldNames.TokenType],
      [ProposalFormFieldNames.Wrapped]: Boolean(
        formData[ProposalFormFieldNames.Wrapped],
      ),
      [ProposalFormFieldNames.Decimals]:
        formData[ProposalFormFieldNames.Decimals],
    },
  ]
}

const getNetworkData = (formData: ProposalFormData) => {
  return {
    ...formData,
    [ProposalFormFieldNames.NetworkParams]: {
      [ProposalFormFieldNames.NetworkParamsNameResult]:
        formData[ProposalFormFieldNames.NetworkParamsName],
      [ProposalFormFieldNames.NetworkParamsContract]:
        formData[ProposalFormFieldNames.NetworkParamsContract],
      [ProposalFormFieldNames.NetworkParamsNetworkType]:
        formData[ProposalFormFieldNames.NetworkParamsNetworkType],
    },
  }
}

const getCreateCollectionData = (formData: ProposalFormData) => {
  return {
    ...formData,
    [ProposalFormFieldNames.Index]: uuid(),
    [ProposalFormFieldNames.MetaData]: {
      [ProposalFormFieldNames.MetaDataNameResult]:
        formData[ProposalFormFieldNames.MetaDataName],
      [ProposalFormFieldNames.MetaSymbol]:
        formData[ProposalFormFieldNames.MetaSymbol],
      [ProposalFormFieldNames.MetadataURI]:
        formData[ProposalFormFieldNames.MetadataURI],
    },
    [ProposalFormFieldNames.Data]: getCollectionData(formData),
    [ProposalFormFieldNames.Item]: [],
    [ProposalFormFieldNames.OnChainItem]: [],
  }
}

const getUpdateCollectionData = (formData: ProposalFormData) => {
  return {
    ...formData,
    [ProposalFormFieldNames.Data]: getCollectionData(formData),
  }
}

const getRemoveCollection = (formData: ProposalFormData) => {
  return {
    ...formData,
    [ProposalFormFieldNames.Index]: getCollectionDataIndex(formData),
  }
}

const getRemoveCollectionData = (formData: ProposalFormData) => {
  return {
    ...formData,
    [ProposalFormFieldNames.Index]: formData[ProposalFormFieldNames.Index],
  }
}

export const formatFormData = (formData: ProposalFormData) => {
  switch (formData[ProposalFormFieldNames.Type]) {
    case ProposalTypes.AddSignerParty:
    case ProposalTypes.RemoveSignerParty:
      return formData
    case ProposalTypes.SetNetwork:
      return getNetworkData(formData)
    case ProposalTypes.CreateCollection:
      return getCreateCollectionData(formData)
    case ProposalTypes.UpdateCollectionData:
    case ProposalTypes.AddCollectionData:
      return getUpdateCollectionData(formData)
    case ProposalTypes.RemoveCollection:
      return getRemoveCollection(formData)
    case ProposalTypes.RemoveCollectionData:
      return getRemoveCollectionData(formData)
    default:
      return formData
  }
}

const getProtobufPackageName = (type: ProposalTypes) => {
  switch (type) {
    case ProposalTypes.AddSignerParty:
    case ProposalTypes.RemoveSignerParty:
    case ProposalTypes.ReshareKeys:
    case ProposalTypes.ChangeThreshold:
      return rarimocoreProtobufPackage
    case ProposalTypes.AddCollectionData:
    case ProposalTypes.RemoveCollectionData:
    case ProposalTypes.UpdateCollectionData:
    case ProposalTypes.CreateCollection:
    case ProposalTypes.RemoveCollection:
    case ProposalTypes.SetNetwork:
      return tokenmanagerProtobufPackage
    case ProposalTypes.SoftwareUpgrade:
    case ProposalTypes.CancelSoftwareUpgrade:
      return upgradeProtobufPackage
    case ProposalTypes.CommunityPoolSpend:
      return distributionProtobufPackage
    case ProposalTypes.ParameterChange:
      return paramsProtobufPackage
    default:
      throw new Error('Unknown proposal type')
  }
}

const getContent = (data: resultProposalFormData<unknown>) => {
  return Any.fromPartial({
    typeUrl: `/${getProtobufPackageName(data[ProposalFormFieldNames.Type])}.${
      // TODO: Remove after update ts-client
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PROPOSAL_NAMES[data[ProposalFormFieldNames.Type]]
    }`,
    value: getContentValue(data).finish(),
  })
}
const getContentValue = (data: resultProposalFormData<unknown>) => {
  switch (data[ProposalFormFieldNames.Type]) {
    case ProposalTypes.AddSignerParty:
      return AddSignerPartyProposal.encode(data)
    case ProposalTypes.RemoveSignerParty:
      return RemoveSignerPartyProposal.encode(data)
    case ProposalTypes.SetNetwork:
      return SetNetworkProposal.encode(data)
    case ProposalTypes.CreateCollection:
      return CreateCollectionProposal.encode(data as resultProposalFormData)
    case ProposalTypes.AddCollectionData:
      return AddCollectionDataProposal.encode(data)
    case ProposalTypes.UpdateCollectionData:
      return UpdateCollectionDataProposal.encode(data)
    case ProposalTypes.RemoveCollectionData:
      return RemoveCollectionDataProposal.encode(
        data as resultProposalFormData<CollectionDataIndex[]>,
      )
    case ProposalTypes.RemoveCollection:
      return RemoveCollectionProposal.encode(data as resultProposalFormData)
    default:
      throw new Error('Unknown proposal type')
  }
}
