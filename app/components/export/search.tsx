
export function Search({ search, setSearch }: { search: string, setSearch: (search: string) => void }) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Buscar"
        className="w-full pl-8 pr-4 py-2 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <svg
        className="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}