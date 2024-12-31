"use client"
import { useState, useContext, useEffect } from "react"
import { Search } from "../../search"
import { ExportContext } from "../../contexts/export"
import { DataScroller } from "./data-scroller"


export default function LeftList() {
  const { mode, exclude, handleAllSelectedChange } = useContext(ExportContext)

  const [search, setSearch] = useState<string>("")

  // this state is to show de all-selector unchecked when the mode is 'exclusive'
  // but the user has unselected some items, so the all-selector should be unchecked
  // but he mode should continue being 'exclusive'
  const [uiAllSelected, setUiAllSelected] = useState<boolean>(false)

  useEffect(() => {
    if (mode === "exclusive") {
      setUiAllSelected(exclude.length === 0)
    }
  }, [mode, exclude])

  return (
    <div className="flex-1 border rounded-lg p-4">
      <Search search={search} setSearch={setSearch} />

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={uiAllSelected && mode === "exclusive"}
            onChange={(t) => {
              handleAllSelectedChange(t.target.checked)
            }}
            className="mr-2"
          />
          <span>Seleccionar todos</span>
        </label>

        <div
          id="scrollableLeftList"
          style={{
            height: "400px",
            overflow: "auto",
          }}
        >
          <DataScroller
            id="scrollableLeftList"
            renderItem={(item, onSelectChange) => (
              <label key={item.id} className="flex py-2 items-center">
                <input type="checkbox"
                  checked={item.selected}
                  onChange={onSelectChange}
                  className="mr-2" />
                <span>{item.label}</span>
              </label>
            )}
          />
        </div >
      </div>
    </div>
  )
}
