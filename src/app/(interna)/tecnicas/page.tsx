import { createSupabaseServerClient } from '@/lib/supabase-server'
import TecnicaForm from './tecnica-form'
import ToggleActivoButton from './toggle-activo-button'

export default async function TecnicasPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tecnicas, error } = await supabase
    .from('tecnicas_impresion')
    .select('*')
    .order('activo', { ascending: false })
    .order('nombre', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-300">Error al cargar técnicas: {error.message}</p>
          </div>
        </div>
      </main>
    )
  }

  const activas = tecnicas.filter((t) => t.activo).length
  const inactivas = tecnicas.length - activas

  return (
  <>

        {tecnicas.length === 0 ? (
          <EstadoVacio />
        ) : (
          <ul className="space-y-3">
            {tecnicas.map((tecnica) => (
              <TecnicaCard key={tecnica.id} tecnica={tecnica} />
            ))}
          </ul>
        )}
      </>
)
}

function EstadoVacio() {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-xl">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center text-3xl">
        🖨️
      </div>
      <h2 className="text-xl font-semibold mb-2">Aún no tienes técnicas</h2>
      <p className="text-gray-400 text-sm">
        Agrega tu primera técnica de impresión para empezar a cotizar.
      </p>
    </div>
  )
}

type Tecnica = {
  id: number
  nombre: string
  costo_por_pieza: number
  minimo_piezas: number
  notas: string | null
  activo: boolean
}

function TecnicaCard({ tecnica }: { tecnica: Tecnica }) {
  return (
    <li
      className={`group bg-gray-900 border rounded-xl p-5 transition-colors ${
        tecnica.activo
          ? 'border-gray-800 hover:border-gray-700'
          : 'border-gray-900 opacity-60 hover:opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{tecnica.nombre}</h3>
            {!tecnica.activo && (
              <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full flex-shrink-0">
                inactiva
              </span>
            )}
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500">Costo por pieza</p>
              <p className="text-sm font-medium text-white">
                ${tecnica.costo_por_pieza.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mínimo</p>
              <p className="text-sm font-medium text-orange-400">
                {tecnica.minimo_piezas} {tecnica.minimo_piezas === 1 ? 'pieza' : 'piezas'}
              </p>
            </div>
          </div>
          {tecnica.notas && (
            <p className="text-gray-400 text-sm mt-3 italic">{tecnica.notas}</p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <TecnicaForm
            tecnica={tecnica}
            triggerLabel="Editar"
            triggerClassName="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          />
          <ToggleActivoButton tecnicaId={tecnica.id} activo={tecnica.activo} />
        </div>
      </div>
    </li>
  )
}