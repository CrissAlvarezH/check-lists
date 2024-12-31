"use client"
import RightList from "./right-list"
import LeftList from "./left-list"
import { ExportProvider } from "@/app/contexts/export"


export function Export() {
  return (
    <ExportProvider>
      <div className="flex gap-4 p-4">
        <LeftList />

        <RightList />
      </div>
    </ExportProvider>
  )
}
