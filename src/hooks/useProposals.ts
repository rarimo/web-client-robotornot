import { CONFIG } from '@config'

import { apolloClient } from '@/graphql'
import {
  GetProposalBase,
  GetProposalBaseQuery,
  GetProposalById,
  GetProposalByIdQuery,
  GetProposalCollection,
  GetProposalCollectionQuery,
  GetProposalCount,
  GetProposalCountQuery,
  GetProposalDepositsById,
  GetProposalDepositsByIdQuery,
  GetProposalDepositsCountById,
  GetProposalDepositsCountByIdQuery,
  GetProposalVotesById,
  GetProposalVotesByIdQuery,
  GetProposalVotesCountById,
  GetProposalVotesCountByIdQuery,
  ProposalBaseFragment,
  ProposalDepositFragment,
  ProposalFragment,
  ProposalVoteFragment,
} from '@/types'
import { client } from '@/utils'

export const useProposals = () => {
  const getDepositMinAmount = async (): Promise<string> => {
    const {
      data: { deposit_params: depositParams },
    } = await client.CosmosGovV1Beta1.query.queryParams('deposit')
    return (
      depositParams?.min_deposit?.find(i => i?.denom === CONFIG.DENOM)
        ?.amount ?? '0'
    )
  }

  const getProposalList = async (
    limit: number = CONFIG.PAGE_LIMIT,
    offset = 0,
  ): Promise<ProposalBaseFragment[]> => {
    const { data } = await apolloClient.query<GetProposalBaseQuery>({
      query: GetProposalBase,
      fetchPolicy: 'network-only',
      variables: { limit, offset },
    })

    return data?.proposal ?? []
  }

  const getProposalCount = async (): Promise<number> => {
    const { data } = await apolloClient.query<GetProposalCountQuery>({
      query: GetProposalCount,
      fetchPolicy: 'network-only',
    })

    return data?.proposal_aggregate.aggregate?.count ?? 0
  }

  const getProposalByID = async (id: string): Promise<ProposalFragment> => {
    const { data } = await apolloClient.query<GetProposalByIdQuery>({
      query: GetProposalById,
      fetchPolicy: 'network-only',
      variables: { id: Number(id) },
    })

    return data?.proposal[0]
  }

  const getProposalDepositsListByID = async (
    id: string,
    limit: number = CONFIG.PAGE_LIMIT,
    offset = 0,
  ): Promise<ProposalDepositFragment[]> => {
    const { data } = await apolloClient.query<GetProposalDepositsByIdQuery>({
      query: GetProposalDepositsById,
      fetchPolicy: 'network-only',
      variables: { id: Number(id), limit, offset },
    })

    return data?.proposal?.[0].proposal_deposits ?? []
  }

  const getProposalDepositsCountByID = async (id: string): Promise<number> => {
    const { data } =
      await apolloClient.query<GetProposalDepositsCountByIdQuery>({
        query: GetProposalDepositsCountById,
        fetchPolicy: 'network-only',
        variables: { id: Number(id) },
      })

    return (
      data?.proposal?.[0]?.proposal_deposits_aggregate.aggregate?.count ?? 0
    )
  }

  const getProposalVotesListByID = async (
    id: string,
    limit: number = CONFIG.PAGE_LIMIT,
    offset = 0,
  ): Promise<ProposalVoteFragment[]> => {
    const { data } = await apolloClient.query<GetProposalVotesByIdQuery>({
      query: GetProposalVotesById,
      fetchPolicy: 'network-only',
      variables: { id: Number(id), limit, offset },
    })

    return data?.proposal?.[0].proposal_votes ?? []
  }

  const getProposalVotesCountByID = async (id: string): Promise<number> => {
    const { data } = await apolloClient.query<GetProposalVotesCountByIdQuery>({
      query: GetProposalVotesCountById,
      fetchPolicy: 'network-only',
      variables: { id: Number(id) },
    })

    return data?.proposal?.[0]?.proposal_votes_aggregate.aggregate?.count ?? 0
  }

  const getProposalCollection =
    async (): Promise<GetProposalCollectionQuery> => {
      const { data } = await apolloClient.query<GetProposalCollectionQuery>({
        query: GetProposalCollection,
        fetchPolicy: 'network-only',
      })

      return data ?? []
    }

  return {
    getDepositMinAmount,
    getProposalList,
    getProposalCount,
    getProposalDepositsCountByID,
    getProposalByID,
    getProposalDepositsListByID,
    getProposalVotesListByID,
    getProposalVotesCountByID,
    getProposalCollection,
  }
}
