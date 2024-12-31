import { NextResponse } from 'next/server'

// Mock data - replace this with your actual data source
const items = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}`,
  text: `Item text ${i}`,
  label: `Label ${i}`
}))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '15')
  const search = searchParams.get('search') || ''

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  return NextResponse.json({
    items: paginatedItems,
    total: filteredItems.length,
    page,
    totalPages: Math.ceil(filteredItems.length / limit)
  })
} 