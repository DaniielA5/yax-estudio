'use client'

import { useState } from 'react'
import { cambiarEstadoCotizacion } from './actions'
import Modal from '@/components/modal'

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

    // Estados que requieren modal con datos extra o confirmación
    if (
      nuevoEstado === 'aprobado' ||
      nuevoEstado === 'en_produccion' ||
      nuevoEstado === 'cancelado'
    ) {
      setTransicionPendiente(nuevoEstado)
      return
    }

    // Estados sin confirmación: cotizado, entregado
    setTransicionPendiente(nuevoEstado)
    setTimeout(() => ejecutarCambio(), 0)
  }

  function cerrarModal() {
    setTransicionPendiente(null)
    setError('')
    setAnticipo('')
    setFechaEntrega('')
  }

  // Modal: Aprobar cotización (con anticipo opcional)
  if (transicionPendiente === 'aprobado') {
    return (
      <Modal 
        isOpen={true}
        title ="Aprobar cotizacion" 
        onClose = {cerrarModal}
        > 
        <div className="space-y-3">
          <div>
            <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
              Anticipo recibido (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={anticipo}
              onChange={(e) => setAnticipo(e.target.value)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-lg text-body input-base"
            />
            <p className="text-caption mt-1" style={{ color: 'var(--text-muted)' }}>
              Déjalo vacío si todavía no hay anticipo
            </p>
          </div>

          {error && (
            <p className="text-caption" style={{ color: 'var(--semantic-danger)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={cerrarModal}
              disabled={loading}
              className="flex-1 p-2.5 rounded-lg text-body disabled:opacity-50 btn-secondary"
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
              className="flex-1 p-2.5 rounded-lg text-body font-medium disabled:opacity-50 btn-primary"
            >
              {loading ? 'Guardando...' : 'Aprobar'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  // Modal: Pasar a producción (con fecha de entrega)
  if (transicionPendiente === 'en_produccion') {
    return (
      <Modal 
      isOpen = {true}
      title="Pasar a producción" 
      onClose={cerrarModal}>
        <div className="space-y-3">
          <div>
            <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
              Fecha prometida de entrega
            </label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full p-2.5 rounded-lg text-body input-base"
            />
          </div>

          {error && (
            <p className="text-caption" style={{ color: 'var(--semantic-danger)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={cerrarModal}
              disabled={loading}
              className="flex-1 p-2.5 rounded-lg text-body disabled:opacity-50 btn-secondary"
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
              className="flex-1 p-2.5 rounded-lg text-body font-medium disabled:opacity-50 btn-primary"
            >
              {loading ? 'Guardando...' : 'Iniciar producción'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  // Modal: Confirmar cancelación (NUEVO - destructivo)
  if (transicionPendiente === 'cancelado') {
    return (
      <Modal 
      isOpen= {true}
      title="¿Cancelar cotización?" 
      onClose={cerrarModal}>
        <div className="space-y-3">
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            La cotización pasará a estado{' '}
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              cancelado
            </span>
            . El cliente verá este estado si abre el link público.
          </p>

          {error && (
            <p className="text-caption" style={{ color: 'var(--semantic-danger)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={cerrarModal}
              disabled={loading}
              className="flex-1 p-2.5 rounded-lg text-body disabled:opacity-50 btn-secondary"
            >
              No cancelar
            </button>
            <button
              onClick={() => ejecutarCambio()}
              disabled={loading}
              className="flex-1 p-2.5 rounded-lg text-body font-medium disabled:opacity-50"
              style={{
                backgroundColor: 'var(--semantic-danger)',
                color: '#ffffff',
              }}
            >
              {loading ? 'Cancelando...' : 'Sí, cancelar'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  // Botón trigger cerrado
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-caption btn-ghost"
      >
        Cambiar estado →
      </button>
    )
  }

  // Menú flotante de selección de estado
  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className="text-caption btn-ghost mb-1 block"
        style={{ color: 'var(--text-muted)' }}
      >
        ✕ Cancelar
      </button>
      <div className="flex flex-col gap-1">
        {ESTADOS_DISPONIBLES.map((estado) => {
          const esEstadoActual = estado.value === estadoActual
          const esCancelar = estado.value === 'cancelado'

          return (
            <button
              key={estado.value}
              onClick={() => handleCambio(estado.value)}
              disabled={loading}
              className="text-caption px-2 py-1 rounded-lg transition-colors text-left disabled:opacity-50"
              style={{
                backgroundColor: esEstadoActual ? 'var(--accent-subtle)' : 'transparent',
                color: esEstadoActual
                  ? 'var(--accent)'
                  : esCancelar
                  ? 'var(--semantic-danger)'
                  : 'var(--text-secondary)',
                fontWeight: esEstadoActual ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!esEstadoActual) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'
                }
              }}
              onMouseLeave={(e) => {
                if (!esEstadoActual) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {esEstadoActual && '✓ '}
              {estado.label}
            </button>
          )
        })}
      </div>
    </>
  )
}

