import { ExportContext, RichedItem } from "@/app/contexts/export"
import InfiniteScroll from "react-infinite-scroll-component"
import { useContext, useEffect, useState } from "react"
import { useGetColumns } from "@/app/hooks/columns"


export type DataScrollerProps = {
  id: string
  search?: string
  filter?: (item: RichedItem) => boolean
  renderItem: (
    item: RichedItem,
    onSelectChange: () => void
  ) => React.ReactNode
}

export function DataScroller({ id, search, filter, renderItem }: DataScrollerProps) {
  const [items, setItems] = useState<RichedItem[]>([])

  const { mode, exclude, include, handleSelect, handleUnselect } = useContext(ExportContext)
  const { data: columns, isLoading, error, hasNextPage, fetchNextPage } = useGetColumns({ search })

  useEffect(() => {
    // transform the columns to a list of items with selected with default false
    // because this value is set later with the mode and the selected logic
    let items = columns?.pages.flatMap(page => page.items).map(item => ({ ...item, selected: false })) ?? []

    // filter using the function that is provided by params
    items = filter ? items.filter(filter) : items
    // add selected property to the items
    items = items.map(item => {
      let selected = false
      if (mode === "exclusive") {
        selected = !exclude.some(i => i.id === item.id)
      } else {
        selected = include.some(i => i.id === item.id)
      }
      return { ...item, selected }
    })
    setItems(items)
  }, [columns, mode, exclude, include, filter])

  useEffect(() => {
    // it does not apply when the user is searching because the height of the container 
    // vary with each new search
    if (search) return

    // if the container is not scrollable, fetch more data to make it scrollable
    // and avoid stop working the infinite scroll
    const container = document.getElementById(id);
    if (container && container.scrollHeight <= container.clientHeight) {
      if (hasNextPage) fetchNextPage()
    }
  }, [items, hasNextPage, fetchNextPage]);


  if (isLoading) return <div className="text-center text-sm text-gray-500">Loading...</div>
  if (error) return <div className="text-center text-sm text-gray-500">Error</div>
  if (items.length === 0) return <div className="text-center text-sm text-gray-500">No items</div>
  return (
    <InfiniteScroll
      hasMore={!!hasNextPage}
      next={() => fetchNextPage()}
      loader={<div className="text-center text-sm text-gray-500">Loading...</div>}
      dataLength={items.length}
      endMessage={<div className="text-center text-sm text-gray-500">No more items</div>}
      scrollableTarget={id}
    >
      {items.map((item: RichedItem) => {
        const onSelectChange = () => {
          if (item.selected) {
            handleUnselect(item)
          } else {
            handleSelect(item)
          }
        }

        return renderItem(item, onSelectChange)
      })}
    </InfiniteScroll>
  )
}