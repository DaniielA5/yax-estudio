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
      <div
        className="rounded-xl p-6 text-center border"
        style={{
          backgroundColor: 'var(--semantic-success-bg)',
          borderColor: 'var(--semantic-success)',
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl"
          style={{
            backgroundColor: 'var(--semantic-success)',
            color: '#ffffff',
          }}
        >
          ✓
        </div>
        <h3 className="text-h2 mb-1" style={{ color: 'var(--semantic-success)' }}>
          ¡Cotización aprobada!
        </h3>
        <p className="text-body" style={{ color: 'var(--semantic-success)' }}>
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
      <div
        className="rounded-xl p-5 space-y-4 border"
        style={{
          backgroundColor: 'var(--accent-subtle)',
          borderColor: 'var(--accent)',
        }}
      >
        <div>
          <h3 className="text-h2 mb-1" style={{ color: 'var(--text-primary)' }}>
            ¿Confirmar cotización?
          </h3>
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            Al aceptar, YAX Studio se pondrá en contacto contigo para coordinar
            pago y producción.
          </p>
        </div>

        {error && (
          <div
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: 'var(--semantic-danger-bg)',
              borderColor: 'var(--semantic-danger)',
            }}
          >
            <p className="text-body" style={{ color: 'var(--semantic-danger)' }}>
              {error}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setConfirmando(false)
              setError('')
            }}
            disabled={loading}
            className="flex-1 p-3 rounded-lg text-body disabled:opacity-50 btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleAprobar}
            disabled={loading}
            className="flex-1 p-3 rounded-lg text-body font-semibold disabled:opacity-50 btn-primary"
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
      className="w-full p-4 rounded-xl font-semibold text-lg btn-primary"
    >
      Aceptar cotización
    </button>
  )
}