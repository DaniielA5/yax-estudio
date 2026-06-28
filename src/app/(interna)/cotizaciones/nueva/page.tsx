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
      <div
        className="p-4 border rounded-lg"
        style={{
          backgroundColor: 'var(--semantic-danger-bg)',
          borderColor: 'var(--semantic-danger)',
          color: 'var(--semantic-danger)',
        }}
      >
        <p>Error al cargar datos para la cotización</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-display" style={{ color: 'var(--text-primary)' }}>
          Nueva cotización
        </h1>
        <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
          Selecciona cliente, productos y calcula el total
        </p>
      </div>

      <CotizacionForm
        clientes={clientesRes.data}
        productos={productosRes.data}
        tecnicas={tecnicasRes.data}
      />
    </>
  )
}