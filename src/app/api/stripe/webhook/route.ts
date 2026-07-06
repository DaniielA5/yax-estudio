import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

if (!WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET no esta definida en .env.local')
}

export async function POST(req: NextRequest) {
  // 1. Leer body RAW (no JSON parseado - Stripe lo firma como string)
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Webhook sin signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  // 2. Validar la signature (esto lanza excepcion si no es valida)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET!)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Signature invalida'
    console.error('Webhook signature invalida:', msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  console.log(`[Webhook] Evento recibido: ${event.type} (id: ${event.id})`)

 const supabase = createSupabaseAdminClient()

  const { data: eventoYaProcesado } = await supabase
    .from('stripe_eventos_procesados')
    .select('id')
    .eq('evento_id', event.id)
    .single()

  if (eventoYaProcesado) {
    console.log(`[Webhook] Evento ${event.id} ya procesado, ignorando`)
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const cotizacionId = session.metadata?.cotizacion_id
      const slug = session.metadata?.slug

      if (!cotizacionId || !slug) {
        console.error('Webhook sin metadata cotizacion_id / slug', session.id)
        return NextResponse.json(
          { error: 'Metadata faltante' },
          { status: 400 }
        )
      }

      const { error: errorUpdate } = await supabase
        .from('cotizaciones')
        .update({
          estado: 'aprobado',
          anticipo_pagado_at: new Date().toISOString(),
        })
        .eq('id', Number(cotizacionId))
        .eq('stripe_session_id', session.id) // guard: solo si session coincide

      if (errorUpdate) {
        console.error('Error actualizando cotizacion en webhook:', errorUpdate)
        return NextResponse.json(
          { error: errorUpdate.message },
          { status: 500 }
        )
      }

      console.log(`[Webhook] Cotizacion #${cotizacionId} marcada como aprobada`)
    } else {
      console.log(`[Webhook] Tipo ${event.type} no manejado, ignorando`)
    }

    const { error: errorInsertEvento } = await supabase
      .from('stripe_eventos_procesados')
      .insert({
        evento_id: event.id,
        tipo: event.type,
      })

    if (errorInsertEvento) {
      console.warn(
        `[Webhook] No se pudo registrar evento (posible race): ${errorInsertEvento.message}`
      )
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Webhook] Error procesando evento:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}