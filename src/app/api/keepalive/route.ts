import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";


export async function GET(request: Request)  { 
    // verico el secret
    const authHeader = request.headers.get('authorization')
    const expectedToken = `Bearer ${process.env.KEEPALIVE_SECRET }`

    if ( authHeader !== expectedToken) {
        return NextResponse.json (
            { error: 'Unauthorized ' },
            { status: 401 }
        )
    }

    const supabase = await createSupabaseServerClient()

    const { count , error } =  await supabase 
        .from('cotizaciones')
        .select('*', { 
            count: 'exact',
            head: true,
        })

        if(error) { 
            return NextResponse.json(
                {
                    error: 'Query failded',
                    etails: error.message,
                },
                {status:500 }
            )
        }

        return NextResponse.json({
            ok: true, 
            timestamp : new Date(). toISOString(),
            cotizaciones_count : count,
        })
}