import LeftList, { ListItem } from "@/app/left-list"
import { useState } from "react"
import RightList from "./right-list"

export type RichedItem = ListItem & {
  selected: boolean
}

export function Export() {
  const [mode, setMode] = useState<"inclusive" | "exclusive">("inclusive")
  const [items, setItems] = useState<RichedItem[]>([])

  return (
    <div className="flex gap-4 p-4">
      <LeftList
        selectedItems={mode === "inclusive" ? items : []}
        unselectedItems={mode === "exclusive" ? items : []}
        onAllSelectedChange={(all) => {
          setMode(all ? "exclusive" : "inclusive")
          setItems([])
        }}
        onSelect={(item) => {
          if (mode === "inclusive") {
            setItems([...items, item])
          } else {
            setItems(items.filter(i => i.id !== item.id))
          }
        }}
        onUnselect={(item) => {
          if (mode === "inclusive") {
            setItems(items.filter(i => i.id !== item.id))
          } else {
            setItems([...items, item])
          }
        }}
      />

      <RightList
        infiniteScroll={mode === "exclusive"}
        unselectedItems={mode === "exclusive" ? items : []}
        items={items}
        onRemove={(item) => {
          if (mode === "inclusive") {
            setItems(items.filter(i => i.id !== item.id))
          } else {
            setItems([...items, item])
          }
        }}
      />
    </div>
  )
}

