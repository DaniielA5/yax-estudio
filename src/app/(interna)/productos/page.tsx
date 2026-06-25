import { createSupabaseServerClient } from "@/lib/supabase-server";
import ProductoForm from "./productos-form";
import ToggleActivoButton from "./toggle-activo-button";
import ImagenUpload from './imagen-upload'

export default async function ProductosPage() {
  const supabase = await createSupabaseServerClient()

  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .order('activo', { ascending: false })
    .order('nombre', { ascending: true })

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
        <p>Error al cargar productos: {error.message}</p>
      </div>
    )
  }

  const activos = productos.filter((p) => p.activo).length
  const inactivos = productos.length - activos

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display" style={{ color: 'var(--text-primary)' }}>
            Productos
          </h1>
          <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
            {activos} {activos === 1 ? 'activo' : 'activos'}
            {inactivos > 0 && ` · ${inactivos} ${inactivos === 1 ? 'inactivo' : 'inactivos'}`}
          </p>
        </div>
        <ProductoForm />
      </div>

      {productos.length === 0 ? (
        <EstadoVacio />
      ) : (
        <ul className="space-y-3">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
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
        👕
      </div>
      <h2 className="text-h1 mb-2" style={{ color: 'var(--text-primary)' }}>
        Aún no tienes productos
      </h2>
      <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
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
  imagen_url: string | null
}

function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <li
      className="group rounded-xl p-5 border transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        opacity: producto.activo ? 1 : 0.6,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Imagen */}
        <div className="flex-shrink-0">
          <ImagenUpload productoId={producto.id} imagenUrl={producto.imagen_url} />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-h2 truncate" style={{ color: 'var(--text-primary)' }}>
              {producto.nombre}
            </h3>
            {!producto.activo && (
              <span
                className="text-caption px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: 'var(--semantic-pending-bg)',
                  color: 'var(--semantic-pending)',
                }}
              >
                inactivo
              </span>
            )}
          </div>
          {producto.material && (
            <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
              {producto.material}
            </p>
          )}
          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-label" style={{ color: 'var(--text-muted)' }}>
                Individual
              </p>
              <p className="text-body font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                ${producto.costo_individual.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-label" style={{ color: 'var(--text-muted)' }}>
                Mayoreo (6+)
              </p>
              <p className="text-body font-medium mt-0.5" style={{ color: 'var(--accent)' }}>
                ${producto.costo_mayoreo.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ProductoForm
            producto={producto}
            triggerLabel="Editar"
            triggerClassName="px-3 py-1.5 rounded-lg text-caption btn-secondary"
          />
          <ToggleActivoButton productoId={producto.id} activo={producto.activo} />
        </div>
      </div>
    </li>
  )
}