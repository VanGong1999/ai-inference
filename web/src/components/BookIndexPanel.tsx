import { Link } from 'react-router-dom'
import { catalog } from '../lib/catalog'

export function BookIndexPanel() {
  return (
    <div className="panel relative overflow-hidden p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="mono text-[0.65rem] tracking-[0.14em] text-[var(--pink)]">
          BOOK INDEX
        </span>
        <span className="mono text-[0.65rem] text-[var(--muted)]">4 silos</span>
      </div>
      <div className="space-y-1.5">
        {catalog.books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 transition hover:border-[var(--line)] hover:bg-[rgba(255,255,255,0.03)]"
          >
            <span className="truncate text-sm font-semibold">{book.short}</span>
            <span className="mono shrink-0 text-[0.7rem]" style={{ color: book.color }}>
              →
            </span>
          </Link>
        ))}
        <Link
          to="/lab"
          className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 text-[var(--pink)] transition hover:border-[var(--line)] hover:bg-[rgba(255,45,149,0.06)]"
        >
          <span className="truncate text-sm font-semibold">可视化实验室</span>
          <span className="mono shrink-0 text-[0.7rem]">→</span>
        </Link>
      </div>
    </div>
  )
}
