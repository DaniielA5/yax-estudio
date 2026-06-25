'use client'

import { useState } from 'react'
import { crearTecnica, actualizarTecnica } from './actions'

type Tecnica = {
  id: number
  nombre: string
  costo_por_pieza: number
  minimo_piezas: number
  notas: string | null
  activo: boolean
}

type Props = {
  tecnica?: Tecnica
  triggerLabel?: string
  triggerClassName?: string
}

export default function TecnicaForm({ tecnica, triggerLabel, triggerClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = !!tecnica

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = isEditing
      ? await actualizarTecnica(tecnica!.id, formData)
      : await crearTecnica(formData)

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
        {triggerLabel || '+ Nueva técnica'}
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
          {isEditing ? 'Editar técnica' : 'Nueva técnica'}
        </h2>

        <form action={handleSubmit} className="space-y-3">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre (ej: DTF estándar, Serigrafía)"
            defaultValue={tecnica?.nombre || ''}
            required
            className="w-full p-3 rounded-lg text-body input-base"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
                Costo por pieza
              </label>
              <input
                name="costo_por_pieza"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={tecnica?.costo_por_pieza ?? 0}
                required
                className="w-full p-3 rounded-lg text-body input-base"
              />
              <p className="text-caption mt-1" style={{ color: 'var(--text-muted)' }}>
                0 si está incluido en el producto
              </p>
            </div>
            <div>
              <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
                Mínimo de piezas
              </label>
              <input
                name="minimo_piezas"
                type="number"
                step="1"
                min="1"
                placeholder="1"
                defaultValue={tecnica?.minimo_piezas ?? 1}
                required
                className="w-full p-3 rounded-lg text-body input-base"
              />
            </div>
          </div>

          <textarea
            name="notas"
            placeholder="Notas internas (opcional)"
            defaultValue={tecnica?.notas || ''}
            rows={3}
            className="w-full p-3 rounded-lg text-body resize-none input-base"
          />

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