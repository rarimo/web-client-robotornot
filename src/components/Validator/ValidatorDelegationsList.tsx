import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentWrapper,
  TableWithPagination,
  ValidatorDelegationsListRow,
} from '@/components'
import {
  GetValidatorDelegationListQuery,
  TableColumn,
  TableListProps,
  ValidatorBaseFragment,
  ValidatorDelegation,
} from '@/types'

export enum ColumnIds {
  ADDRESS = 'address',
  AMOUNT = 'amount',
}

const ValidatorDelegationsList = ({
  data,
  limit,
  offset,
  isLoading,
  isLoadingError,
  handleChangePage,
  handleChangeRowsPerPage,
}: Omit<TableListProps<ValidatorBaseFragment>, 'count' | 'list'> & {
  data: GetValidatorDelegationListQuery
}) => {
  const { t } = useTranslation()

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.ADDRESS,
      label: t('validator-delegations-list.address-col-lbl'),
      sx: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 150,
        maxWidth: 250,
      },
    },
    {
      id: ColumnIds.AMOUNT,
      label: t('validator-delegations-list.amount-col-lbl'),
      sx: {
        minWidth: 100,
      },
    },
  ]

  const headCells = columns.map(column => (
    <TableCell key={column.id} align={column.align} sx={column.sx}>
      {column.label}
    </TableCell>
  ))

  const rows = (
    isLoading
      ? new Array(limit).fill({} as ValidatorDelegation)
      : data?.action_validator_delegations?.delegations
  )?.map((row, idx) => (
    <ValidatorDelegationsListRow
      columns={columns}
      delegation={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('validator-delegations-list.table-lbl')}
        noDataMessage={t('validator-delegations-list.no-data-msg')}
        isLoadingError={isLoadingError}
        isLoading={isLoading}
        limit={limit}
        offset={offset}
        count={data?.action_validator_delegations?.pagination?.total ?? 0}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        headCells={headCells}
        rows={rows as JSX.Element[]}
      />
    </ContentWrapper>
  )
}

export default ValidatorDelegationsList
