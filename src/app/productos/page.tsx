import { createSupabaseServerClient } from "@/lib/supabase-server";
import ProductoForm from "./productos-form";
import ToggleActivoButton from "./toggle-activo-button";


export default async function ProductosPage() {
    const supabase = await createSupabaseServerClient()

    const {data : productos, error } = await supabase
        .from('productos')
        .select('*')
        .order('activo', {ascending : false}) 
        .order('nombre',  {ascending :  true })


  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-300">Error al cargar productos: {error.message}</p>
          </div>
        </div>
      </main>
    )
  }

  const activos = productos.filter((p) => p.activo).length
  const inactivos = productos.length - activos

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
  <div>
    <h1 className="text-3xl font-bold">Productos</h1>
    <p className="text-gray-400 text-sm mt-1">
      {activos} activos · {inactivos} inactivos
    </p>
  </div>
  <div className="flex items-center gap-4">
    <nav className="flex gap-1 text-sm">
      <a href="/clientes" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Clientes</a>
      <a href="/productos" className="px-3 py-1.5 bg-gray-800 text-white rounded-lg">Productos</a>
      <a href="/tecnicas" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Técnicas</a>
      <a href="/cotizaciones" className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">Cotizaciones</a>
    </nav>
    <ProductoForm />
  </div>
</header>

        {productos.length === 0 ? (
          <EstadoVacio />
        ) : (
          <ul className="space-y-3">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
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
      <h2 className="text-xl font-semibold mb-2">Aún no tienes productos</h2>
      <p className="text-gray-400 text-sm">
        Agrega tu primer producto para empezar a cotizar.
      </p>
    </div>
  )
}

type Producto = {
  id: number
  nombre: string
  costo_individual: number
  costo_mayoreo: number
  material: string | null
  activo: boolean
}

function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <li
      className={`group bg-gray-900 border rounded-xl p-5 transition-colors ${
        producto.activo
          ? 'border-gray-800 hover:border-gray-700'
          : 'border-gray-900 opacity-60 hover:opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{producto.nombre}</h3>
            {!producto.activo && (
              <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full flex-shrink-0">
                inactivo
              </span>
            )}
          </div>
          {producto.material && (
            <p className="text-gray-400 text-sm mt-1">{producto.material}</p>
          )}
          <div className="flex gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500">Individual</p>
              <p className="text-sm font-medium text-white">
                ${producto.costo_individual.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mayoreo (6+)</p>
              <p className="text-sm font-medium text-orange-400">
                ${producto.costo_mayoreo.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ProductoForm
            producto={producto}
            triggerLabel="Editar"
            triggerClassName="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          />
          <ToggleActivoButton productoId={producto.id} activo={producto.activo} />
        </div>
      </div>
    </li>
  )
}