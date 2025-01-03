"use client"
import { useContext, useEffect, useState } from "react"
import { HamburgerIcon } from "../../icons"
import { ExportContext, RichedItem } from "../../contexts/export"
import { DataScroller } from "./data-scroller"
import { Reorder } from "motion/react"


export default function RightList() {
  const { mode, include, handleUnselect } = useContext(ExportContext)

  return (
    <div className="flex-1 border rounded-lg p-4">
      {mode === "exclusive" ? (
        <div
          id="scrollableRightList"
          className="h-[400px] overflow-auto"
        >
          <DataScroller
            id="scrollableRightList"
            dragAndDrop
            onlySelected
            renderItem={(item) => (
              <SelectedColumnItem key={item.id} item={item} onRemove={handleUnselect} />
            )}
          />
        </div >
      ) : (
        <DragAndDropList
          items={include}
          renderItem={(item) => (
            <SelectedColumnItem key={item.id} item={item} onRemove={handleUnselect} />
          )}
        />
      )}
    </div>
  )
}

type DragAndDropListProps = {
  items: RichedItem[]
  renderItem: (item: RichedItem) => React.ReactNode
}

function DragAndDropList({ items, renderItem }: DragAndDropListProps) {
  const [ordered, setOrdered] = useState(items)

  useEffect(() => {
    if (ordered.length == items.length) return

    // add new ones
    let newOrdered = ordered.concat(items.filter(item => !ordered.some(i => i.id === item.id)))
    // remove removed ones
    newOrdered = newOrdered.filter(item => items.some(i => i.id === item.id))

    setOrdered(newOrdered)
  }, [items])

  return (
    <div className="space-y-2 h-[400px] overflow-auto">
      <Reorder.Group axis="y" values={ordered} onReorder={setOrdered}>
        {ordered.map((item) => {
          return (
            <Reorder.Item key={item.id} value={item}>
              {renderItem(item)}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
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