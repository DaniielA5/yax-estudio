import { createSupabaseServerClient } from '@/lib/supabase-server'
import Buscador from '@/components/buscador'
import CotizacionesList from './cotizaciones-list'

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

  const cotizacionesFiltered =
    cotizaciones && q && isNaN(Number(q))
      ? cotizaciones.filter(
          (c: any) =>
            c.clientes?.nombre
              ?.toLowerCase()
              .includes(q.toLowerCase()) ||
            c.clientes?.empresa
              ?.toLowerCase()
              .includes(q.toLowerCase())
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
        Error: {error.message}
      </div>
    )
  }

  if (!cotizaciones) {
    return null
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-display"
            style={{ color: 'var(--text-primary)' }}
          >
            Cotizaciones
          </h1>

          <p
            className="text-body mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {cotizacionesFiltered?.length || 0}{' '}
            {cotizacionesFiltered?.length === 1
              ? 'cotización'
              : 'cotizaciones'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Buscador placeholder="Buscar por cliente o ID..." />

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
        <CotizacionesList
          cotizaciones={cotizacionesFiltered ?? []}
        />
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
        {/* conserva aquí el contenido que ya tenías */}
      </div>

      <h2
        className="text-h1 mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Aún no tienes cotizaciones
      </h2>

      <p
        className="text-body mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
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