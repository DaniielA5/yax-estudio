import { crearCliente } from "@/app/clientes/actions";
import { createClient } from "@supabase/supabase-js";
import { create } from "domain";

export function createSupabasePublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
