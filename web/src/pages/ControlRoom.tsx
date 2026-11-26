import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookIndexPanel } from '../components/BookIndexPanel'
import { BookStats } from '../components/BookStats'
import { ForceGraphPanel } from '../components/ForceGraphPanel'
import { catalog, categoryColor, getBook, type GraphNode } from '../lib/catalog'

export function ControlRoom() {
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const selectedBook = selected?.bookId ? getBook(selected.bookId) : undefined

  return (
    <div className="space-y-5">
      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="mb-3">
            <div className="mono text-[0.7rem] tracking-[0.14em] text-[var(--cyan)]">
              SYSTEM 01 // CONTROL ROOM
            </div>
            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.05]">
              四本书舱，
              <span className="bg-gradient-to-r from-[var(--cyan)] via-[var(--violet)] to-[var(--pink)] bg-clip-text text-transparent">
                各自独立可读。
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              知识图谱只展示书舱与实验室入口；章节目录在各书页内，不互相混排。指标均来自真实目录数据。
            </p>
          </div>
          <ForceGraphPanel selectedId={selected?.id ?? null} onSelect={setSelected} />
        </div>

        <aside className="flex flex-col gap-3">
          <div className="panel p-3">
            <div className="mono mb-2 text-[0.65rem] tracking-[0.14em] text-[var(--violet)]">
              NODE DETAIL
            </div>
            {selected ? (
              <>
                <div
                  className="mono text-[0.7rem] tracking-wider"
                  style={{ color: categoryColor(selected.category) }}
                >
                  {selected.category.toUpperCase()}
                </div>
                <h2 className="mt-1 text-xl font-bold">{selected.label}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{selected.desc}</p>
                {selectedBook ? (
                  <>
                    <p className="mt-2 mono text-[0.72rem] text-[var(--muted)]">
                      {selectedBook.chapters.length} 章 · {selectedBook.author}
                    </p>
                    <Link
                      to={`/books/${selectedBook.id}`}
                      className="mt-3 inline-flex text-sm font-bold"
                      style={{ color: selectedBook.color }}
                    >
                      打开本书目录 →
                    </Link>
                  </>
                ) : null}
                {selected.route ? (
                  <Link
                    to={selected.route}
                    className="mt-3 inline-flex text-sm font-bold text-[var(--cyan)]"
                  >
                    进入路由 →
                  </Link>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">悬停或点击书舱节点，进入独立目录。</p>
            )}
          </div>

          <BookStats />
          <BookIndexPanel />
        </aside>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <div className="mono text-[0.7rem] tracking-[0.14em] text-[var(--violet)]">
              QUICK SILOS
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">进入书舱</h2>
          </div>
          <Link to="/books" className="text-sm font-bold text-[var(--cyan)]">
            全部书舱 →
          </Link>
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          {catalog.books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="panel p-3 transition hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
            >
              <div className="mono text-[0.68rem]" style={{ color: book.color }}>
                {book.tag}
              </div>
              <h3 className="mt-2 font-bold">{book.short}</h3>
              <p className="mt-1 text-[0.8rem] text-[var(--muted)]">{book.focus}</p>
              <p className="mt-2 mono text-[0.72rem]" style={{ color: book.color }}>
                {book.chapters.length} chapters
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
