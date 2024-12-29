

import { useState, useEffect } from 'react'

interface UseApiRequestProps {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  dependencies?: any[]
}

interface ApiResponse<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export function useApiRequest<T>({ url, method = 'GET', body, dependencies = [] }: UseApiRequestProps): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          ...(body && { body: JSON.stringify(body) }),
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [...dependencies])

  return { data, error, loading }
}
