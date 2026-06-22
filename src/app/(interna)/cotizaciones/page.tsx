import { createSupabaseServerClient } from '@/lib/supabase-server'
import CambiarEstadoButton from './cambiar-estado-button'
import CompartirButton from './compartir-button'
import Buscador from './buscador'

const ESTADOS = {
  cotizado: {
    label: 'Cotizado',
    bg: 'var(--semantic-pending-bg)',
    color: 'var(--semantic-pending)',
    border: 'var(--border-subtle)',
  },
  aprobado: {
    label: 'Aprobado',
    bg: 'var(--semantic-progress-bg)',
    color: 'var(--semantic-progress)',
    border: 'var(--semantic-progress)',
  },
  en_produccion: {
    label: 'En producción',
    bg: 'var(--semantic-warning-bg)',
    color: 'var(--semantic-warning)',
    border: 'var(--semantic-warning)',
  },
  entregado: {
    label: 'Entregado',
    bg: 'var(--semantic-success-bg)',
    color: 'var(--semantic-success)',
    border: 'var(--semantic-success)',
  },
  cancelado: {
    label: 'Cancelado',
    bg: 'var(--semantic-danger-bg)',
    color: 'var(--semantic-danger)',
    border: 'var(--semantic-danger)',
  },
} as const

export default async function CotizacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createSupabaseServerClient()
  const { q } = await searchParams

  let query = supabase
    .from('cotizaciones')
    .select(`
      *,
      clientes (nombre, empresa),
      items_cotizacion (id)
    `)
    .order('created_at', { ascending: false })

  if (q) {
    const idBusqueda = Number(q)
    if (!isNaN(idBusqueda)) {
      query = query.eq('id', idBusqueda)
    }
  }

  const { data: cotizaciones, error } = await query

  const cotizacionesFiltered = cotizaciones && q && isNaN(Number(q))
    ? cotizaciones.filter((c: any) =>
        c.clientes?.nombre?.toLowerCase().includes(q.toLowerCase()) ||
        c.clientes?.empresa?.toLowerCase().includes(q.toLowerCase())
      )
    : cotizaciones

  if (error) {
    return (
      <div
        className="p-4 border rounded-lg"
        style={{
          backgroundColor: 'var(--semantic-danger-bg)',
          borderColor: 'var(--semantic-danger)',
          color: 'var(--semantic-danger)',
        }}
      >
        <p>Error: {error.message}</p>
      </div>
    )
  }

  if (!cotizaciones) {
    return null
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display" style={{ color: 'var(--text-primary)' }}>
            Cotizaciones
          </h1>
          <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
            {cotizacionesFiltered?.length || 0} {(cotizacionesFiltered?.length === 1) ? 'cotización' : 'cotizaciones'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Buscador />
          <a
            href="/cotizaciones/nueva"
  className="px-4 py-2 rounded-lg text-body font-medium btn-primary"
>
  + Nueva cotización
</a>
        </div>
      </div>

      {cotizacionesFiltered?.length === 0 ? (
        <EstadoVacio />
      ) : (
        <ul className="space-y-3">
          {cotizacionesFiltered?.map((cot: any) => {
            const estado = ESTADOS[cot.estado as keyof typeof ESTADOS] || ESTADOS.cotizado
            const fechaFormateada = new Date(cot.created_at).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            return (
              <li
                key={cot.id}
                className="rounded-xl p-5 border transition-colors"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
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
                    <h3 className="text-h2" style={{ color: 'var(--text-primary)' }}>
                      {cot.clientes?.nombre || 'Sin cliente'}
                    </h3>
                    {cot.clientes?.empresa && (
                      <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                        {cot.clientes.empresa}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-caption flex-wrap">
                      <span style={{ color: 'var(--text-muted)' }}>
                        {cot.items_cotizacion?.length || 0} {cot.items_cotizacion?.length === 1 ? 'item' : 'items'}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Creada: {fechaFormateada}
                      </span>
                      {cot.fecha_entrega_prometida && (
                        <span style={{ color: 'var(--semantic-warning)' }}>
                          Entrega: {new Date(cot.fecha_entrega_prometida).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {Number(cot.anticipo) > 0 && (
                        <span style={{ color: 'var(--semantic-success)' }}>
                          Anticipo: ${Number(cot.anticipo).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                      ${Number(cot.total).toFixed(2)}
                    </p>
                    <div className="mt-2 flex flex-col gap-1 items-end">
                      <CompartirButton
                        slug={cot.slug}
                        clienteNombre={cot.clientes?.nombre || 'cliente'}
                        total={Number(cot.total)}
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
      )}
    </>
  )
}

function EstadoVacio() {
  return (
    <div
      className="text-center py-16 border-2 border-dashed rounded-xl"
      style={{ borderColor: 'var(--border-strong)' }}
    >
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: 'var(--bg-subtle)' }}
      >
        📋
      </div>
      
      <h2 className="text-h1 mb-2" style={{ color: 'var(--text-primary)' }}>
        Aún no tienes cotizaciones
      </h2>
      <p className="text-body mb-4" style={{ color: 'var(--text-secondary)' }}>
        Crea tu primera cotización para empezar a llevar control.
      </p>
      <a
      href="/cotizaciones/nueva"
  className="inline-block px-4 py-2 rounded-lg text-body font-medium btn-primary"
>
  + Nueva cotización
</a>
    </div>
  )
}