import { useInfiniteQuery } from "react-query"
import { ListItem } from "./left-list"

export type Data = {
  items: ListItem[]
  page: number
  totalPages: number
}

export function useGetColumns() {
  const fetchColumns = (page: number) => fetch('/api/items?page=' + page, { method: 'GET' }).then((res) => res.json())

  const {
    error,
    data,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<Data>(
    ['columns'],
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

  return { error, data, hasNextPage, fetchNextPage }
}
