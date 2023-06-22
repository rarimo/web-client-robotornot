import { V1Beta1QueryDelegationRewardsResponse } from '@rarimo/client/lib/cosmos.distribution.v1beta1/rest'
import { V1Beta1DelegationResponse } from '@rarimo/client/lib/cosmos.staking.v1beta1/rest'
import { AxiosError } from 'axios'

import { AccountModel } from '@/types'
import { client } from '@/utils'

export const useAccounts = () => {
  const getAccountBalanceByAddress = async (address: string) => {
    const { data } = await client.CosmosBankV1Beta1.query.queryAllBalances(
      address,
    )
    return data?.balances?.[0]
  }

  const getAccountByAddress = async (
    address: string,
  ): Promise<AccountModel> => {
    const { data } = await client.CosmosAuthV1Beta1.query.queryAccount(address)
    return data?.account as AccountModel
  }

  const getAccountRewardsValidator = async (
    operator: string,
    address: string,
  ) => {
    try {
      const { data } =
        await client.CosmosDistributionV1Beta1.query.queryDelegationRewards(
          address,
          operator,
        )
      return data as V1Beta1QueryDelegationRewardsResponse
    } catch (e) {
      if (!(e instanceof AxiosError && e?.response?.status === 404)) {
        throw e
      }
      return {} as V1Beta1QueryDelegationRewardsResponse
    }
  }

  const getAccountDelegations = async (operator: string, address: string) => {
    try {
      const { data } = await client.CosmosStakingV1Beta1.query.queryDelegation(
        operator,
        address,
      )
      return data?.delegation_response as V1Beta1DelegationResponse
    } catch (e) {
      if (!(e instanceof AxiosError && e?.response?.status === 404)) {
        throw e
      }
      return {} as V1Beta1DelegationResponse
    }
  }

  return {
    getAccountBalanceByAddress,
    getAccountByAddress,
    getAccountDelegations,
    getAccountRewardsValidator,
  }
}
