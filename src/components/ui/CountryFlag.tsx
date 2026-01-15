import { useEffect, useState } from 'react'
import { countriesApi } from '../../api'

interface CountryFlagProps {
  countryName: string | undefined
  className?: string
  showName?: boolean
}

export const CountryFlag = ({ countryName, className = '', showName = false }: CountryFlagProps) => {
  const [flagUrl, setFlagUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!countryName) {
      setLoading(false)
      return
    }

    const fetchFlag = async () => {
      setLoading(true)
      setError(false)
      
      try {
        const url = await countriesApi.getCountryFlagPng(countryName)
        if (url) {
          setFlagUrl(url)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching country flag:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchFlag()
  }, [countryName])

  if (!countryName) return null

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="w-6 h-4 bg-gray-200 animate-pulse rounded"></div>
        {showName && <span className="text-sm text-gray-400">Loading...</span>}
      </div>
    )
  }

  if (error || !flagUrl) {
    return showName ? (
      <span className="text-sm text-gray-600">{countryName}</span>
    ) : null
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img 
        src={flagUrl} 
        alt={`${countryName} flag`}
        className="w-6 h-4 object-cover rounded shadow-sm"
        onError={() => setError(true)}
      />
      {showName && <span className="text-sm text-gray-600">{countryName}</span>}
    </div>
  )
}
