import { Link } from 'react-router-dom'
import { catalog } from '../lib/catalog'

export function BooksIndex() {
  return (
    <div className="space-y-5">
      <div>
        <div className="mono text-[0.7rem] tracking-[0.14em] text-[var(--violet)]">
          BOOKS // SILOS
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">四本书舱</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          每本书独立目录与章节，不混排。点进书舱查看全部章节并跳转阅读。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {catalog.books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="panel neon-border flex min-h-[220px] flex-col p-5 transition hover:-translate-y-0.5"
            style={{ boxShadow: `0 0 28px ${book.color}22` }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="mono text-[0.68rem] tracking-[0.1em]" style={{ color: book.color }}>
                {book.tag}
              </span>
              <span className="mono rounded bg-black/30 px-2 py-0.5 text-[0.7rem]" style={{ color: book.color }}>
                {book.chapters.length} 章
              </span>
            </div>
            <h2 className="mt-4 text-xl font-extrabold leading-snug">{book.title}</h2>
            <p className="mt-1 mono text-[0.75rem] text-[var(--muted)]">
              {book.author} · {book.focus}
            </p>
            <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{book.summary}</p>
            <div className="mt-4 text-sm font-extrabold" style={{ color: book.color }}>
              打开目录 →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
