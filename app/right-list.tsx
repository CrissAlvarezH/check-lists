"use client"
import { ListItem } from "@/app/left-list"
import { useState, useEffect, useContext } from "react"
import { HamburgerIcon } from "./icons"
import InfiniteScroll from "react-infinite-scroll-component"
import { ExportContext, RichedItem } from "./export"
import { useGetColumns } from "./hooks"


export default function RightList() {
  const { mode, selectedItems, unselectedItems, handleUnselect } = useContext(ExportContext)

  return (
    <div className="flex-1 border rounded-lg p-4">
      <div className="space-y-2">

        {mode === "exclusive" ? (
          <ListInfiniteScroll unselectedItems={unselectedItems} onRemove={handleUnselect} />
        ) : (
          selectedItems.map((item) => (
            <SelectedColumnItem key={item.id} item={item} onRemove={handleUnselect} />
          )))}
      </div>
    </div>
  )
}

function ListInfiniteScroll({ unselectedItems, onRemove }: { unselectedItems: RichedItem[], onRemove: (item: RichedItem) => void }) {
  const [allData, setAllData] = useState<RichedItem[]>([])
  const [filteredData, setFilteredData] = useState<RichedItem[]>([])

  const { data, error, hasNextPage, fetchNextPage } = useGetColumns()

  useEffect(() => {
    if (data) {
      setAllData(data.pages.flatMap(page => page.items).map((i: ListItem) => ({ ...i, selected: false })))
    }
  }, [data])

  useEffect(() => {
    if (unselectedItems.length > 0) {
      setFilteredData(allData.filter(i => !unselectedItems.some(ui => ui.id === i.id)))
    } else {
      setFilteredData(allData)
    }
  }, [unselectedItems, allData])

  useEffect(() => {
    // if the container is not scrollable, fetch more data to make it scrollable
    // and avoid stop working the infinite scroll
    const container = document.getElementById('scrollableRightList');
    if (container && container.scrollHeight <= container.clientHeight) {
      if (hasNextPage) fetchNextPage()
    }
  }, [filteredData, hasNextPage, fetchNextPage]);

  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>
  return (
    <div
      id="scrollableRightList"
      style={{
        height: "400px",
        overflow: "auto",
      }}
    >
      <InfiniteScroll
        hasMore={!!hasNextPage}
        next={() => fetchNextPage()}
        loader={<div className="text-center text-sm text-gray-500">Loading...</div>}
        dataLength={filteredData.length}
        endMessage={<div className="text-center text-sm text-gray-500">No more items</div>}
        scrollableTarget="scrollableRightList"
      >
        {filteredData.map((item: RichedItem) => (
          <SelectedColumnItem key={item.id} item={item} onRemove={onRemove} />
        ))}
      </InfiniteScroll>
    </div >
  )
}

function SelectedColumnItem({ item, onRemove }: { item: RichedItem, onRemove: (item: RichedItem) => void }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <div className="flex items-center gap-2">
        <HamburgerIcon />
        <span>{item.label}</span>
      </div>
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => onRemove(item)}>
        ×
      </button>
    </div>
  )
}