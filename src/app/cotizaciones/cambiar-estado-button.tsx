'use client'

import { useState } from 'react'
import { cambiarEstadoCotizacion } from './actions'

const ESTADOS_DISPONIBLES = [
  { value: 'cotizado', label: 'Cotizado' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'en_produccion', label: 'En producción' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

type Props = {
  cotizacionId: number
  estadoActual: string
}

export default function CambiarEstadoButton({ cotizacionId, estadoActual }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCambio(nuevoEstado: string) {
    if (nuevoEstado === estadoActual) {
      setIsOpen(false)
      return
    }
    setLoading(true)
    await cambiarEstadoCotizacion(cotizacionId, nuevoEstado)
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-gray-400 hover:text-white transition-colors"
      >
        Cambiar estado →
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors mb-1 block"
      >
        ✕ Cancelar
      </button>
      <div className="flex flex-col gap-1">
        {ESTADOS_DISPONIBLES.map((estado) => (
          <button
            key={estado.value}
            onClick={() => handleCambio(estado.value)}
            disabled={loading}
            className={`text-xs px-2 py-1 rounded-lg transition-colors text-left disabled:opacity-50 ${
              estado.value === estadoActual
                ? 'bg-orange-950 text-orange-300'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {estado.value === estadoActual && '✓ '}
            {estado.label}
          </button>
        ))}
      </div>
    </>
  )
}