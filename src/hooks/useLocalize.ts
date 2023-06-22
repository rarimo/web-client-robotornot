import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'
import { useTranslation } from 'react-i18next'
import BaseSchema from 'yup/lib/schema'
import { AnyObject, Maybe } from 'yup/lib/types'

import { NetworkType, ProposalTypes, TokenType } from '@/enums'
import { createYupInitFn } from '@/helpers'
import {
  localizeMsgType,
  localizeNetworkType,
  localizeProposalStatus,
  localizeProposalType,
  localizeProposalVoteOption,
  localizeTokenType,
  localizeValidatorStatus,
} from '@/localization'

declare module 'yup' {
  export interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends BaseSchema<TType, TContext, TOut> {
    maxNumber(max: number | string): this
    minNumber(min: number | string): this
    cosmosAddress(): this
    ipOrUrl(): this
    hex(): this
  }
}

export const useLocalize = () => {
  const { t } = useTranslation()

  const localizers = {
    localizeProposalStatus: (status: unknown) =>
      localizeProposalStatus(t, status),
    localizeProposalVoteOption: (option: unknown) =>
      localizeProposalVoteOption(t, option),
    localizeNetworkType: (type: NetworkType) => localizeNetworkType(t, type),
    localizeTokenType: (type: TokenType) => localizeTokenType(t, type),
    localizeProposalType: (type: ProposalTypes) =>
      localizeProposalType(t, type),
    localizeMsgType: (type: string) => localizeMsgType(t, type),
    localizeValidatorStatus: (status: BondStatus, jailed: boolean) =>
      localizeValidatorStatus(t, status, jailed),
  }

  return {
    init: createYupInitFn(t),
    ...localizers,
  }
}
