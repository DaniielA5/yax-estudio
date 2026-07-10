import { ReactNode } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function Modal({ isOpen, onClose, children, title }: Props) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border p-6 space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-h1" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}