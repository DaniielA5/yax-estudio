import { createSupabaseServerClient } from '@/lib/supabase-server'
import CotizacionForm from './cotizacion-form'

export default async function NuevaCotizacionPage() {
  const supabase = await createSupabaseServerClient()

  const [clientesRes, productosRes, tecnicasRes] = await Promise.all([
    supabase.from('clientes').select('*').order('nombre'),
    supabase.from('productos').select('*').eq('activo', true).order('nombre'),
    supabase.from('tecnicas_impresion').select('*').eq('activo', true).order('nombre'),
  ])

  if (clientesRes.error || productosRes.error || tecnicasRes.error) {
    return (
      <main className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-300">Error al cargar datos para la cotización</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Nueva cotización</h1>
            <p className="text-gray-400 text-sm mt-1">
              Selecciona cliente, productos y calcula el total
            </p>
          </div>
          <nav className="flex gap-1 text-sm">
            <a href="/clientes" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Clientes</a>
            <a href="/productos" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Productos</a>
            <a href="/tecnicas" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Técnicas</a>
            <a href="/cotizaciones/nueva" className="px-3 py-1.5 bg-gray-800 text-white rounded-lg">Nueva cotización</a>
          </nav>
        </header>

        <CotizacionForm
          clientes={clientesRes.data}
          productos={productosRes.data}
          tecnicas={tecnicasRes.data}
        />
      </div>
    </main>
  )
}