'use server'

import { createSupabasePublicClient } from '@/lib/supabase-public'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

const UMBRAL_ANTICIPO = 5000
const PORCENTAJE_ANTICIPO = 0.50

export async function aprobarCotizacionPublica(slug: string) {
  if (!slug || typeof slug !== 'string') {
    return { error: 'Link inválido' }
  }

  const supabase = createSupabasePublicClient()

  const { data: cotizacion, error: errorFetch } = await supabase
    .from('cotizaciones')
    .select('id, estado')
    .eq('slug', slug)
    .single()

  if (errorFetch || !cotizacion) {
    return { error: 'Cotización no encontrada' }
  }

  if (cotizacion.estado !== 'cotizado') {
    return {
      error: `Esta cotización ya está en estado "${cotizacion.estado}" y no se puede modificar`,
    }
  }

  const { error: errorUpdate } = await supabase
    .from('cotizaciones')
    .update({ estado: 'aprobado' })
    .eq('slug', slug)
    .eq('estado', 'cotizado')

  if (errorUpdate) {
    return { error: errorUpdate.message }
  }

  revalidatePath(`/c/${slug}`)
  revalidatePath('/cotizaciones')
  return { success: true }
}


export async function crearSesionAnticipo(slug: string) {
  if (!slug || typeof slug !== 'string') {
    return { error: 'Link inválido' }
  }

  const supabase = createSupabasePublicClient()

  const { data: cotizacion, error: errorFetch } = await supabase
    .from('cotizaciones')
    .select('id, estado, total, stripe_session_id, clientes(nombre)')
    .eq('slug', slug)
    .single()

  if (errorFetch || !cotizacion) {
    return { error: 'Cotización no encontrada' }
  }

  if (cotizacion.estado !== 'cotizado') {
    return {
      error: `Esta cotización ya está en estado "${cotizacion.estado}" y no puede pagarse`,
    }
  }

  const total = Number(cotizacion.total)

  if (total > UMBRAL_ANTICIPO) {
    return {
      error: 'Para cotizaciones mayores a $5,000 MXN, contacta con YAX Studio para coordinar el pago',
    }
  }

  const montoAnticipo = Math.round(total * PORCENTAJE_ANTICIPO * 100) // Stripe usa centavos

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'mxn',
      payment_method_types: ['card'],

      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Anticipo cotización YAX #${cotizacion.id}`,
              description: `50% del total de $${total.toFixed(2)} MXN`,
            },
            unit_amount: montoAnticipo, // ya está en centavos
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/c/${slug}?pago=exito`,
      cancel_url: `${baseUrl}/c/${slug}?pago=cancelado`,
      metadata: {
        cotizacion_id: String(cotizacion.id),
        slug: slug,
      },
    })

    const { error: errorUpdate } = await supabase
      .from('cotizaciones')
      .update({
        stripe_session_id: session.id,
        monto_anticipo: total * PORCENTAJE_ANTICIPO, // sin centavos, en formato normal
      })
      .eq('slug', slug)
      .eq('estado', 'cotizado') // race condition guard

    if (errorUpdate) {
      console.error('Session creada en Stripe pero no guardada en DB:', session.id)
      return { error: 'Error al preparar el pago. Intenta de nuevo.' }
    }

    // 8. Devolver URL a la que el cliente debe redirigirse
    return { url: session.url }

  } catch (err) {
    console.error('Error creando Stripe session:', err)
    return { error: 'No pudimos preparar el pago. Intenta más tarde.' }
  }
}