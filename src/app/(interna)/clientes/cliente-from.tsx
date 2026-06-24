'use client'

import { useState } from 'react'
import { crearCliente, actualizarCliente } from './actions'

type Cliente = {
  id: number
  nombre: string
  telefono: string | null
  empresa: string | null
}

type Props = {
  cliente?: Cliente
  triggerLabel?: string
  triggerClassName?: string
}

export default function ClienteForm({ cliente, triggerLabel, triggerClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = !!cliente

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = isEditing
      ? await actualizarCliente(cliente!.id, formData)
      : await crearCliente(formData)

    if (result.error) {
      setError(result.error)
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
        className={
          triggerClassName ||
          'px-4 py-2 rounded-lg text-body font-medium btn-primary'
        }
      >
        {triggerLabel || '+ Nuevo cliente'}
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
          {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
        </h2>

        <form action={handleSubmit} className="space-y-3">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            defaultValue={cliente?.nombre || ''}
            required
            className="w-full p-3 rounded-lg text-body input-base"
          />
          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono"
            defaultValue={cliente?.telefono || ''}
            className="w-full p-3 rounded-lg text-body input-base"
          />
          <input
            name="empresa"
            type="text"
            placeholder="Empresa"
            defaultValue={cliente?.empresa || ''}
            className="w-full p-3 rounded-lg text-body input-base"
          />

          {error && (
            <p className="text-body" style={{ color: 'var(--semantic-danger)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 p-3 rounded-lg text-body btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 rounded-lg text-body font-medium disabled:opacity-50 btn-primary"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}