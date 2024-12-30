"use client"
import InfiniteScroll from "react-infinite-scroll-component"
import { useEffect, useState, useContext } from "react"
import { Search } from "./search"
import { ExportContext, RichedItem } from "./export"
import { useGetColumns } from "./hooks"


export default function LeftList() {
  const [search, setSearch] = useState<string>("")

  const { mode, handleAllSelectedChange} = useContext(ExportContext)

  return (
    <div className="flex-1 border rounded-lg p-4">
      <Search search={search} setSearch={setSearch} />

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={mode === "exclusive"}
            onChange={(t) => {
              handleAllSelectedChange(t.target.checked)
            }}
            className="mr-2"
          />
          <span>Seleccionar todos</span>
        </label>

        <ListScroller />

      </div>
    </div>
  )
}

type ListProps = {
  allSelected: boolean
}

export type ListItem = {
  id: string
  text: string
  label: string
}


function ListScroller() {
  const [allData, setAllData] = useState<RichedItem[]>([])
  const { error, data, hasNextPage, fetchNextPage } = useGetColumns()

  const { mode, unselectedItems, selectedItems, handleSelect, handleUnselect } = useContext(ExportContext)

  useEffect(() => {
    // each time a new page is added, it transform the items and add it to allData
    if (data) {
      setAllData(data.pages.flatMap(page => page.items).map((i: ListItem) => ({ ...i, selected: false })))
    }
  }, [data])

  useEffect(() => {
    setAllData(allData.map(i => ({ ...i, selected: mode === "exclusive" })))
  }, [mode])

  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>
  return (
    <div
      id="scrollableLeftList"
      style={{
        height: "400px",
        overflow: "auto",
      }}
    >
      <InfiniteScroll
        hasMore={!!hasNextPage}
        next={() => fetchNextPage()}
        loader={<div className="text-center text-sm text-gray-500">Loading...</div>}
        dataLength={allData.length}
        endMessage={<div className="text-center text-sm text-gray-500">No more items</div>}
        scrollableTarget="scrollableLeftList"
      >
        {allData.map((item: RichedItem) => {
          let isSelected = undefined
          if (mode === "exclusive") {
            isSelected = !unselectedItems.some(i => i.id === item.id)
          } else {
            isSelected = selectedItems.some(i => i.id === item.id)
          }

          return (
            <label key={item.id} className="flex py-2 items-center">
              <input type="checkbox"
                checked={isSelected}
                onChange={() => {
                  if (isSelected) {
                    handleUnselect(item)
                  } else {
                    handleSelect(item)
                  }
                }}
                className="mr-2" />
              <span>{item.label}</span>
            </label>
          )
        })}
      </InfiniteScroll>
    </div >
  )
}
