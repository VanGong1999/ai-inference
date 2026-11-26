import { Link, Navigate, useParams } from 'react-router-dom'
import { getBook } from '../lib/catalog'
import { readerPath } from '../lib/paths'

export function BookToc() {
  const { bookId = '' } = useParams()
  const book = getBook(bookId)

  if (!book) {
    return <Navigate to="/books" replace />
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/books" className="mono text-[0.7rem] text-[var(--muted)] hover:text-[var(--text)]">
            ← 全部书舱
          </Link>
          <div className="mt-2 mono text-[0.7rem] tracking-[0.14em]" style={{ color: book.color }}>
            {book.tag}
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{book.title}</h1>
          <p className="mt-2 mono text-sm text-[var(--muted)]">
            {book.author} · {book.focus} · {book.chapters.length} 章
          </p>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">{book.summary}</p>
        </div>
        <Link
          to={readerPath({
            src: book.rootHref,
            kind: book.format === 'html' ? 'html' : 'md',
            title: book.title,
          })}
          className="rounded-xl border px-4 py-2 text-sm font-extrabold"
          style={{
            borderColor: book.color,
            color: book.color,
            boxShadow: `0 0 20px ${book.color}33`,
          }}
        >
          打开总目录 / 全书 →
        </Link>
      </div>

      <div className="panel overflow-hidden">
        <div
          className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3"
          style={{ background: `${book.color}12` }}
        >
          <span className="mono text-[0.7rem] tracking-[0.14em]" style={{ color: book.color }}>
            TABLE OF CONTENTS
          </span>
          <span className="mono text-[0.7rem] text-[var(--muted)]">{book.format.toUpperCase()}</span>
        </div>
        <ol className="divide-y divide-[var(--line)]">
          {book.chapters.map((ch) => (
            <li key={ch.id}>
              <Link
                to={readerPath({
                  src: ch.href,
                  kind: ch.kind,
                  title: `${ch.no} · ${ch.title}`,
                })}
                className="group flex items-start gap-3 px-4 py-3.5 transition hover:bg-[rgba(255,255,255,0.03)]"
              >
                <span
                  className="mono mt-0.5 w-10 shrink-0 text-sm font-bold"
                  style={{ color: book.color }}
                >
                  {ch.no}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold group-hover:underline">{ch.title}</div>
                  <div className="mt-1 text-sm text-[var(--muted)]">{ch.summary}</div>
                </div>
                <span className="mono shrink-0 text-sm text-[var(--muted)] group-hover:text-[var(--cyan)]">
                  READ →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
