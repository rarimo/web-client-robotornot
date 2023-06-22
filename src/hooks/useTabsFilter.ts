import { SyntheticEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useTabsFilter = ({
  queryKey,
  handler,
  defaultValue,
}: {
  queryKey: string
  handler: () => Promise<void>
  defaultValue: number
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<number>(
    Number(searchParams.get(queryKey) ?? defaultValue),
  )
  const [prevFilter, setPrevFilter] = useState<number>(filter)

  const setQueryFilter = (filter: number) => {
    setSearchParams({ [queryKey]: `${filter}` })
  }

  const handleFilterChange = (event: SyntheticEvent, value: number) => {
    setQueryFilter(value)
    setFilter(value)
  }

  const applyFilter = async () => {
    await handler()
    setPrevFilter(filter)
  }

  useEffect(() => {
    if (prevFilter === filter) return
    applyFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, prevFilter])
  useEffect(() => {
    if (searchParams.get(queryKey)) return
    setQueryFilter(filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { filter, handleFilterChange }
}
