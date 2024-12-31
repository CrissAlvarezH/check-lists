"use client"
import { createContext, useState } from "react"
import { ListItem } from "../hooks/columns"


export type RichedItem = ListItem & {
  selected: boolean
}

export const ExportContext = createContext<{
  mode: "inclusive" | "exclusive"
  include: RichedItem[]
  exclude: RichedItem[]
  handleAllSelectedChange: (all: boolean) => void
  handleSelect: (item: RichedItem) => void
  handleUnselect: (item: RichedItem) => void
}>({
  mode: "inclusive",
  include: [],
  exclude: [],
  handleAllSelectedChange: () => { },
  handleSelect: () => { },
  handleUnselect: () => { },
})


export function ExportProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"inclusive" | "exclusive">("inclusive")
  const [include, setInclude] = useState<RichedItem[]>([])
  const [exclude, setExclude] = useState<RichedItem[]>([])

  const handleAllSelectedChange = (all: boolean) => {
    setMode(all ? "exclusive" : "inclusive")
    setInclude([])
    setExclude([])
  }

  const handleSelect = (item: RichedItem) => {
    if (mode === "inclusive") {
      setInclude([...include, item])
    } else {
      setExclude(exclude.filter(i => i.id !== item.id))
    }
  }

  const handleUnselect = (item: RichedItem) => {
    if (mode === "inclusive") {
      setInclude(include.filter(i => i.id !== item.id))
    } else {
      setExclude([...exclude, item])
    }
  }

  return (
    <ExportContext.Provider value={{
      mode,
      handleAllSelectedChange,
      handleSelect,
      handleUnselect,
      include,
      exclude
    }}>
      {children}
    </ExportContext.Provider>
  )
}
