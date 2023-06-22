import { CONFIG } from '@config'
import { ChangeEvent, useState } from 'react'

import { SortOrder } from '@/types'

export const useTablePagination = <T = unknown>(
  initialLimit: number = CONFIG.PAGE_LIMIT,
  initialOffset = 0,
) => {
  const [limit, setLimit] = useState<number>(initialLimit)
  const [offset, setOffset] = useState<number>(initialOffset)
  const [order, setOrder] = useState<SortOrder>('' as SortOrder)
  const [orderBy, setOrderBy] = useState<T>('' as T)

  const handleChangePage = (event: unknown, newPage: number) => {
    setOffset(newPage * limit)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(+event.target.value)
    setOffset(0)
  }

  const setSort = (sortOrderBy: T) => {
    const isAsc = orderBy === sortOrderBy && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(sortOrderBy)
  }

  return {
    limit,
    offset,
    order,
    orderBy,
    handleChangePage,
    handleChangeRowsPerPage,
    setSort,
    setOffset,
  }
}
