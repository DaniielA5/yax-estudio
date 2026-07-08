import { createSupabaseServerClient } from '@/lib/supabase-server'
import ClienteForm from './cliente-from'
import EliminarClienteButton from './eliminar-cliente-button'
import Buscador from './buscador'

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createSupabaseServerClient()
  const { q } = await searchParams

  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })

  const clientesFiltered = clientes && q
    ? clientes.filter((cliente) =>
        cliente.nombre?.toLowerCase().includes(q.toLowerCase()) ||
        cliente.empresa?.toLowerCase().includes(q.toLowerCase()) ||
        cliente.telefono?.toLowerCase().includes(q.toLowerCase())
      )
    : clientes

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
        <p>Error al cargar clientes: {error.message}</p>
      </div>
    )
  }

  return (
    <>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
  <div>
    <h1 className="text-display" style={{ color: 'var(--text-primary)' }}>
      Clientes
    </h1>
    <p className="text-body mt-1" style={{ color: 'var(--text-secondary)' }}>
      {clientesFiltered?.length || 0}{' '}
      {clientesFiltered?.length === 1 ? 'cliente registrado' : 'clientes registrados'}
    </p>
  </div>
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
    <Buscador />
    <ClienteForm />
  </div>
</div>

      {clientesFiltered?.length === 0 ? (
        <EstadoVacio />
      ) : (
        <ul className="space-y-3">
          {clientesFiltered?.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
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
        
      </div>
      <h2 className="text-h1 mb-2" style={{ color: 'var(--text-primary)' }}>
        Aún no tienes clientes
      </h2>
      <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
        Agrega tu primer cliente para empezar a cotizar.
      </p>
    </div>
  )
}

type Cliente = {
  id: number
  nombre: string
  telefono: string | null
  empresa: string | null
  created_at: string
}

function ClienteCard({ cliente }: { cliente: Cliente }) {
  const iniciales = cliente.nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <li
      className="group rounded-xl p-5 border transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--accent)',
          }}
        >
          {iniciales}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-h2 truncate" style={{ color: 'var(--text-primary)' }}>
            {cliente.nombre}
          </h3>
          {cliente.empresa && (
            <p className="text-body truncate" style={{ color: 'var(--text-secondary)' }}>
              {cliente.empresa}
            </p>
          )}
          {cliente.telefono && (
            <p className="text-caption mt-1" style={{ color: 'var(--text-muted)' }}>
              {cliente.telefono}
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <ClienteForm
            cliente={cliente}
            triggerLabel="Editar"
            triggerClassName="px-3 py-1.5 rounded-lg text-caption btn-secondary"
          />
          <EliminarClienteButton
            clienteId={cliente.id}
            clienteNombre={cliente.nombre}
          />
        </div>
      </div>
    </li>
  )
}