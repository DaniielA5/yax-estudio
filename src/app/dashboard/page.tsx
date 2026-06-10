import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "../clientes/logout-button";


type Estadisticas = {
    pendientes_cotizado: number
    pendientes_urgentes: number
    aprobadas_sin_producir: number
    en_produccion_count: number
    en_produccion_piezas: number
    total_pendiente_cobrar : number
    entregado_30_dias:number 
}

export default async function DashboardPage(){
    const supabase = await createSupabaseServerClient()

    const [statsRes, urgentesRes] = await Promise.all([
        supabase.rpc('obtener_estadisticas_dashboard'),
        supabase
            .from('cotizaciones')
            .select('id, slug, total, created_at, estado, clientes (nombre, empresa)')
            .eq('estado', 'cotizado')
            .order('created_at' , { ascending: true })
            .limit(5),
    ])

if (statsRes.error) {
    return (
      <main className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-300">Error: {statsRes.error.message}</p>
          </div>
        </div>
      </main>
    )
  }

  const stats = statsRes.data as Estadisticas
  const urgentes = urgentesRes.data || []

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Estado de YAX Studio</p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-1 text-sm">
              <a href="/dashboard" className="px-3 py-1.5 bg-gray-800 text-white rounded-lg">Dashboard</a>
              <a href="/clientes" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Clientes</a>
              <a href="/productos" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Productos</a>
              <a href="/tecnicas" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Técnicas</a>
              <a href="/cotizaciones" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Cotizaciones</a>
            </nav>
            <LogoutButton />
          </div>
        </header>

        {/* Fila 1 — Acción inmediata */}
        <section className="mb-6">
          <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
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
          <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
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
              <h2 className="text-xs text-gray-500 uppercase tracking-wider">
                Cotizaciones más antiguas pendientes
              </h2>
              <a
                href="/cotizaciones"
                className="text-xs text-gray-400 hover:text-white transition-colors"
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
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">
                          {cot.clientes?.nombre}
                          {cot.clientes?.empresa && (
                            <span className="text-gray-500 font-normal text-sm">
                              {' '}— {cot.clientes.empresa}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Cotización #{cot.id} ·{' '}
                          <span className={esUrgente ? 'text-orange-400' : ''}>
                            {diasDesde === 0
                              ? 'Hoy'
                              : diasDesde === 1
                              ? '1 día'
                              : `${diasDesde} días`}
                          </span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-orange-400">
                          ${Number(cot.total).toFixed(2)}
                        </p>
                        <a
                          href={`/c/${cot.slug}`}
                          target="_blank"
                          className="text-xs text-gray-400 hover:text-white transition-colors"
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
      </div>
    </main>
  )
}

// Componentes auxiliares

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
      className={`bg-gray-900 border rounded-xl p-5 h-full transition-colors ${
        alerta
          ? 'border-orange-900 hover:border-orange-800'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {titulo}
      </p>
      <p className={`text-4xl font-bold mb-1 ${alerta ? 'text-orange-400' : 'text-white'}`}>
        {valor}
      </p>
      <p className={`text-xs ${alerta ? 'text-orange-400' : 'text-gray-500'}`}>
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {titulo}
      </p>
      <p className="text-3xl font-bold text-white mb-1">
        ${valor.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-gray-500">{detalle}</p>
    </div>
  )
}