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
      <div
        className="p-4 border rounded-lg"
        style={{
          backgroundColor: 'var(--semantic-danger-bg)',
          borderColor: 'var(--semantic-danger)',
          color: 'var(--semantic-danger)',
        }}
      >
        <p>Error al cargar técnicas: {error.message}</p>
      </div>
    )
  }

  const activas = tecnicas.filter((t) => t.activo).length
  const inactivas = tecnicas.length - activas

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display" style={{ color: 'var(--text-primary)' }}>
            Técnicas de impresión
          </h1>
          <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
            {activas} {activas === 1 ? 'activa' : 'activas'}
            {inactivas > 0 && ` · ${inactivas} ${inactivas === 1 ? 'inactiva' : 'inactivas'}`}
          </p>
        </div>
        <TecnicaForm />
      </div>

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
    <div
      className="text-center py-16 border-2 border-dashed rounded-xl"
      style={{ borderColor: 'var(--border-strong)' }}
    >
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: 'var(--bg-subtle)' }}
      >
        🖨️
      </div>
      <h2 className="text-h1 mb-2" style={{ color: 'var(--text-primary)' }}>
        Aún no tienes técnicas
      </h2>
      <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
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
      className="group rounded-xl p-5 border transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        opacity: tecnica.activo ? 1 : 0.6,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-h2 truncate" style={{ color: 'var(--text-primary)' }}>
              {tecnica.nombre}
            </h3>
            {!tecnica.activo && (
              <span
                className="text-caption px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: 'var(--semantic-pending-bg)',
                  color: 'var(--semantic-pending)',
                }}
              >
                inactiva
              </span>
            )}
          </div>
          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-label" style={{ color: 'var(--text-muted)' }}>
                Costo por pieza
              </p>
              <p className="text-body font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                ${tecnica.costo_por_pieza.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-label" style={{ color: 'var(--text-muted)' }}>
                Mínimo
              </p>
              <p className="text-body font-medium mt-0.5" style={{ color: 'var(--accent)' }}>
                {tecnica.minimo_piezas} {tecnica.minimo_piezas === 1 ? 'pieza' : 'piezas'}
              </p>
            </div>
          </div>
          {tecnica.notas && (
            <p
              className="text-body mt-3 italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              {tecnica.notas}
            </p>
          )}
        </div>

        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <TecnicaForm
            tecnica={tecnica}
            triggerLabel="Editar"
            triggerClassName="px-3 py-1.5 rounded-lg text-caption btn-secondary"
          />
          <ToggleActivoButton tecnicaId={tecnica.id} activo={tecnica.activo} />
        </div>
      </div>
    </li>
  )
}