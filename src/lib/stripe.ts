import Stripe from 'stripe'

if(!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
        'STRIPE_SECRET_KEY no esta definida. Verificar .env.local'
    
    )
}


export const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY, {
   
apiVersion: '2026-06-24.dahlia',

    appInfo: {
        name: 'YAX Studio', 
        version : '0.1.0', 
    },
})