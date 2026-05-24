import { supabase } from '@/lib/supabase'

export default async function ClientesPage() {
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="p-8 text-red-500">Error: {error.message}</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clientes de YAX</h1>
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