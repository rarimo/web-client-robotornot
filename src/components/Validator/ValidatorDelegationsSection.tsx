import { Box, Tab, Tabs } from '@mui/material'
import { ChangeEvent, SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ContentBox,
  ContentSection,
  ValidatorDelegationsList,
  ValidatorRedelegationsList,
  ValidatorUnbondingDelegationsList,
} from '@/components'
import { Filters, FILTERS_MAP } from '@/pages/Validator'
import {
  GetValidatorDelegationListQuery,
  GetValidatorRedelegationListQuery,
  GetValidatorUnbondingDelegationListQuery,
} from '@/types'

type ValidatorDelegationsSectionProps = {
  data:
    | GetValidatorDelegationListQuery
    | GetValidatorRedelegationListQuery
    | GetValidatorUnbondingDelegationListQuery
  filter: number
  limit: number
  offset: number
  isLoading: boolean
  isLoadingError: boolean
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void
  handleFilterChange: (event: SyntheticEvent, newValue: number) => void
}

const ValidatorDelegationsSection = ({
  data,
  filter,
  limit,
  offset,
  isLoading,
  isLoadingError,
  handleChangePage,
  handleChangeRowsPerPage,
  handleFilterChange,
}: ValidatorDelegationsSectionProps) => {
  const { t } = useTranslation()

  const tabs = [
    {
      label: t('validator-delegations-section.delegations-lbl'),
      value: FILTERS_MAP[Filters.DELEGATIONS],
    },
    {
      label: t('validator-delegations-section.redelegations-lbl'),
      value: FILTERS_MAP[Filters.REDELEGATIONS],
    },
    {
      label: t('validator-delegations-section.unbondings-lbl'),
      value: FILTERS_MAP[Filters.UNBONDING],
    },
  ]

  const listComponent = {
    [FILTERS_MAP[Filters.DELEGATIONS]]: (
      <ValidatorDelegationsList
        isLoading={isLoading}
        isLoadingError={isLoadingError}
        limit={limit}
        offset={offset}
        data={data}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    ),
    [FILTERS_MAP[Filters.REDELEGATIONS]]: (
      <ValidatorRedelegationsList
        isLoading={isLoading}
        isLoadingError={isLoadingError}
        limit={limit}
        offset={offset}
        data={data}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    ),
    [FILTERS_MAP[Filters.UNBONDING]]: (
      <ValidatorUnbondingDelegationsList
        isLoading={isLoading}
        isLoadingError={isLoadingError}
        limit={limit}
        offset={offset}
        data={data}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    ),
  }

  return (
    <ContentSection title={t('validator-delegations-section.title-lbl')}>
      <ContentBox>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            aria-label={t('validator-delegations-section.tabs-lbl')}
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {listComponent[filter]}
      </ContentBox>
    </ContentSection>
  )
}

export default ValidatorDelegationsSection
