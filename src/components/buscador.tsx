'use client'

import { useState, useEffect } from 'react'
import {
  useRouter,
  useSearchParams,
  usePathname,
} from 'next/navigation'

type Props = {
  placeholder?: string
}

export default function Buscador({
  placeholder = 'Buscar...',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
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

      router.push(`${pathname}?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [valor, pathname, router, searchParams])

  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 rounded-lg text-body w-full sm:w-64 input-base"
    />
  )
}