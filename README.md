# YAX Studio — Sistema interno de gestión

Aplicación web full-stack para gestionar cotizaciones, clientes, productos y técnicas de impresión de un negocio B2B de personalización con DTF (direct-to-film printing). Diseñado y construido en 30 días para reemplazar hojas de cálculo y mensajes de WhatsApp con un flujo digital completo.

**🔗 Demo en producción**: [yax-estudio.vercel.app](https://yax-estudio.vercel.app)

---

## El problema que resuelve

YAX Studio es un negocio real de personalización de playeras, polos, sudaderas y gorras para empresas. Antes de este sistema:

- Las cotizaciones se hacían a mano en Excel y se mandaban por captura por WhatsApp
- No había forma de saber rápido cuántas cotizaciones estaban pendientes de respuesta
- Los anticipos y fechas de entrega vivían en notas dispersas
- Cada cotización repetida tomaba 10+ minutos recalcular precios manualmente

El sistema digitaliza el flujo completo: del primer contacto al pago final.

## Lo que hace

- **CRUD completo** de clientes, productos y técnicas con soft delete e imágenes
- **Cotizaciones dinámicas** con cálculo automático de precios (individual vs. mayoreo desde 6+ piezas)
- **Link público por cotización** que el cliente puede aceptar con un toque, sin necesidad de cuenta
- **Dashboard con métricas accionables**: pendientes de respuesta, urgentes (>5 días sin contestar), aprobadas sin producir, dinero por cobrar
- **Estados con contexto**: registro de anticipo al aprobar, fecha prometida al pasar a producción
- **Compartir por WhatsApp** con mensaje pre-armado y link directo

## Stack técnico

- **Framework**: Next.js 16 (App Router, Turbopack, Server Components)
- **Lenguaje**: TypeScript en modo strict
- **Estilos**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel
- **Versionado**: Git con conventional commits

## Decisiones de arquitectura

- **Server Actions** en lugar de API routes para mutaciones, manteniendo type-safety end-to-end
- **Función PostgreSQL transaccional** (`crear_cotizacion_con_items`) para guardar cotización + items como operación atómica
- **Route group `(interna)`** para separar rutas autenticadas de la cotización pública, sin duplicar middleware
- **Validación cliente Y servidor** en todos los formularios (defense in depth)
- **Soft delete con `activo: boolean`** en catálogos para preservar integridad histórica de cotizaciones pasadas
- **Slug aleatorio MD5 de 10 caracteres** para URLs públicas, evitando exposición de IDs internos

## Schema de base de datos

```
clientes ─┬─< cotizaciones ─< items_cotizacion >─ productos
                                              └─ tecnicas_impresion
```

7 migrations versionadas en `/db/` — toda la historia del schema es reproducible desde cero.

## Correr localmente

```bash
git clone https://github.com/DaniielA5/yax-estudio.git
cd yax-estudio
npm install

# Crea .env.local con tus credenciales de Supabase:
# NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

npm run dev
```

## Roadmap

- [x] CRUD completo de clientes, productos, técnicas
- [x] Cotizaciones con cálculo dinámico
- [x] Link público + aceptación de cliente
- [x] Dashboard con métricas
- [x] Deploy a producción
- [ ] Integración Stripe para anticipos reales
- [ ] Tipos auto-generados de Supabase
- [ ] Notificaciones por email al cliente
- [ ] Multi-tenancy para otros print shops

---

Construido por **Daniel J** — estudiante de Ingeniería en Sistemas Computacionales, en formación como freelance frontend → backend developer.

Build-in-public documentado en [X / Twitter](https://x.com/DanielJuarez8J).