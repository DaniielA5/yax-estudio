'use client'

import { useState } from 'react'
import { ESTADOS } from './estados'
import CompartirButton from './compartir-button'
import CambiarEstadoButton from './cambiar-estado-button'

type Props = {
  cotizaciones: any[]
}

export default function CotizacionesList({ cotizaciones }: Props) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

  return (
    <ul className="space-y-3">
      {cotizaciones.map((cot: any) => {
        const estado =
          ESTADOS[cot.estado as keyof typeof ESTADOS] || ESTADOS.cotizado

        const fechaFormateada = new Date(
          cot.created_at
        ).toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })

        return (
          <li
            key={cot.id}
            className="relative rounded-xl p-5 border transition-colors"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-caption"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    #{cot.id}
                  </span>

                  <span
                    className="text-caption px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: estado.bg,
                      color: estado.color,
                      borderColor: estado.border,
                    }}
                  >
                    {estado.label}
                  </span>
                </div>

                <h3
                  className="text-h2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {cot.clientes?.nombre || 'Sin cliente'}
                </h3>

                {cot.clientes?.empresa && (
                  <p
                    className="text-body"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {cot.clientes.empresa}
                  </p>
                )}

                <div className="flex gap-4 mt-3 text-caption flex-wrap">
                  <span style={{ color: 'var(--text-muted)' }}>
                    {cot.items_cotizacion?.length || 0}{' '}
                    {cot.items_cotizacion?.length === 1 ? 'item' : 'items'}
                  </span>

                  <span style={{ color: 'var(--text-muted)' }}>
                    Creada: {fechaFormateada}
                  </span>

                  {cot.fecha_entrega_prometida && (
                    <span
                      style={{ color: 'var(--semantic-warning)' }}
                    >
                      Entrega:{' '}
                      {new Date(
                        cot.fecha_entrega_prometida
                      ).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}

                  {Number(cot.anticipo) > 0 && (
                    <span
                      style={{ color: 'var(--semantic-success)' }}
                    >
                      Anticipo: ${Number(cot.anticipo).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

                <div className="text-right shrink-0">
                    <p
                  className="text-2xl font-bold"
                  style={{ color: 'var(--accent)' }}
                >
                  ${Number(cot.total).toFixed(2)}
                </p>

                <div className="mt-2 flex flex-col gap-1 items-end">
                  <CompartirButton
                    slug={cot.slug}
                    clienteNombre={cot.clientes?.nombre || 'cliente'}
                    total={Number(cot.total)}
                    isOpen={openDropdownId === cot.id}
                    onToggle={() =>
                      setOpenDropdownId(
                        openDropdownId === cot.id ? null : cot.id
                      )
                    }
                  />

                  <CambiarEstadoButton
                    cotizacionId={cot.id}
                    estadoActual={cot.estado}
                  />
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}