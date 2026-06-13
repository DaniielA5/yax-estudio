'use server'

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function crearCliente(formData:FormData) {
    const supabase = await createSupabaseServerClient()

    const nombre = formData.get('nombre') as string
    const telefono = formData.get('telefono') as string
    const empresa = formData.get('empresa') as string

    if(!nombre || nombre.trim().length === 0 ) {
        return { error:  'El nombre es obligatorio' } 
    }
    
    const { error } = await supabase.from('clientes').insert({
        nombre: nombre.trim(),
        telefono: telefono?.trim() ||   null,
        empresa: empresa?.trim() || null,
    })

    if( error){
        return { error : error.message }
    }

    revalidatePath('/clientes')
    return { success: true }
}

export async function actualizarCliente(id:number, formData: FormData) {
    const supabase =  await createSupabaseServerClient()

    const nombre = formData.get('nombre') as string
    const telefono = formData.get('telefono') as string
    const empresa = formData.get('empresa') as string

    if(!nombre || nombre.trim().length === 0){
        return { error : 'El nombre es obligatorio'}
    }
    const { error } =  await supabase
        .from('clientes')
        .update({
            nombre:nombre.trim(),
            telefono: telefono?.trim() || null,
            empresa:empresa?.trim() || null,
        })
        .eq('id', id)

        if(error) { 
            return { error: error.message }
        }

        revalidatePath('/clientes')
        return { success:true }
}

export async function eliminarCliente(id: number) { 
    const supabase =  await createSupabaseServerClient()

    const { error } = await supabase.from('clientes').delete().eq('id', id)

    if(error)  {
        if(error.code === '23503') { 
            return { 
                error: 'No se puede eliminar :  Este cliente tiene cotizaciones registradas',
            }
        }
        return { error: error.message }
    }

    revalidatePath('/clientes')
    return { success: true }
}