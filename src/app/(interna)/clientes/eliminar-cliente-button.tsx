'use client'

import { useState } from "react"
import { eliminarCliente } from "./actions"

type Props = {
  clienteId: number
  clienteNombre: string
}

export default function EliminarClienteButton({ clienteId, clienteNombre }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setLoading(true)
    setError('')

    const resultado = await eliminarCliente(clienteId)
    if (resultado.error) {
      setError(resultado.error)
      setLoading(false)
      return
    }

    setIsOpen(false)
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-lg text-caption btn-destructive"
      >
        Eliminar
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="rounded-xl w-full max-w-md p-6 space-y-4 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 className="text-h1" style={{ color: 'var(--text-primary)' }}>
          ¿Eliminar cliente?
        </h2>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Vas a eliminar a{' '}
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {clienteNombre}
          </span>
          . Esta acción no se puede deshacer.
        </p>

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

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setError('')
            }}
            disabled={loading}
            className="flex-1 p-3 rounded-lg text-body disabled:opacity-50 btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 p-3 rounded-lg text-body font-medium disabled:opacity-50"
            style={{
              backgroundColor: 'var(--semantic-danger)',
              color: '#ffffff',
            }}
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}