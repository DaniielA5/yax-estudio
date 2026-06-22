import { createSupabaseServerClient } from "@/lib/supabase-server";

type Estadisticas = {
  pendientes_cotizado: number
  pendientes_urgentes: number
  aprobadas_sin_producir: number
  en_produccion_count: number
  en_produccion_piezas: number
  total_pendiente_cobrar: number
  entregado_30_dias: number
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const [statsRes, urgentesRes] = await Promise.all([
    supabase.rpc('obtener_estadisticas_dashboard'),
    supabase
      .from('cotizaciones')
      .select('id, slug, total, created_at, estado, clientes (nombre, empresa)')
      .eq('estado', 'cotizado')
      .order('created_at', { ascending: true })
      .limit(5),
  ])

  if (statsRes.error) {
    return (
      <div
        className="p-4 border rounded-lg"
        style={{
          backgroundColor: 'var(--semantic-danger-bg)',
          borderColor: 'var(--semantic-danger)',
          color: 'var(--semantic-danger)',
        }}
      >
        <p>Error: {statsRes.error.message}</p>
      </div>
    )
  }

  const stats = statsRes.data as Estadisticas
  const urgentes = urgentesRes.data || []

  return (
    <>
      <div className="mb-8">
        <h1 className="text-display" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
          Estado de YAX Studio
        </p>
      </div>

      {/* Fila 1 — Acción inmediata */}
      <section className="mb-6">
        <h2 className="text-label mb-3" style={{ color: 'var(--text-muted)' }}>
          Acción inmediata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tarjeta
            titulo="Pendientes de respuesta"
            valor={stats.pendientes_cotizado}
            detalle={
              stats.pendientes_urgentes > 0
                ? `${stats.pendientes_urgentes} con más de 5 días`
                : 'Sin urgentes'
            }
            alerta={stats.pendientes_urgentes > 0}
            href="/cotizaciones"
          />
          <Tarjeta
            titulo="Por empezar a producir"
            valor={stats.aprobadas_sin_producir}
            detalle="Aprobadas, listas para arrancar"
            href="/cotizaciones"
          />
          <Tarjeta
            titulo="En producción"
            valor={stats.en_produccion_count}
            detalle={`${stats.en_produccion_piezas} piezas totales`}
            href="/cotizaciones"
          />
        </div>
      </section>

      {/* Fila 2 — Vista de negocio */}
      <section className="mb-10">
        <h2 className="text-label mb-3" style={{ color: 'var(--text-muted)' }}>
          Vista de negocio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TarjetaDinero
            titulo="Pendiente de cobrar"
            valor={stats.total_pendiente_cobrar}
            detalle="Aprobadas + en producción"
          />
          <TarjetaDinero
            titulo="Entregado últimos 30 días"
            valor={stats.entregado_30_dias}
            detalle="Histórico reciente"
          />
        </div>
      </section>

      {/* Cotizaciones urgentes */}
      {urgentes.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-label" style={{ color: 'var(--text-muted)' }}>
              Cotizaciones más antiguas pendientes
            </h2>
            <a
              href="/cotizaciones"
              className="text-caption transition-colors hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
            >
              Ver todas →
            </a>
          </div>
          <ul className="space-y-2">
            {urgentes.map((cot: any) => {
              const diasDesde = Math.floor(
                (Date.now() - new Date(cot.created_at).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
              const esUrgente = diasDesde >= 5

              return (
                <li
                  key={cot.id}
                  className="rounded-xl p-4 border transition-colors hover:opacity-95"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {cot.clientes?.nombre}
                        {cot.clientes?.empresa && (
                          <span className="font-normal" style={{ color: 'var(--text-muted)' }}>
                            {' '}— {cot.clientes.empresa}
                          </span>
                        )}
                      </p>
                      <p className="text-caption mt-1" style={{ color: 'var(--text-muted)' }}>
                        Cotización #{cot.id} ·{' '}
                        <span style={{ color: esUrgente ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {diasDesde === 0
                            ? 'Hoy'
                            : diasDesde === 1
                            ? '1 día'
                            : `${diasDesde} días`}
                        </span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-body font-semibold" style={{ color: 'var(--accent)' }}>
                        ${Number(cot.total).toFixed(2)}
                      </p>
                      <a
                        href={`/c/${cot.slug}`}
                        target="_blank"
                        className="text-caption transition-colors hover:opacity-70"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Ver público →
                      </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}

// ===== Componentes auxiliares =====

type TarjetaProps = {
  titulo: string
  valor: number
  detalle: string
  alerta?: boolean
  href?: string
}

function Tarjeta({ titulo, valor, detalle, alerta, href }: TarjetaProps) {
  const contenido = (
    <div
      className="rounded-xl p-5 h-full transition-colors border"
      style={{
        backgroundColor: alerta ? 'var(--accent-subtle)' : 'var(--bg-card)',
        borderColor: alerta ? 'var(--accent)' : 'var(--border-subtle)',
      }}
    >
      <p className="text-label mb-2" style={{ color: 'var(--text-muted)' }}>
        {titulo}
      </p>
      <p
        className="text-4xl font-bold mb-1"
        style={{ color: alerta ? 'var(--accent)' : 'var(--text-primary)' }}
      >
        {valor}
      </p>
      <p
        className="text-caption"
        style={{ color: alerta ? 'var(--accent)' : 'var(--text-muted)' }}
      >
        {detalle}
      </p>
    </div>
  )

  if (href) {
    return <a href={href}>{contenido}</a>
  }
  return contenido
}

type TarjetaDineroProps = {
  titulo: string
  valor: number
  detalle: string
}

function TarjetaDinero({ titulo, valor, detalle }: TarjetaDineroProps) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <p className="text-label mb-2" style={{ color: 'var(--text-muted)' }}>
        {titulo}
      </p>
      <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        ${valor.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
        {detalle}
      </p>
    </div>
  )
}