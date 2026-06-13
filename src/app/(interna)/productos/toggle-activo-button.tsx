'use client'

import { useState } from 'react'
import { toggleActivoProducto } from './actions'

type Props = {
    productoId: number
    activo:  boolean
}

export default function ToggleActivoButton({ productoId, activo }: Props) { 
    const [loading, setLoading] = useState(false)

    async function handleToggle() {
        setLoading(true)
        await toggleActivoProducto (productoId, activo)
        setLoading(false)
        
    }

    
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={
        activo
          ? 'px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50'
          : 'px-3 py-1.5 bg-orange-950 hover:bg-orange-900 text-orange-300 rounded-lg text-sm transition-colors border border-orange-900 disabled:opacity-50'
      }
    >
      {loading ? '...' : activo ? 'Desactivar' : 'Activar'}
    </button>
  )
}