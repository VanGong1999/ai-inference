import { catalog, totalChapters } from '../lib/catalog'

/** Real catalog snapshot — no simulated metrics. */
export function BookStats() {
  return (
    <div className="panel panel-glow p-3">
      <div className="mb-3 mono text-[0.65rem] tracking-[0.14em] text-[var(--yellow)]">
        CATALOG STATS
      </div>
      <div className="space-y-2">
        {catalog.books.map((book) => (
          <div
            key={book.id}
            className="flex items-center justify-between gap-2 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{book.short}</div>
              <div className="mono text-[0.65rem] text-[var(--muted)]">{book.focus}</div>
            </div>
            <div className="mono shrink-0 text-sm font-bold" style={{ color: book.color }}>
              {book.chapters.length} ch
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 mono text-[0.7rem] text-[var(--muted)]">
        Σ {totalChapters()} chapters · {catalog.labs.length} labs
      </div>
    </div>
  )
}
