'use client'

import { use, useState } from "react"
import { eliminarCliente } from "./actions"

type Props = {
    clienteId: number
    clienteNombre: string
}

export default function EliminarClienteButton({clienteId, clienteNombre}:Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] =  useState(false)
    const [error, setError] = useState('')
    
    async function handleDelete() {
        setLoading(true)
        setError('')

        const resultado = await eliminarCliente(clienteId)
        if(resultado.error) { 
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
            className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 hover:text-red-200 rounded-lg text-sm transition-colors border border-red-900"      >
        Eliminar
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-white">¿Eliminar cliente?</h2>
        <p className="text-gray-300">
          Vas a eliminar a <span className="font-bold">{clienteNombre}</span>. Esta acción no se puede deshacer.
        </p>

        {error && (
          <div className="p-3 bg-red-950 border border-red-800 rounded-lg">
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
            disabled={loading}
            className="flex-1 p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 p-3 bg-red-700 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}