"use client"
import { useContext } from "react"
import { HamburgerIcon } from "../../icons"
import { ExportContext, RichedItem } from "../../contexts/export"
import { DataScroller } from "./data-scroller"


export default function RightList() {
  const { mode, include, exclude, handleUnselect } = useContext(ExportContext)

  return (
    <div className="flex-1 border rounded-lg p-4">
      {mode === "exclusive" ? (
        <div
          id="scrollableRightList"
          style={{
            height: "400px",
            overflow: "auto",
          }}
        >
          <DataScroller
            id="scrollableRightList"
            filter={item => !exclude.some(ui => ui.id === item.id)}
            renderItem={(item) => (
              <SelectedColumnItem key={item.id} item={item} onRemove={handleUnselect} />
            )}
          />
        </div >
      ) : (
        <div className="space-y-2">
          {include.map((item) => (
            <SelectedColumnItem key={item.id} item={item} onRemove={handleUnselect} />
          ))}
        </div>
      )}
    </div>
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