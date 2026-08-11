export const ESTADOS = {
  cotizado: {
    label: 'Cotizado',
    bg: 'var(--semantic-pending-bg)',
    color: 'var(--semantic-pending)',
    border: 'var(--border-subtle)',
  },
  aprobado: {
    label: 'Aprobado',
    bg: 'var(--semantic-progress-bg)',
    color: 'var(--semantic-progress)',
    border: 'var(--semantic-progress)',
  },
  en_produccion: {
    label: 'En producción',
    bg: 'var(--semantic-warning-bg)',
    color: 'var(--semantic-warning)',
    border: 'var(--semantic-warning)',
  },
  entregado: {
    label: 'Entregado',
    bg: 'var(--semantic-success-bg)',
    color: 'var(--semantic-success)',
    border: 'var(--semantic-success)',
  },
  cancelado: {
    label: 'Cancelado',
    bg: 'var(--semantic-danger-bg)',
    color: 'var(--semantic-danger)',
    border: 'var(--semantic-danger)',
  },
} as const