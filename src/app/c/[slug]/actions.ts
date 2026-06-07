'use server'

import { createSupabasePublicClient } from '@/lib/supabase-public'
import { revalidatePath } from 'next/cache'

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