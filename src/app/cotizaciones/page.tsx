import { createSupabaseServerClient } from '@/lib/supabase-server'
import CambiarEstadoButton from './cambiar-estado-button'
import CompartirButton from './compartir-button'



const ESTADOS = {
  cotizado: { label: 'Cotizado', color: 'bg-gray-800 text-gray-300' },
  aprobado: { label: 'Aprobado', color: 'bg-blue-950 text-blue-300 border border-blue-900' },
  en_produccion: { label: 'En producción', color: 'bg-orange-950 text-orange-300 border border-orange-900' },
  entregado: { label: 'Entregado', color: 'bg-green-950 text-green-300 border border-green-900' },
  cancelado: { label: 'Cancelado', color: 'bg-red-950 text-red-300 border border-red-900' },
} as const

export default async function CotizacionesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: cotizaciones, error } = await supabase
    .from('cotizaciones')
    .select(`   
      *,
      clientes (nombre, empresa),
      items_cotizacion (id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-300">Error: {error.message}</p>
          </div>
        </div>
      </main>
    )
  }
  if (!cotizaciones) {
  return null
}
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Cotizaciones</h1>
            <p className="text-gray-400 text-sm mt-1">
              {cotizaciones.length} {cotizaciones.length === 1 ? 'cotización' : 'cotizaciones'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-1 text-sm">
              <a href="/clientes" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Clientes</a>
              <a href="/productos" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Productos</a>
              <a href="/tecnicas" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Técnicas</a>
              <a href="/cotizaciones" className="px-3 py-1.5 bg-gray-800 text-white rounded-lg">Cotizaciones</a>
              <a href="/dashboard" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Dashboard</a>
            </nav>
            
              <a href="/cotizaciones/nueva"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-medium"
            >
              + Nueva cotización
            </a>
          </div>
        </header>

        {cotizaciones.length === 0 ? (
          <EstadoVacio />
        ) : (
          <ul className="space-y-3">
            {cotizaciones.map((cot: any) => {
              const estado = ESTADOS[cot.estado as keyof typeof ESTADOS] || ESTADOS.cotizado
              const fechaFormateada = new Date(cot.created_at).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <li
                  key={cot.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">#{cot.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${estado.color}`}>
                          {estado.label}
                        </span>
                        <code className="text-xs text-gray-600 font-mono">/{cot.slug}</code>
                      </div>
                      <h3 className="font-semibold text-lg">
                        {cot.clientes?.nombre || 'Sin cliente'}
                      </h3>
                      {cot.clientes?.empresa && (
                        <p className="text-gray-400 text-sm">{cot.clientes.empresa}</p>
                      )}
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="text-gray-500">
                          {cot.items_cotizacion?.length || 0} {cot.items_cotizacion?.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-gray-500">{fechaFormateada}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-orange-400">
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
      </div>
    </main>
  )
}

function EstadoVacio() {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-xl">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center text-3xl">
        
      </div>
      <h2 className="text-xl font-semibold mb-2">Aún no tienes cotizaciones</h2>
      <p className="text-gray-400 text-sm mb-4">
        Crea tu primera cotización para empezar a llevar control.
      </p>
      
        <a href="/cotizaciones/nueva"
        className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-medium"
      >
        + Nueva cotización
      </a>
    </div>
  )
}