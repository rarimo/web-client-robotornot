import {
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'

import { NoDataTableRow } from '@/components/index'

type OverviewTableProps = {
  label?: string
  noDataMessage?: string
  isEmpty?: boolean
  isLoadingError?: boolean
  rows?: { head: string | JSX.Element; body: string | JSX.Element }[]
  children?: JSX.Element | JSX.Element[]
  sx?: SxProps
}

const OverviewTable = ({
  rows,
  children,
  label,
  noDataMessage,
  isEmpty,
  isLoadingError,
  sx,
}: OverviewTableProps) => {
  const content =
    children ||
    (!isEmpty && isLoadingError ? (
      <NoDataTableRow
        message={noDataMessage}
        colSpan={2}
        error={isLoadingError}
      />
    ) : (
      <>
        {rows?.map(({ head, body }, index) => (
          <TableRow key={index}>
            <TableCell
              sx={{
                width: { xs: 200, sm: 300 },
                minWidth: { xs: 200, sm: 'auto' },
              }}
              component='th'
              scope='row'
              variant='head'
            >
              {head}
            </TableCell>
            <TableCell>{body}</TableCell>
          </TableRow>
        ))}
      </>
    ))

  return (
    <TableContainer>
      <Table aria-label={label}>
        <TableBody
          sx={
            sx || {
              '& > tr:last-child td, & > tr:last-child th': {
                border: 0,
              },
            }
          }
        >
          {content}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OverviewTable
