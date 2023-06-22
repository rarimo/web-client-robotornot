import * as Yup from 'yup'

import { FIELD_LENGTH } from '@/const'
import { ProposalFormFieldNames, ProposalTypes } from '@/enums'
import {
  isAddSignerPartyProposal,
  isCollectionDataProposal,
  isCreateCollectionProposal,
  isRemoveCollection,
  isRemoveCollectionData,
  isSetNetworkProposal,
  isSignerProposal,
} from '@/helpers'

export const createProposalFormValidation = (minDepositValue: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (yup: typeof Yup): Yup.AnyObjectSchema =>
    yup.object().shape(
      {
        [ProposalFormFieldNames.Title]: yup
          .string()
          .required()
          .min(FIELD_LENGTH.min.proposalName)
          .max(FIELD_LENGTH.max.proposalName),
        [ProposalFormFieldNames.Description]: yup
          .string()
          .required()
          .min(FIELD_LENGTH.min.proposalDescription)
          .max(FIELD_LENGTH.max.proposalDescription),
        [ProposalFormFieldNames.Type]: yup.number().required(),
        [ProposalFormFieldNames.Deposit]: yup
          .string()
          .required()
          .minNumber(minDepositValue),
        [ProposalFormFieldNames.Account]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isSignerProposal(type),
            then: rule => rule.required().cosmosAddress(),
          }),
        [ProposalFormFieldNames.Address]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isAddSignerPartyProposal(type),
            then: rule => rule.required().ipOrUrl(),
          }),
        [ProposalFormFieldNames.TrialPublicKey]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isAddSignerPartyProposal(type),
            then: rule => rule.required().hex(),
          }),
        [ProposalFormFieldNames.MetadataURI]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isCreateCollectionProposal(type),
            then: rule => rule.required().url(),
          }),
        [ProposalFormFieldNames.NetworkParamsContract]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isSetNetworkProposal(type),
            then: rule => rule.required().hex(),
          }),
        [ProposalFormFieldNames.NetworkParamsName]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isSetNetworkProposal(type),
            then: rule => rule.required(),
          }),
        [ProposalFormFieldNames.Chain]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) =>
              isCreateCollectionProposal(type) ||
              isRemoveCollectionData(type) ||
              isCollectionDataProposal(type),
            then: rule => rule.required(),
          }),
        [ProposalFormFieldNames.MetaDataName]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isCreateCollectionProposal(type),
            then: rule => rule.required(),
          }),
        [ProposalFormFieldNames.MetaSymbol]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isCreateCollectionProposal(type),
            then: rule => rule.required(),
          }),
        [ProposalFormFieldNames.Decimals]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) =>
              isCreateCollectionProposal(type) ||
              isCollectionDataProposal(type),
            then: rule => rule.required(),
          }),
        [ProposalFormFieldNames.TokenType]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) =>
              isCreateCollectionProposal(type) ||
              isCollectionDataProposal(type),
            then: rule => rule.required(),
          }),
        [ProposalFormFieldNames.CollectionDataIndexAddress]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) =>
              isCreateCollectionProposal(type) ||
              isRemoveCollectionData(type) ||
              isCollectionDataProposal(type),
            then: rule => rule.required().hex(),
          }),
        [ProposalFormFieldNames.Collection]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) =>
              isCreateCollectionProposal(type) ||
              isRemoveCollectionData(type) ||
              isCollectionDataProposal(type) ||
              isRemoveCollection(type),
            then: rule => rule.required().hex(),
          }),
        [ProposalFormFieldNames.Index]: yup
          .string()
          .when(ProposalFormFieldNames.Type, {
            is: (type?: ProposalTypes) => isRemoveCollection(type),
            then: rule => rule.required(),
          }),
      },
      [
        [ProposalFormFieldNames.Account, ProposalFormFieldNames.Type],
        [ProposalFormFieldNames.Address, ProposalFormFieldNames.Type],
        [ProposalFormFieldNames.TrialPublicKey, ProposalFormFieldNames.Type],
        [ProposalFormFieldNames.MetaData, ProposalFormFieldNames.MetadataURI],
        [ProposalFormFieldNames.MetadataURI, ProposalFormFieldNames.Type],
        [
          ProposalFormFieldNames.NetworkParamsContract,
          ProposalFormFieldNames.Type,
        ],
        [
          ProposalFormFieldNames.CollectionDataIndexAddress,
          ProposalFormFieldNames.Type,
        ],
        [ProposalFormFieldNames.Index, ProposalFormFieldNames.Type],
        [ProposalFormFieldNames.Collection, ProposalFormFieldNames.Type],
      ],
    )
}
