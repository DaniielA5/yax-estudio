import { createSupabaseServerClient } from '@/lib/supabase-server'
import LogoutButton from './logout-button'

export default async function ClientesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="p-8 text-red-500">Error: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes de YAX</h1>
        <LogoutButton />
      </div>
      <ul className="space-y-4">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="border p-4 rounded-lg">
            <p className="font-semibold">{cliente.nombre}</p>
            <p className="text-gray-500">{cliente.empresa}</p>
            <p className="text-gray-500">{cliente.telefono}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}