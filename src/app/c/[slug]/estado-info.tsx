type Props = {
  estado: string
}

const ESTADOS_INFO = {
  aprobado: {
    color: 'bg-green-950 border-green-900',
    titleColor: 'text-green-300',
    textColor: 'text-green-400',
    icono: '✓',
    iconoBg: 'bg-green-900',
    titulo: 'Cotización aprobada',
    descripcion:
      'YAX Studio se pondrá en contacto contigo para coordinar pago y producción.',
  },
  en_produccion: {
    color: 'bg-orange-950 border-orange-900',
    titleColor: 'text-orange-300',
    textColor: 'text-orange-400',
    icono: '⚙',
    iconoBg: 'bg-orange-900',
    titulo: 'En producción',
    descripcion:
      'Tu pedido está siendo trabajado. Te avisaremos cuando esté listo.',
  },
  entregado: {
    color: 'bg-blue-950 border-blue-900',
    titleColor: 'text-blue-300',
    textColor: 'text-blue-400',
    icono: '📦',
    iconoBg: 'bg-blue-900',
    titulo: 'Pedido entregado',
    descripcion: '¡Gracias por confiar en YAX Studio!',
  },
  cancelado: {
    color: 'bg-red-950 border-red-900',
    titleColor: 'text-red-300',
    textColor: 'text-red-400',
    icono: '✕',
    iconoBg: 'bg-red-900',
    titulo: 'Cotización cancelada',
    descripcion:
      'Esta cotización fue cancelada. Si necesitas otra, contacta con YAX Studio.',
  },
} as const

export default function EstadoInfo({ estado }: Props) {
  const info = ESTADOS_INFO[estado as keyof typeof ESTADOS_INFO]

  if (!info) return null

  return (
    <div className={`${info.color} border rounded-xl p-6 text-center`}>
      <div
        className={`w-16 h-16 mx-auto mb-3 rounded-full ${info.iconoBg} flex items-center justify-center text-3xl`}
      >
        {info.icono}
      </div>
      <h3 className={`text-lg font-semibold ${info.titleColor} mb-1`}>
        {info.titulo}
      </h3>
      <p className={`text-sm ${info.textColor}`}>{info.descripcion}</p>
    </div>
  )
}