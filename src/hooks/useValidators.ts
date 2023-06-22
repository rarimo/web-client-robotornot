import { CONFIG } from '@config'
import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'
import { isUndefined } from 'lodash-es'

import { apolloClient } from '@/graphql'
import {
  GetValidatorBase,
  GetValidatorBaseQuery,
  GetValidatorByAddress,
  GetValidatorByAddressQuery,
  GetValidatorByConsensusAddress,
  GetValidatorByConsensusAddressQuery,
  GetValidatorCommissionAmount,
  GetValidatorCommissionAmountQuery,
  GetValidatorCount,
  GetValidatorCountQuery,
  GetValidatorDelegationList,
  GetValidatorDelegationListQuery,
  GetValidatorRedelegationList,
  GetValidatorRedelegationListQuery,
  GetValidatorUnbondingDelegationList,
  GetValidatorUnbondingDelegationListQuery,
  SortOrder,
  ValidatorListColumnIds,
  ValidatorListSortBy,
} from '@/types'

export const useValidators = () => {
  const createValidatorWhere = (status?: number, jailed?: boolean) => {
    const where = {
      validator_statuses: {
        status: {},
        jailed: {},
      },
    }

    if (status) {
      where.validator_statuses.status =
        status === BondStatus.BOND_STATUS_BONDED
          ? { _eq: status }
          : { _neq: BondStatus.BOND_STATUS_BONDED }
    }
    if (!isUndefined(jailed)) {
      where.validator_statuses.jailed = { _eq: jailed }
    }

    return where
  }

  const createValidatorOrderBy = (
    orderBy?: ValidatorListSortBy,
    order?: SortOrder,
  ) => {
    if (!orderBy) return {}

    if (orderBy === ValidatorListColumnIds.VOTING_POWER) {
      return {
        validator_voting_powers_aggregate: { max: { voting_power: order } },
      }
    }

    if (orderBy === ValidatorListColumnIds.COMMISSION) {
      return { validator_commissions_aggregate: { max: { commission: order } } }
    }
  }

  const getValidatorList = async ({
    limit = CONFIG.PAGE_LIMIT,
    offset = 0,
    status,
    jailed,
    order,
    orderBy,
  }: {
    limit?: number
    offset?: number
    status?: number
    jailed?: boolean
    order?: SortOrder
    orderBy?: ValidatorListSortBy
  }): Promise<GetValidatorBaseQuery> => {
    const { data } = await apolloClient.query<GetValidatorBaseQuery>({
      query: GetValidatorBase,
      fetchPolicy: 'network-only',
      variables: {
        limit,
        offset,
        where: createValidatorWhere(status, jailed),
        order_by: createValidatorOrderBy(orderBy, order),
      },
    })

    return data
  }

  const getValidatorCount = async ({
    status,
    jailed,
  }: {
    status?: number
    jailed?: boolean
  }): Promise<number> => {
    const { data } = await apolloClient.query<GetValidatorCountQuery>({
      query: GetValidatorCount,
      fetchPolicy: 'network-only',
      variables: {
        where: createValidatorWhere(status, jailed),
      },
    })

    return data?.validator_aggregate.aggregate?.count ?? 0
  }

  const getValidatorByAddress = async (
    address: string,
  ): Promise<GetValidatorByAddressQuery> => {
    const { data } = await apolloClient.query<GetValidatorByAddressQuery>({
      query: GetValidatorByAddress,
      fetchPolicy: 'network-only',
      variables: { address },
    })

    return data
  }

  const getValidatorByConsensusAddress = async (
    address: string,
  ): Promise<GetValidatorByConsensusAddressQuery> => {
    const { data } =
      await apolloClient.query<GetValidatorByConsensusAddressQuery>({
        query: GetValidatorByConsensusAddress,
        fetchPolicy: 'network-only',
        variables: { address },
      })

    return data
  }

  const getValidatorDelegationsList = async ({
    operator,
    limit = CONFIG.PAGE_LIMIT,
    offset = 0,
  }: {
    operator: string
    limit?: number
    offset?: number
  }): Promise<GetValidatorDelegationListQuery> => {
    const { data } = await apolloClient.query<GetValidatorDelegationListQuery>({
      query: GetValidatorDelegationList,
      fetchPolicy: 'network-only',
      variables: {
        limit,
        offset,
        operator,
      },
    })

    return data
  }

  const getValidatorRedelegationsList = async ({
    operator,
    limit = CONFIG.PAGE_LIMIT,
    offset = 0,
  }: {
    operator: string
    limit?: number
    offset?: number
  }): Promise<GetValidatorRedelegationListQuery> => {
    const { data } =
      await apolloClient.query<GetValidatorRedelegationListQuery>({
        query: GetValidatorRedelegationList,
        fetchPolicy: 'network-only',
        variables: {
          limit,
          offset,
          operator,
        },
      })

    return data
  }

  const getValidatorUnbondingDelegationsList = async ({
    operator,
    limit = CONFIG.PAGE_LIMIT,
    offset = 0,
  }: {
    operator: string
    limit?: number
    offset?: number
  }): Promise<GetValidatorUnbondingDelegationListQuery> => {
    const { data } =
      await apolloClient.query<GetValidatorUnbondingDelegationListQuery>({
        query: GetValidatorUnbondingDelegationList,
        fetchPolicy: 'network-only',
        variables: {
          limit,
          offset,
          operator,
        },
      })

    return data
  }

  const getValidatorCommissionAmount = async ({
    address,
  }: {
    address: string
  }): Promise<GetValidatorCommissionAmountQuery> => {
    const { data } =
      await apolloClient.query<GetValidatorCommissionAmountQuery>({
        query: GetValidatorCommissionAmount,
        fetchPolicy: 'network-only',
        variables: {
          address,
        },
      })

    return data.action_validator_commission_amount?.coins?.[0]?.amount
  }

  return {
    getValidatorList,
    getValidatorCount,
    getValidatorByAddress,
    getValidatorByConsensusAddress,
    getValidatorDelegationsList,
    getValidatorRedelegationsList,
    getValidatorUnbondingDelegationsList,
    getValidatorCommissionAmount,
  }
}
