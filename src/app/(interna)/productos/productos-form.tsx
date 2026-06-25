'use client'

import { useState } from 'react'
import { crearProducto, actualizarProducto } from './actions'

type Producto = {
  id: number
  nombre: string
  costo_individual: number
  costo_mayoreo: number
  material: string | null
  activo: boolean
}

type Props = {
  producto?: Producto
  triggerLabel?: string
  triggerClassName?: string
}

export default function ProductoForm({ producto, triggerLabel, triggerClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = !!producto

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = isEditing
      ? await actualizarProducto(producto!.id, formData)
      : await crearProducto(formData)

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
        {triggerLabel || '+ Nuevo producto'}
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
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <form action={handleSubmit} className="space-y-3">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre del producto"
            defaultValue={producto?.nombre || ''}
            required
            className="w-full p-3 rounded-lg text-body input-base"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
                Costo individual (1-5 pzas)
              </label>
              <input
                name="costo_individual"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={producto?.costo_individual || ''}
                required
                className="w-full p-3 rounded-lg text-body input-base"
              />
            </div>
            <div>
              <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
                Costo mayoreo (6+ pzas)
              </label>
              <input
                name="costo_mayoreo"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={producto?.costo_mayoreo || ''}
                required
                className="w-full p-3 rounded-lg text-body input-base"
              />
            </div>
          </div>

          <input
            name="material"
            type="text"
            placeholder="Material (algodón, 50/50, etc.)"
            defaultValue={producto?.material || ''}
            className="w-full p-3 rounded-lg text-body input-base"
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