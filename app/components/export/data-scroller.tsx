import { ExportContext, RichedItem } from "@/app/contexts/export"
import InfiniteScroll from "react-infinite-scroll-component"
import { useContext, useEffect, useState } from "react"
import { useGetColumns } from "@/app/hooks/columns"
import { Reorder } from "motion/react"
import { COLUMNS_PAGE_SIZE } from "@/app/hooks/columns"


export type DataScrollerProps = {
  id: string
  dragAndDrop?: boolean
  search?: string
  onlySelected?: boolean
  renderItem: (
    item: RichedItem,
    onSelectChange: () => void
  ) => React.ReactNode
}


export function DataScroller({ id, search, onlySelected = false, dragAndDrop = false, renderItem }: DataScrollerProps) {
  const [items, setItems] = useState<RichedItem[]>([])

  const { mode, exclude, include, handleSelect, handleUnselect } = useContext(ExportContext)
  const { data: columns, isLoading, error, hasNextPage, fetchNextPage } = useGetColumns({ search })

  useEffect(() => {
    if (!columns) return

    // items is a cache for the data to be ordered, filtered and transformed, every new page
    // fetched by useGetColumns hook will be added (it's a must not to overide to not lose the order)
    let newItems = items

    // get new items from the new pages and add them to the items array
    const lastPage = Math.ceil(newItems.length / COLUMNS_PAGE_SIZE)
    if (lastPage < (columns.pages.length ?? 0)) {
      const newPages = columns.pages.slice(lastPage) || []
      newItems.push(...newPages.flatMap(page => page.items.map(item => ({ ...item, selected: false }))))
    }

    // add selected property to the items
    newItems = newItems.map(item => {
      let selected = false
      if (mode === "exclusive") {
        selected = !exclude.some(i => i.id === item.id)
      } else {
        selected = include.some(i => i.id === item.id)
      }
      return { ...item, selected }
    })
    setItems(newItems)
  }, [columns, mode, exclude, include])

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

  const onSelectChange = (item: RichedItem) => {
    if (item.selected) {
      handleUnselect(item)
    } else {
      handleSelect(item)
    }
  }

  const itemsToRender = onlySelected ? items.filter(item => item.selected) : items
  return (
    <InfiniteScroll
      hasMore={!!hasNextPage}
      next={() => fetchNextPage()}
      loader={<div className="text-center text-sm text-gray-500">Loading...</div>}
      dataLength={itemsToRender.length}
      endMessage={<div className="text-center text-sm text-gray-500">No more items</div>}
      scrollableTarget={id}
    >
      {dragAndDrop ? (
        <Reorder.Group axis="y" values={itemsToRender} onReorder={setItems}>
          {itemsToRender.map((item: RichedItem) => {
            return (
              <Reorder.Item key={item.id} value={item}>
                {renderItem(item, () => onSelectChange(item))}
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      ) : (
        <>
          {itemsToRender.map((item: RichedItem) => {
            return renderItem(item, () => onSelectChange(item))
          })}
        </>
      )}
    </InfiniteScroll>
  )
}
