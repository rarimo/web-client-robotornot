import { Box, Tab, Tabs } from '@mui/material'
import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ContentBox, ContentSection, ValidatorList } from '@/components'
import {
  useLoading,
  useTablePagination,
  useTabsFilter,
  useValidators,
} from '@/hooks'
import { GetValidatorBaseQuery, ValidatorListColumnIds } from '@/types'

enum Filters {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

const FILTERS_MAP = {
  [Filters.ACTIVE]: 0,
  [Filters.INACTIVE]: 1,
  [Filters.ALL]: 2,
}

const ValidatorSection = () => {
  const { t } = useTranslation()
  const { getValidatorList, getValidatorCount } = useValidators()

  const {
    limit,
    offset,
    handleChangePage,
    handleChangeRowsPerPage,
    order,
    orderBy,
    setSort,
    setOffset,
  } = useTablePagination<
    ValidatorListColumnIds.VOTING_POWER | ValidatorListColumnIds.COMMISSION
  >()

  const {
    data: validatorCount,
    isLoading: isLoadingValidatorCount,
    isLoadingError: isLoadingValidatorCountError,
    reload: reloadCount,
  } = useLoading<number>(0, () => getValidatorCount(filters))

  const {
    data: result,
    isLoading,
    isLoadingError,
    reload: reloadList,
  } = useLoading<GetValidatorBaseQuery>(
    {} as GetValidatorBaseQuery,
    () => getValidatorList({ limit, offset, order, orderBy, ...filters }),
    { loadArgs: [limit, offset] },
  )

  const { filter, handleFilterChange } = useTabsFilter({
    queryKey: 'status',
    defaultValue: FILTERS_MAP[Filters.ACTIVE],
    handler: async () => {
      setOffset(0)
      await reloadCount()
      await reloadList()
    },
  })

  const filters = useMemo(
    () =>
      ({
        [FILTERS_MAP[Filters.ACTIVE]]: {
          jailed: false,
          status: BondStatus.BOND_STATUS_BONDED,
        },
        [FILTERS_MAP[Filters.INACTIVE]]: {
          jailed: true,
          status: -1,
        },
        [FILTERS_MAP[Filters.ALL]]: {},
      }[filter]),

    [filter],
  )

  const tabs = [
    {
      label: t('validator-section.active-filter-lbl'),
      value: FILTERS_MAP[Filters.ACTIVE],
    },
    {
      label: t('validator-section.inactive-filter-lbl'),
      value: FILTERS_MAP[Filters.INACTIVE],
    },
    {
      label: t('validator-section.all-filter-lbl'),
      value: FILTERS_MAP[Filters.ALL],
    },
  ]

  useEffect(() => {
    reloadList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, order])

  return (
    <ContentSection withBackButton title={t('validator-section.title')}>
      <ContentBox>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            aria-label={t('validator-section.tabs-lbl')}
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        <ValidatorList
          isLoading={isLoading || isLoadingValidatorCount}
          isLoadingError={isLoadingError || isLoadingValidatorCountError}
          limit={limit}
          slashingParams={result?.slashing_params?.[0]}
          stakingPool={result?.staking_pool?.[0]}
          offset={offset}
          order={order}
          orderBy={orderBy}
          list={result?.validator}
          count={validatorCount}
          setSort={setSort}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </ContentBox>
    </ContentSection>
  )
}

export default ValidatorSection
