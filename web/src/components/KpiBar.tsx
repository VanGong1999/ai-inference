import { catalog, totalChapters } from '../lib/catalog'

export function KpiBar() {
  const items = [
    { label: 'BOOKS', value: String(catalog.books.length).padStart(2, '0') },
    { label: 'CHAPTERS', value: String(totalChapters()) },
    { label: 'VISUAL LABS', value: String(catalog.labs.length) },
    { label: 'CATALOG', value: `v${catalog.meta.version}` },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="panel px-3 py-2.5">
          <div className="mono text-[0.65rem] tracking-[0.14em] text-[var(--muted)]">
            {item.label}
          </div>
          <div className="mono mt-1 text-xl font-semibold tracking-tight text-[var(--cyan)]">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
