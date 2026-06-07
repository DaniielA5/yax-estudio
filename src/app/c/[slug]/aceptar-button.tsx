'use client'

import { useState } from 'react'
import { aprobarCotizacionPublica } from './actions'

type Props = {
  slug: string
  estadoActual: string
}

export default function AceptarButton({ slug, estadoActual }: Props) {
  const [confirmando, setConfirmando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aprobado, setAprobado] = useState(false)

  if (estadoActual !== 'cotizado' && !aprobado) {
    return null
  }

  if (aprobado) {
    return (
      <div className="bg-green-950 border border-green-900 rounded-xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-900 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-green-300 mb-1">
          ¡Cotización aprobada!
        </h3>
        <p className="text-sm text-green-400">
          YAX Studio se pondrá en contacto contigo pronto para coordinar el pago
          y la producción.
        </p>
      </div>
    )
  }

  async function handleAprobar() {
    setLoading(true)
    setError('')

    const result = await aprobarCotizacionPublica(slug)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      setConfirmando(false)
      return
    }

    setAprobado(true)
    setConfirmando(false)
  }

  if (confirmando) {
    return (
      <div className="bg-gray-900 border border-orange-900 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-white mb-1">
            ¿Confirmar cotización?
          </h3>
          <p className="text-sm text-gray-400">
            Al aceptar, YAX Studio se pondrá en contacto contigo para coordinar
            pago y producción.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950 border border-red-900 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setConfirmando(false)
              setError('')
            }}
            disabled={loading}
            className="flex-1 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAprobar}
            disabled={loading}
            className="flex-1 p-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Sí, aceptar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="w-full p-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors text-lg"
    >
      Aceptar cotización
    </button>
  )
}