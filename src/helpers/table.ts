import { TableColumn } from '@/types'

export const createColumnMap = <T extends string>(
  columns: readonly TableColumn<T>[],
) => {
  return columns.reduce((acc, column) => {
    acc[column.id] = column
    return acc
  }, {} as Record<T, TableColumn<T>>)
}
