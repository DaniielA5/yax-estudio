'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Buscador() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [valor, setValor] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (valor) {
        params.set('q', valor)
      } else {
        params.delete('q')
      }
      router.push(`/cotizaciones?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [valor])

  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      placeholder="Buscar por cliente o ID..."
    className="px-3 py-2 rounded-lg text-body w-64 input-base"
      />
  )
}
