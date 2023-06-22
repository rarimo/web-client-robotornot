import { useParams } from 'react-router-dom'

import {
  PageContainer,
  ValidatorBlocksSection,
  ValidatorDelegationsSection,
  ValidatorDetailsSection,
  ValidatorTransactionsSection,
} from '@/components'
import {
  useLoading,
  useTablePagination,
  useTabsFilter,
  useValidators,
} from '@/hooks'
import {
  GetValidatorByAddressQuery,
  GetValidatorDelegationListQuery,
  GetValidatorRedelegationListQuery,
  GetValidatorUnbondingDelegationListQuery,
} from '@/types'

export enum Filters {
  DELEGATIONS = 'delegations',
  REDELEGATIONS = 'redelegations',
  UNBONDING = 'unbonding',
}

export const FILTERS_MAP = {
  [Filters.DELEGATIONS]: 0,
  [Filters.REDELEGATIONS]: 1,
  [Filters.UNBONDING]: 2,
}

const Validator = () => {
  const { address: operator } = useParams()
  const { getValidatorByAddress } = useValidators()

  const { data, isLoading, isLoadingError, isEmpty } =
    useLoading<GetValidatorByAddressQuery>(
      {} as GetValidatorByAddressQuery,
      () => getValidatorByAddress(operator as string),
    )

  const {
    getValidatorDelegationsList,
    getValidatorRedelegationsList,
    getValidatorUnbondingDelegationsList,
  } = useValidators()

  const {
    limit,
    offset,
    handleChangePage,
    handleChangeRowsPerPage,
    setOffset,
  } = useTablePagination()

  const { filter, handleFilterChange } = useTabsFilter({
    queryKey: 'delegation_type',
    defaultValue: FILTERS_MAP[Filters.DELEGATIONS],
    handler: async () => {
      setOffset(0)
      await reload()
    },
  })

  const {
    data: delegations,
    isLoading: isLoadingDelegationsLoading,
    isLoadingError: isLoadingDelegationsError,
    reload,
  } = useLoading<
    | GetValidatorDelegationListQuery
    | GetValidatorRedelegationListQuery
    | GetValidatorUnbondingDelegationListQuery
  >(
    {} as GetValidatorDelegationListQuery,
    () =>
      ({
        [FILTERS_MAP[Filters.DELEGATIONS]]: () =>
          getValidatorDelegationsList({
            operator: operator as string,
            limit,
            offset,
          }),
        [FILTERS_MAP[Filters.REDELEGATIONS]]: () =>
          getValidatorRedelegationsList({
            operator: operator as string,
            limit,
            offset,
          }),
        [FILTERS_MAP[Filters.UNBONDING]]: () =>
          getValidatorUnbondingDelegationsList({
            operator: operator as string,
            limit,
            offset,
          }),
      }[filter]()),

    { loadArgs: [limit, offset] },
  )

  return (
    <PageContainer>
      <ValidatorDetailsSection
        validator={data?.validator?.[0]}
        bondedTokens={data?.staking_pool?.[0]?.bonded_tokens}
        isLoading={isLoading}
        isLoadingError={isLoadingError}
        isEmpty={isEmpty}
        reload={reload}
      />
      <ValidatorDelegationsSection
        data={delegations}
        filter={filter}
        limit={limit}
        offset={offset}
        isLoading={isLoadingDelegationsLoading}
        isLoadingError={isLoadingDelegationsError}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleFilterChange={handleFilterChange}
      />
      <ValidatorTransactionsSection operator={operator} />
      <ValidatorBlocksSection operator={operator} />
    </PageContainer>
  )
}
export default Validator
