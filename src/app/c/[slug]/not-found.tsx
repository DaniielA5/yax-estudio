export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">YAX Studio</h1>
        <p className="text-gray-400 text-sm mb-8">Personalización profesional</p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center text-3xl">
            🔍
          </div>
          <h2 className="text-xl font-semibold mb-2">Cotización no encontrada</h2>
          <p className="text-gray-400 text-sm">
            El link puede estar roto o ya no es válido. Contacta con YAX Studio
            para obtener una nueva cotización.
          </p>
        </div>
      </div>
    </main>
  )
}