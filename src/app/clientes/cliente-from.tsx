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
            'px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-medium'        }
      >
        {triggerLabel || '+ Nuevo cliente'}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-white">
          {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
        </h2>

        <form action={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            defaultValue={cliente?.nombre || ''}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono"
            defaultValue={cliente?.telefono || ''}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <input
            name="empresa"
            type="text"
            placeholder="Empresa"
            defaultValue={cliente?.empresa || ''}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
                className="flex-1 p-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg disabled:opacity-50 transition-colors font-medium"            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}