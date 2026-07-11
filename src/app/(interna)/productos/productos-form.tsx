'use client'

import { useState } from 'react'
import { crearProducto, actualizarProducto } from './actions'
import Modal from "@/components/modal"

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



 return (
  <>
    <button
      onClick={() => setIsOpen(true)}
      className={
        triggerClassName ||
        'px-4 py-2 rounded-lg text-body font-medium btn-primary'
      }
    >
      {triggerLabel || '+ Nuevo producto'}
    </button>

    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
        setError('')
      }}
      title={isEditing ? 'Editar producto' : 'Nuevo producto'}
    >
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
            <label
              className="text-label block mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
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
            <label
              className="text-label block mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
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
            <p
              className="text-body"
              style={{ color: 'var(--semantic-danger)' }}
            >
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
    </Modal>
  </>
)
}