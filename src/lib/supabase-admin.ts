import { createClient } from "@supabase/supabase-js";


if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL no esta definida')

}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) { 
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no esta definida')

}

export function createSupabaseAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}


/**
 * Cliente de Supabase con service_role - BYPASS DE RLS.
 *
 * REGLAS DE USO:
 * - Solo en API Routes (webhooks) o Server Actions donde NO haya sesion de usuario
 * - Nunca importar desde Client Components
 * - Nunca importar desde Server Components regulares (usa createSupabaseServerClient)
 *
 *  contexto de usuario, usar createSupabaseServerClient.
 *  acceso publico anonimo (ej: cotizacion publica), usar createSupabasePublicClient.
 */