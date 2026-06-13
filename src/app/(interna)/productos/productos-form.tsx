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
          'px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-medium'
        }
      >
        {triggerLabel || '+ Nuevo producto'}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-white">
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <form action={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre del producto"
            defaultValue={producto?.nombre || ''}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
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
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
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
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <input
            name="material"
            type="text"
            placeholder="Material (algodón, 50/50, etc.)"
            defaultValue={producto?.material || ''}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
          />

          {error && (
            <div className="p-3 bg-red-950 border border-red-900 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setError('')
              }}
              className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}