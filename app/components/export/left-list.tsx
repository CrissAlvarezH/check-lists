"use client"
import { useState, useContext } from "react"
import { Search } from "../../search"
import { ExportContext } from "../../contexts/export"
import { DataScroller } from "./data-scroller"


export default function LeftList() {
  const [search, setSearch] = useState<string>("")

  const { mode, handleAllSelectedChange } = useContext(ExportContext)

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
