import LeftList, { ListItem } from "@/app/left-list"
import { useState, createContext } from "react"
import RightList from "./right-list"

export type RichedItem = ListItem & {
  selected: boolean
}

export const ExportContext = createContext<{
  mode: "inclusive" | "exclusive"
  selectedItems: RichedItem[]
  unselectedItems: RichedItem[]
  handleAllSelectedChange: (all: boolean) => void
  handleSelect: (item: RichedItem) => void
  handleUnselect: (item: RichedItem) => void
}>({
  mode: "inclusive",
  selectedItems: [],
  unselectedItems: [],
  handleAllSelectedChange: () => { },
  handleSelect: () => { },
  handleUnselect: () => { },
})

export function Export() {
  const [mode, setMode] = useState<"inclusive" | "exclusive">("inclusive")
  const [selectedItems, setSelectedItems] = useState<RichedItem[]>([])
  const [unselectedItems, setUnselectedItems] = useState<RichedItem[]>([])

  const handleAllSelectedChange = (all: boolean) => {
    setMode(all ? "exclusive" : "inclusive")
    setSelectedItems([])
    setUnselectedItems([])
  }

  const handleSelect = (item: RichedItem) => {
    if (mode === "inclusive") {
      setSelectedItems([...selectedItems, item])
    } else {
      setUnselectedItems([...unselectedItems, item])
    }
  }

  // TODO: fix on remove, it is not working
  const handleUnselect = (item: RichedItem) => {
    if (mode === "inclusive") {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id))
    } else {
      setUnselectedItems(unselectedItems.filter(i => i.id !== item.id))
    }
  }

  return (
    <ExportContext.Provider value={{ mode, handleAllSelectedChange, handleSelect, handleUnselect, selectedItems, unselectedItems }}>
      <div className="flex gap-4 p-4">
        <LeftList />

        <RightList />
      </div>
    </ExportContext.Provider>
  )
}

