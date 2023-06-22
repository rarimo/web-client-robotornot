import { apolloClient } from '@/graphql'
import { Search, SearchQuery, SearchQueryVariables } from '@/types'

export const useSearch = () => {
  const loadSearchResults = async (value: string) => {
    const valueInt = Number(value)

    const { data } = await apolloClient.query<
      SearchQuery,
      SearchQueryVariables
    >({
      query: Search,
      fetchPolicy: 'network-only',
      variables: {
        valueStr: value,
        ...(Number.isNaN(valueInt) ? { valueInt: '0' } : { valueInt: value }),
      },
    })

    return data
  }

  return { loadSearchResults }
}
