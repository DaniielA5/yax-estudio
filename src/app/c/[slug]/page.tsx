import { createSupabasePublicClient } from "@/lib/supabase-public";
import { notFound } from "next/navigation";
import AceptarButton from "./aceptar-button";
import EstadoInfo from "./estado-info";

const ESTADOS_LABEL = {
  cotizado: 'Cotización pendiente',
  aprobado: 'Cotización aprobada',
  en_produccion: 'En producción',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
} as const

export default async function CotizacionPublicaPaga({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createSupabasePublicClient()

  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .select(`
      *,
      clientes (nombre, empresa),
      items_cotizacion (
        *,
        productos (nombre, material, imagen_url),
        tecnicas_impresion (nombre, notas)
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !cotizacion) {
    notFound()
  }

  const fechaFormateada = new Date(cotizacion.created_at).toLocaleDateString(
    'es-MX',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )

  const estadoLabel =
    ESTADOS_LABEL[cotizacion.estado as keyof typeof ESTADOS_LABEL] ||
    cotizacion.estado

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div
          className="rounded-xl overflow-hidden border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Banner naranja con branding YAX */}
          <header
            className="px-6 py-7 text-center"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#ffffff' }}>
              YAX Studio
            </h1>
            <p className="text-caption" style={{ color: '#ffe4d0' }}>
              Personalización profesional
            </p>
          </header>

          {/* Info de cotización: número + fecha */}
          <section
            className="px-6 py-5 flex justify-between items-start border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div>
              <p className="text-label mb-1" style={{ color: 'var(--text-muted)' }}>
                Cotización
              </p>
              <p className="text-h1" style={{ color: 'var(--text-primary)' }}>
                #{cotizacion.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-label mb-1" style={{ color: 'var(--text-muted)' }}>
                Fecha
              </p>
              <p className="text-body" style={{ color: 'var(--text-primary)' }}>
                {fechaFormateada}
              </p>
            </div>
          </section>

          {/* Cliente */}
          <section
            className="px-6 py-5 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-label mb-1" style={{ color: 'var(--text-muted)' }}>
              Para
            </p>
            <p className="text-h2" style={{ color: 'var(--text-primary)' }}>
              {cotizacion.clientes?.nombre}
            </p>
            {cotizacion.clientes?.empresa && (
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                {cotizacion.clientes.empresa}
              </p>
            )}
            <div className="mt-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-caption"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {estadoLabel}
              </span>
            </div>
          </section>

          {/* Items */}
          <section
            className="px-6 py-5 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-label mb-3" style={{ color: 'var(--text-muted)' }}>
              Detalle
            </p>
            <div className="space-y-4">
              {cotizacion.items_cotizacion?.map((item: any) => (
                <div key={item.id}>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {item.productos?.imagen_url && (
                        <img
                          src={item.productos.imagen_url}
                          alt={item.productos.nombre}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border"
                          style={{ borderColor: 'var(--border-subtle)' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {item.productos?.nombre}
                        </p>
                        <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                          {item.tecnicas_impresion?.nombre}
                          {item.productos?.material && ` · ${item.productos.material}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ${Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-caption" style={{ color: 'var(--text-muted)' }}>
                    <span>Cant: {item.cantidad}</span>
                    {item.talla && <span>· Talla: {item.talla}</span>}
                    {item.color && <span>· Color: {item.color}</span>}
                    <span className="ml-auto">
                      ${Number(item.precio_unitario).toFixed(2)} c/u
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total — fondo cremita con acento */}
          <section
            className="px-6 py-5"
            style={{ backgroundColor: 'var(--accent-subtle)' }}
          >
            <div className="flex justify-between items-center">
              <span className="text-label" style={{ color: 'var(--accent-hover)' }}>
                Total
              </span>
              <span className="text-3xl font-bold" style={{ color: 'var(--accent-hover)' }}>
                ${Number(cotizacion.total).toFixed(2)}
              </span>
            </div>
            {cotizacion.notas && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: 'rgba(234, 88, 12, 0.2)' }}
              >
                <p className="text-label mb-1" style={{ color: 'var(--accent-hover)' }}>
                  Notas
                </p>
                <p className="text-body" style={{ color: 'var(--text-primary)' }}>
                  {cotizacion.notas}
                </p>
              </div>
            )}
          </section>

          {/* Acción según estado */}
          <section className="px-6 py-5">
            {cotizacion.estado === 'cotizado' ? (
              <AceptarButton slug={slug} estadoActual={cotizacion.estado} />
            ) : (
              <EstadoInfo estado={cotizacion.estado} />
            )}
          </section>

          {/* Footer */}
          <footer
            className="px-6 py-4 text-center border-t"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
              Cotización generada por YAX Studio
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}