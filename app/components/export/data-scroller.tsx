import { ExportContext, RichedItem } from "@/app/contexts/export"
import InfiniteScroll from "react-infinite-scroll-component"
import { useContext, useEffect, useState } from "react"


export type DataScrollerProps = {
  id: string
  filter?: (item: RichedItem) => boolean
  renderItem: (
    item: RichedItem,
    onSelectChange: () => void
  ) => React.ReactNode
}

export function DataScroller({ id, filter, renderItem }: DataScrollerProps) {
  const [items, setItems] = useState<RichedItem[]>([])

  const {
    columns, error, isLoading, hasNextPage, mode, exclude, include,
    handleSelect, handleUnselect, fetchNextPage
  } = useContext(ExportContext)

  useEffect(() => {
    // filter using the function that is provided by params
    let items = filter ? columns.filter(filter) : columns
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
    // if the container is not scrollable, fetch more data to make it scrollable
    // and avoid stop working the infinite scroll
    const container = document.getElementById(id);
    if (container && container.scrollHeight <= container.clientHeight) {
      if (hasNextPage) fetchNextPage()
    }
  }, [items, hasNextPage, fetchNextPage]);


  if (isLoading) return <div className="text-center text-sm text-gray-500">Loading...</div>
  if (error) return <div className="text-center text-sm text-gray-500">Error</div>
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