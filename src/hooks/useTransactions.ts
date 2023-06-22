import { CONFIG } from '@config'

import { apolloClient } from '@/graphql'
import {
  GetTransactionBase,
  GetTransactionBaseQuery,
  GetTransactionByHash,
  GetTransactionByHashQuery,
  GetTransactionCount,
  GetTransactionCountQuery,
  GetTransactionList,
  GetTransactionListByBlock,
  GetTransactionListByBlockQuery,
  GetTransactionListQuery,
  PubKeyModel,
  TransactionFragment,
  TransactionListFragment,
} from '@/types'

const createWhereFilter = (sender?: PubKeyModel, operator?: string) => {
  const exp = { signer_infos: {}, block: {} }

  if (sender) {
    exp.signer_infos = {
      _cast: {
        String: {
          _regex: sender?.key,
        },
      },
    }
  }

  if (operator) {
    exp.block = {
      validator: { validator_info: { operator_address: { _eq: operator } } },
    }
  }

  return exp
}

export const useTransactions = () => {
  const getLatestTxAndBlocks = async (
    limit = 5,
    offset = 0,
  ): Promise<GetTransactionBaseQuery> => {
    const { data } = await apolloClient.query<GetTransactionBaseQuery>({
      query: GetTransactionBase,
      fetchPolicy: 'network-only',
      variables: { limit, offset },
    })
    return data ?? {}
  }

  const getTransactionsList = async ({
    limit = CONFIG.PAGE_LIMIT,
    offset = 0,
    operator,
    sender,
  }: {
    limit?: number
    offset?: number
    sender?: PubKeyModel
    operator?: string
  }): Promise<TransactionListFragment[]> => {
    const { data } = await apolloClient.query<GetTransactionListQuery>({
      query: GetTransactionList,
      fetchPolicy: 'network-only',
      variables: {
        limit,
        offset,
        where: createWhereFilter(sender, operator),
      },
    })
    return data?.transaction ?? []
  }

  const getTransactionsListByBlock = async (
    limit: number = CONFIG.PAGE_LIMIT,
    offset = 0,
    blockHeight?: number | bigint,
  ): Promise<TransactionListFragment[]> => {
    const { data } = await apolloClient.query<GetTransactionListByBlockQuery>({
      query: GetTransactionListByBlock,
      fetchPolicy: 'network-only',
      variables: {
        limit,
        offset,
        blockHeight,
      },
    })
    return data?.transaction ?? []
  }

  const getTransactionCount = async (args?: {
    sender?: PubKeyModel
    operator?: string
  }): Promise<number> => {
    const { sender, operator } = args ?? {}
    const { data } = await apolloClient.query<GetTransactionCountQuery>({
      query: GetTransactionCount,
      fetchPolicy: 'network-only',
      variables: { where: createWhereFilter(sender, operator) },
    })

    return data?.transaction_aggregate.aggregate?.count ?? 0
  }

  const getTransactionByHash = async (
    hash: string,
  ): Promise<TransactionFragment> => {
    const { data } = await apolloClient.query<GetTransactionByHashQuery>({
      query: GetTransactionByHash,
      fetchPolicy: 'network-only',
      variables: { hash: hash },
    })

    return data?.transaction[0] ?? []
  }

  return {
    getLatestTxAndBlocks,
    getTransactionsList,
    getTransactionCount,
    getTransactionByHash,
    getTransactionsListByBlock,
  }
}
