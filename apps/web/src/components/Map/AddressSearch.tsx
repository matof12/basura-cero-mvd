import { useState } from 'react'
import type { GeocodingResult } from '../../types'
import { search } from '../../services/geocodingService'
import styles from './AddressSearch.module.css'

interface AddressSearchProps {
  onSelect: (lat: number, lng: number, name: string) => void
}

export function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Ingresá una dirección para buscar.')
      setResults([])
      return
    }
    setError(null)
    setLoading(true)
    try {
      const items = await search(query.trim())
      setResults(items)

      if (items.length === 0) {
        setError('No se encontraron resultados.')
        return
      }

      if (items.length === 1) {
        handleSelect(items[0])
      }
    } catch (err) {
      setResults([])
      setError(err instanceof Error ? err.message : 'Error en la búsqueda')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.displayName)
    setResults([])
    setError(null)
    onSelect(result.lat, result.lng, result.displayName)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={styles.searchBox}>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar dirección..."
          aria-label="Buscar dirección"
        />
        {query && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Limpiar">
            ✕
          </button>
        )}
      </div>

      {loading && <p style={{ fontSize: '0.8rem', color: '#7a8c7a' }}>Buscando...</p>}
      {error   && <p style={{ fontSize: '0.8rem', color: '#dc2626' }}>{error}</p>}

      {results.length > 0 && (
        <div className={styles.results}>
          {results.map((result) => (
            <button
              key={`${result.lat}-${result.lng}`}
              className={styles.resultItem}
              onClick={() => handleSelect(result)}
            >
              <strong className={styles.resultName}>
                {result.address || result.displayName.split(',')[0]}
              </strong>
              {result.displayName.split(',').slice(1, 3).join(',')}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}