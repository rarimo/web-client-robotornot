import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { ChangeEvent } from 'react'

import { NoDataTableRow } from '@/components/index'

const tableHeight = { xs: 'calc(var(--vh) * 50)' }

interface TableWithPaginationProps {
  label: string
  rows: JSX.Element[]
  headCells: JSX.Element[]
  noDataMessage?: string
  isLoadingError: boolean
  isLoading: boolean
  minHeighted?: boolean
  limit: number
  offset: number
  count: number
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void
}

function TableWithPagination({
  label,
  headCells,
  rows,
  noDataMessage,
  isLoadingError,
  minHeighted = true,
  isLoading,
  limit,
  offset,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}: TableWithPaginationProps) {
  return (
    <>
      <TableContainer
        sx={{
          maxHeight: tableHeight,
          ...(minHeighted ? { minHeight: tableHeight } : {}),
        }}
      >
        <Table stickyHeader aria-label={label}>
          <TableHead>
            <TableRow>{headCells}</TableRow>
          </TableHead>
          <TableBody>
            {rows}
            {!isLoading && (!rows?.length || isLoadingError) && (
              <NoDataTableRow
                message={noDataMessage}
                colSpan={headCells?.length}
                error={isLoadingError}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        rowsPerPage={limit}
        page={offset / limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        count={count}
      />
    </>
  )
}

export default TableWithPagination
