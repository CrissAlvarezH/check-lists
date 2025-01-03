import { useInfiniteQuery } from "react-query"

export type ListItem = {
  id: string
  text: string
  label: string
}

export type Data = {
  items: ListItem[]
  page: number
  totalPages: number
}

export type UseGetColumnsProps = {
  search?: string
}

export const COLUMNS_PAGE_SIZE = 15

export function useGetColumns(filters?: UseGetColumnsProps) {

  const fetchColumns = (page: number) => {
    let url = '/api/items?page=' + page
    if (filters?.search) {
      url += '&search=' + filters.search
    }
    return fetch(url, { method: 'GET' }).then((res) => res.json())
  }

  const {
    refetch,
    error,
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<Data>(
    ['columns', filters?.search || ""],
    ({ pageParam = 1 }) => fetchColumns(pageParam),
    {
      getNextPageParam: (lastPage: Data) => {
        if (lastPage.page === lastPage.totalPages) {
          return undefined
        }
        return lastPage.page + 1
      },
      getPreviousPageParam: (firstPage: Data) => {
        if (firstPage.page <= 1) {
          return undefined
        }
        return firstPage.page - 1
      },
    }
  )

  return { error, data, isLoading, hasNextPage, fetchNextPage, refetch }
}
