import { TableCell } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  ContentWrapper,
  TableWithPagination,
  ValidatorRedelegationsListRow,
} from '@/components'
import {
  GetValidatorRedelegationListQuery,
  TableColumn,
  TableListProps,
  ValidatorBaseFragment,
  ValidatorRedelegation,
} from '@/types'

export enum ColumnIds {
  ADDRESS = 'address',
  TO = 'to',
  AMOUNT = 'amount',
  AGE = 'age',
}

const ValidatorRedelegationsList = ({
  data,
  limit,
  offset,
  isLoading,
  isLoadingError,
  handleChangePage,
  handleChangeRowsPerPage,
}: Omit<TableListProps<ValidatorBaseFragment>, 'count' | 'list'> & {
  data: GetValidatorRedelegationListQuery
}) => {
  const { t } = useTranslation()

  const columns: readonly TableColumn<ColumnIds>[] = [
    {
      id: ColumnIds.ADDRESS,
      label: t('validator-redelegations-list.address-col-lbl'),
      sx: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 150,
        maxWidth: 250,
      },
    },
    {
      id: ColumnIds.TO,
      label: t('validator-redelegations-list.to-col-lbl'),
      sx: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 150,
        maxWidth: 250,
      },
    },
    {
      id: ColumnIds.AMOUNT,
      label: t('validator-redelegations-list.amount-col-lbl'),
      sx: {
        minWidth: 100,
      },
    },
    {
      id: ColumnIds.AGE,
      label: t('validator-redelegations-list.age-col-lbl'),
      minWidth: 100,
    },
  ]

  const headCells = columns.map(column => (
    <TableCell key={column.id} align={column.align} sx={column.sx}>
      {column.label}
    </TableCell>
  ))

  const rows = (
    isLoading
      ? new Array(limit).fill({} as ValidatorRedelegation)
      : data?.action_validator_redelegations_from?.redelegations
  )?.map((row, idx) => (
    <ValidatorRedelegationsListRow
      columns={columns}
      delegation={row}
      isLoading={isLoading}
      key={idx}
    />
  ))

  return (
    <ContentWrapper>
      <TableWithPagination
        label={t('validator-redelegations-list.table-lbl')}
        noDataMessage={t('validator-redelegations-list.no-data-msg')}
        isLoadingError={isLoadingError}
        isLoading={isLoading}
        limit={limit}
        offset={offset}
        count={
          data?.action_validator_redelegations_from?.pagination?.total ?? 0
        }
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        headCells={headCells}
        rows={rows as JSX.Element[]}
      />
    </ContentWrapper>
  )
}

export default ValidatorRedelegationsList
