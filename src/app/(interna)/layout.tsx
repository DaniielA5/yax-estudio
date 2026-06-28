import MobileMenuWrapper from './mobile-menu-wrapper'

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
        <div className="max-w-6xl mx-auto p-6 md:p-8">
        <MobileMenuWrapper />
        {children}
      </div>
    </div>
  )
}