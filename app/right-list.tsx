"use client"
import { ListItem } from "@/app/left-list"
import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { HamburgerIcon } from "./icons"
import InfiniteScroll from "react-infinite-scroll-component"
import { RichedItem } from "./export"

type Props = {
  infiniteScroll: boolean
  unselectedItems: RichedItem[]
  items: RichedItem[]
  onRemove: (item: RichedItem) => void
}

export default function RightList({ infiniteScroll, items, unselectedItems, onRemove }: Props) {
  return (
    <div className="flex-1 border rounded-lg p-4">
      <div className="space-y-2">

        {infiniteScroll ? (
          <ListInfiniteScroll items={items} unselectedItems={unselectedItems} onRemove={onRemove} />
        ) : (

          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
          )))}
      </div>
    </div>
  )
}

function ListInfiniteScroll({ items, unselectedItems, onRemove }: { items: RichedItem[], unselectedItems: RichedItem[], onRemove: (item: RichedItem) => void }) {
  const [allData, setAllData] = useState<RichedItem[]>([])
  const [filteredData, setFilteredData] = useState<RichedItem[]>([])
  const [page, setPage] = useState(1)

  const fetchProjects = (page = 0) => fetch('/api/items?page=' + page, { method: 'GET' }).then((res) => res.json())

  const {
    error,
    data,
    isPreviousData,
  } = useQuery(['items', page], () => fetchProjects(page), { keepPreviousData: true })

  useEffect(() => {
    if (data) {
      console.log("last page", page, "data.page", data.page)
      if (!isPreviousData) {
        setAllData([...allData, ...data.items])
      }
    }
  }, [data, isPreviousData])

  useEffect(() => {
    if (unselectedItems.length > 0) {
      setFilteredData(allData.filter(i => !unselectedItems.some(ui => ui.id === i.id)))
    } else {
      setFilteredData(allData)
    }
  }, [unselectedItems, allData])

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
        hasMore={page < data?.totalPages}
        next={() => {
          console.log("next page")
          setPage(page + 1)
        }}
        loader={<div className="text-center text-sm text-gray-500">Loading...</div>}
        dataLength={filteredData.length}
        endMessage={<div className="text-center text-sm text-gray-500">No more items</div>}
        scrollableTarget="scrollableRightList"
      >
        {filteredData.map((item: RichedItem) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
        ))}
      </InfiniteScroll>
    </div >
  )
}