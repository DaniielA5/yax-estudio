'use client'

import { useState } from 'react'
import { cambiarEstadoCotizacion } from './actions'

const ESTADOS_DISPONIBLES = [
  { value: 'cotizado', label: 'Cotizado' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'en_produccion', label: 'En producción' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

type Props = {
  cotizacionId: number
  estadoActual: string
}

export default function CambiarEstadoButton({ cotizacionId, estadoActual }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [transicionPendiente, setTransicionPendiente] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [anticipo, setAnticipo] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')

  async function ejecutarCambio(extra: { anticipo?: number; fechaEntregaPrometida?: string } = {}) {
    if (!transicionPendiente) return
    setLoading(true)
    setError('')

    const result = await cambiarEstadoCotizacion({
      cotizacionId,
      nuevoEstado: transicionPendiente,
      ...extra,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setTransicionPendiente(null)
    setIsOpen(false)
    setAnticipo('')
    setFechaEntrega('')
  }

  function handleCambio(nuevoEstado: string) {
    if (nuevoEstado === estadoActual) {
      setIsOpen(false)
      return
    }

    if (nuevoEstado === 'aprobado' || nuevoEstado === 'en_produccion') {
      setTransicionPendiente(nuevoEstado)
      return
    }

    setTransicionPendiente(nuevoEstado)
    setTimeout(() => ejecutarCambio(), 0)
  }

  function cerrarModal() {
    setTransicionPendiente(null)
    setError('')
    setAnticipo('')
    setFechaEntrega('')
  }

  if (transicionPendiente === 'aprobado') {
    return (
      <Modal titulo="Aprobar cotización" onClose={cerrarModal}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Anticipo recibido (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={anticipo}
              onChange={(e) => setAnticipo(e.target.value)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Déjalo vacío si todavía no hay anticipo
            </p>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={cerrarModal}
              disabled={loading}
              className="flex-1 p-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                ejecutarCambio({
                  anticipo: anticipo ? Number(anticipo) : undefined,
                })
              }
              disabled={loading}
              className="flex-1 p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Aprobar'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  if (transicionPendiente === 'en_produccion') {
    return (
      <Modal titulo="Pasar a producción" onClose={cerrarModal}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Fecha prometida de entrega
            </label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={cerrarModal}
              disabled={loading}
              className="flex-1 p-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                ejecutarCambio({
                  fechaEntregaPrometida: fechaEntrega || undefined,
                })
              }
              disabled={loading}
              className="flex-1 p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Iniciar producción'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-gray-400 hover:text-white transition-colors"
      >
        Cambiar estado →
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors mb-1 block"
      >
        ✕ Cancelar
      </button>
      <div className="flex flex-col gap-1">
        {ESTADOS_DISPONIBLES.map((estado) => (
          <button
            key={estado.value}
            onClick={() => handleCambio(estado.value)}
            disabled={loading}
            className={`text-xs px-2 py-1 rounded-lg transition-colors text-left disabled:opacity-50 ${
              estado.value === estadoActual
                ? 'bg-orange-950 text-orange-300'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {estado.value === estadoActual && '✓ '}
            {estado.label}
          </button>
        ))}
      </div>
    </>
  )
}

function Modal({
  titulo,
  children,
  onClose,
}: {
  titulo: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl w-full max-w-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white">{titulo}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}