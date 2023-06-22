import { apolloClient } from '@/graphql'
import { GetParams, GetParamsQuery } from '@/types'

export const useParams = () => {
  const getParams = async (): Promise<GetParamsQuery> => {
    const { data } = await apolloClient.query<GetParamsQuery>({
      query: GetParams,
      fetchPolicy: 'network-only',
    })
    return data ?? []
  }

  return { getParams }
}
