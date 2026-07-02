'use client'

import { useState } from 'react'
import { crearSesionAnticipo } from './actions'

type Props = {
  slug: string
  montoAnticipo: number
  resto: number
}

export default function PagarAnticipoButton({
  slug,
  montoAnticipo,
  resto,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePagar() {
    setLoading(true)
    setError('')

    const result = await crearSesionAnticipo(slug)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.url) {
      window.location.href = result.url
    }
  }

  return (
    <div className="space-y-4">
      {/* Desglose del pago */}
      <div
        className="rounded-xl p-5 border space-y-3"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
            Anticipo (50%)
          </span>
          <span className="text-h2" style={{ color: 'var(--accent)' }}>
            ${montoAnticipo.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            Resto al entregar
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            ${resto.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Error si algo truena */}
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

      {/* CTA de pago */}
      <button
        onClick={handlePagar}
        disabled={loading}
        className="w-full p-4 rounded-xl font-semibold text-lg disabled:opacity-50 btn-primary"
      >
        {loading ? 'Preparando pago...' : `Pagar anticipo $${montoAnticipo.toFixed(2)}`}
      </button>

      {/* Nota de seguridad */}
      <p className="text-caption text-center" style={{ color: 'var(--text-muted)' }}>
        Pago seguro procesado por Stripe · Aceptamos tarjeta de crédito y débito
      </p>
    </div>
  )
}