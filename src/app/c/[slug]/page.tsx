import { createSupabasePublicClient } from "@/lib/supabase-public";
import { notFound } from "next/navigation";
import AceptarButton  from "./aceptar-button";
import EstadoInfo from "./estado-info";


const ESTADOS_LABEL ={
    cotizado: 'Cotizacion pendiente',
    aprobado: 'Cotizacion aprobada',
    en_produccion: 'En produccion',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
}as const

export default async function CotizacionPublicaPaga({
    params,
}:{
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = createSupabasePublicClient()

    const { data: cotizacion, error } =  await supabase
    .from('cotizaciones')
    .select(`
        *,
        clientes (nombre, empresa),
        items_cotizacion (
            *,
            productos (nombre, material), 
            tecnicas_impresion (nombre, notas)
        )
    `)
    .eq('slug', slug)
    .single()

    if(error || !cotizacion){
        notFound()
    }


  const fechaFormateada = new Date(cotizacion.created_at).toLocaleDateString(
    'es-MX',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )


  const estadoLabel =
    ESTADOS_LABEL[cotizacion.estado as keyof typeof ESTADOS_LABEL] ||
    cotizacion.estado

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        {/* Header con branding YAX */}
        <header className="text-center mb-10 pb-8 border-b border-gray-800">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">YAX Studio</h1>
          <p className="text-gray-400 text-sm">
            Personalización profesional
          </p>
        </header>

        {/* Info de la cotización */}
        <section className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Cotización
              </p>
              <p className="text-2xl font-bold">#{cotizacion.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Fecha
              </p>
              <p className="text-sm">{fechaFormateada}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Para
            </p>
            <p className="text-lg font-semibold">
              {cotizacion.clientes?.nombre}
            </p>
            {cotizacion.clientes?.empresa && (
              <p className="text-gray-400 text-sm">
                {cotizacion.clientes.empresa}
              </p>
            )}
          </div>

          {/* Badge de estado */}
          <div className="flex justify-center">
            <span className="inline-block px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300">
              {estadoLabel}
            </span>
          </div>
        </section>

        {/* Items */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Detalle
          </h2>
          <div className="space-y-3">
            {cotizacion.items_cotizacion?.map((item: any) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">
                      {item.productos?.nombre}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {item.tecnicas_impresion?.nombre}
                      {item.productos?.material && ` · ${item.productos.material}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold">
                      ${Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-gray-500">
                  <span>Cant: {item.cantidad}</span>
                  {item.talla && <span>· Talla: {item.talla}</span>}
                  {item.color && <span>· Color: {item.color}</span>}
                  <span className="ml-auto">
                    ${Number(item.precio_unitario).toFixed(2)} c/u
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Total */}
        <section className="mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-400">Total</span>
              <span className="text-3xl font-bold text-orange-400">
                ${Number(cotizacion.total).toFixed(2)}
              </span>
            </div>
            {cotizacion.notas && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Notas
                </p>
                <p className="text-sm text-gray-300">{cotizacion.notas}</p>
              </div>
            )}
          </div>
        </section>

        {/* Acción según estado */}
        <section className="mb-8">
        {cotizacion.estado === 'cotizado' ? (
            <AceptarButton slug={slug} estadoActual={cotizacion.estado} />
        ) : (
            <EstadoInfo estado={cotizacion.estado} />
        )}
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600">
            Cotización generada por YAX Studio
          </p>
        </footer>
      </div>
    </main>
  )
}

