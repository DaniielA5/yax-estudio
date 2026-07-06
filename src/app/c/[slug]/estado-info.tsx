type Props = {
  estado: string
  montoAnticipo?: number
  anticipoPagadoAt?: string | null
}

const ESTADOS_INFO = {
  aprobado: {
    bg: 'var(--semantic-success-bg)',
    border: 'var(--semantic-success)',
    color: 'var(--semantic-success)',
    icono: '✓',
    titulo: 'Cotización aprobada',
    descripcion:
      'YAX Studio se pondrá en contacto contigo para coordinar pago y producción.',
  },
  en_produccion: {
    bg: 'var(--semantic-warning-bg)',
    border: 'var(--semantic-warning)',
    color: 'var(--semantic-warning)',
    icono: '⚙',
    titulo: 'En producción',
    descripcion:
      'Tu pedido está siendo trabajado. Te avisaremos cuando esté listo.',
  },
  entregado: {
    bg: 'var(--semantic-progress-bg)',
    border: 'var(--semantic-progress)',
    color: 'var(--semantic-progress)',
    icono: '',
    titulo: 'Pedido entregado',
    descripcion: '¡Gracias por confiar en YAX Studio!',
  },
  cancelado: {
    bg: 'var(--semantic-danger-bg)',
    border: 'var(--semantic-danger)',
    color: 'var(--semantic-danger)',
    icono: '✕',
    titulo: 'Cotización cancelada',
    descripcion:
      'Esta cotización fue cancelada. Si necesitas otra, contacta con YAX Studio.',
  },
} as const

export default function EstadoInfo({ estado, montoAnticipo, anticipoPagadoAt }: Props) {
  const info = ESTADOS_INFO[estado as keyof typeof ESTADOS_INFO]

  if (!info) return null

  const mostrarAnticipo =
    estado === 'aprobado' &&
    typeof montoAnticipo === 'number' &&
    montoAnticipo > 0 &&
    anticipoPagadoAt

  return (
    <div
      className="rounded-xl p-6 text-center border"
      style={{
        backgroundColor: info.bg,
        borderColor: info.border,
      }}
    >
      <div
        className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl"
        style={{
          backgroundColor: info.color,
          color: '#ffffff',
        }}
      >
        {info.icono}
      </div>
      <h3 className="text-h2 mb-1" style={{ color: info.color }}>
        {info.titulo}
      </h3>
      <p className="text-body" style={{ color: info.color }}>
        {info.descripcion}
      </p>

      {mostrarAnticipo && (
        <div
          className="mt-4 pt-4 border-t inline-block px-4"
          style={{ borderColor: 'rgba(21, 128, 61, 0.25)' }}
        >
          <p
            className="text-label mb-1"
            style={{ color: info.color, opacity: 0.75 }}
          >
            Anticipo recibido
          </p>
          <p
            className="text-h2 font-semibold"
            style={{ color: info.color }}
          >
            ${montoAnticipo.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}