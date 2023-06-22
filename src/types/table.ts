import { SxProps } from '@mui/material'
import { ChangeEvent } from 'react'

export type TableColumn<T> = {
  id: T
  label: string
  minWidth?: number
  maxWidth?: number
  align?: 'right' | 'left' | 'center'
  sx?: SxProps
}

export interface TableListProps<T> {
  limit: number
  offset: number
  count: number
  list: T[]
  isLoading: boolean
  isLoadingError: boolean
  handleChangePage(event: unknown, newPage: number): void
  handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>): void
}
