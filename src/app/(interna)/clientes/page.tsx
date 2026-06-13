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
      <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
        <p className="text-red-300">Error al cargar clientes: {error.message}</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-400 text-sm mt-1">
            {clientesFiltered?.length || 0}
            {' '}
            {clientesFiltered?.length === 1
            ? 'cliente registrado' 
            : 'clientes registrados'}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
    <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-xl">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center text-3xl">
        👥
      </div>
      <h2 className="text-xl font-semibold mb-2">Aún no tienes clientes</h2>
      <p className="text-gray-400 text-sm mb-4">
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
    <li className="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-bold text-sm">
          {iniciales}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{cliente.nombre}</h3>
          {cliente.empresa && (
            <p className="text-gray-400 text-sm truncate">{cliente.empresa}</p>
          )}
          {cliente.telefono && (
            <p className="text-gray-500 text-sm mt-1">{cliente.telefono}</p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ClienteForm
            cliente={cliente}
            triggerLabel="Editar"
            triggerClassName="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
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