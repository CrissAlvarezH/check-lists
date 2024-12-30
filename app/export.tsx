import LeftList, { ListItem } from "@/app/left-list"
import { useState } from "react"
import RightList from "./right-list"

export type RichedItem = ListItem & {
  selected: boolean
}

export function Export() {
  const [mode, setMode] = useState<"inclusive" | "exclusive">("inclusive")
  const [selectedItems, setSelectedItems] = useState<RichedItem[]>([])
  const [unselectedItems, setUnselectedItems] = useState<RichedItem[]>([])

  return (
    <div className="flex gap-4 p-4">
      <LeftList
        selectedItems={selectedItems}
        unselectedItems={unselectedItems}
        onAllSelectedChange={(all) => {
          setMode(all ? "exclusive" : "inclusive")
          setSelectedItems([])
          setUnselectedItems([])
        }}
        onSelect={(item) => {
          if (mode === "inclusive") {
            setSelectedItems([...selectedItems, item])
          } else {
            setUnselectedItems(unselectedItems.filter(i => i.id !== item.id))
          }
        }}
        onUnselect={(item) => {
          if (mode === "inclusive") {
            setSelectedItems(selectedItems.filter(i => i.id !== item.id))
          } else {
            setUnselectedItems([...unselectedItems, item])
          }
        }}
      />

      <RightList
        infiniteScroll={mode === "exclusive"}
        unselectedItems={unselectedItems}
        items={selectedItems}
        onRemove={(item) => {
          if (mode === "inclusive") {
            setSelectedItems(selectedItems.filter(i => i.id !== item.id))
          } else {
            setUnselectedItems([...unselectedItems, item])
          }
        }}
      />
    </div>
  )
}

