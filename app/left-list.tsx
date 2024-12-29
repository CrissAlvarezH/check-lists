"use client"
import InfiniteScroll from "react-infinite-scroll-component"
import { useQuery } from "react-query"
import { useEffect, useState } from "react"
import { Search } from "./search"
import { RichedItem } from "./export"

type Props = {
  onAllSelectedChange: (all: boolean) => void
  selectedItems: RichedItem[]
  unselectedItems: RichedItem[]
  onSelect: (item: RichedItem) => void
  onUnselect: (item: RichedItem) => void
}

export default function LeftList({ onAllSelectedChange, selectedItems, unselectedItems, onSelect, onUnselect }: Props) {
  const [search, setSearch] = useState<string>("")
  const [allSelected, setAllSelected] = useState<boolean>(false)

  return (
    <div className="flex-1 border rounded-lg p-4">
      <Search search={search} setSearch={setSearch} />

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(t) => {
              setAllSelected(t.target.checked)
              onAllSelectedChange(t.target.checked)
            }}
            className="mr-2"
          />
          <span>Seleccionar todos</span>
        </label>

        <ListScroller
          allSelected={allSelected}
          onAllSelectedChange={onAllSelectedChange}
          onSelect={onSelect}
          onUnselect={onUnselect}
          selectedItems={selectedItems}
          unselectedItems={unselectedItems}
        />

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

type Data = {
  items: ListItem[]
  page: number
  totalPages: number
}

function ListScroller({ allSelected, onAllSelectedChange, onSelect, onUnselect, selectedItems, unselectedItems }: ListProps & Props) {
  const [allData, setAllData] = useState<RichedItem[]>([])
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
        const newItems: RichedItem[] = data.items.map((i: ListItem) => ({
          ...i,
          selected: allSelected
        }))
        setAllData([...allData, ...newItems])
      }
    }
  }, [data, isPreviousData])

  useEffect(() => {
    setAllData(allData.map(i => ({ ...i, selected: allSelected })))
  }, [allSelected])

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
        hasMore={page < data?.totalPages}
        next={() => {
          console.log("next page")
          setPage(page + 1)
        }}
        loader={<div className="text-center text-sm text-gray-500">Loading...</div>}
        dataLength={allData.length}
        endMessage={<div className="text-center text-sm text-gray-500">No more items</div>}
        scrollableTarget="scrollableLeftList"
      >
        {allData.map((item: RichedItem) => {
          let isSelected = undefined
          if (allSelected) {
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
                    onUnselect(item)
                  } else {
                    onSelect(item)
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