import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog } from '../lib/catalog'
import { readerPath } from '../lib/paths'

export function Lab() {
  const [query, setQuery] = useState('')
  const tracks = useMemo(
    () => Array.from(new Set(catalog.labs.map((l) => l.track))),
    [],
  )
  const [track, setTrack] = useState<string>('全部')

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    return catalog.labs.filter((lab) => {
      if (track !== '全部' && lab.track !== track) return false
      if (!q) return true
      const hay = `${lab.title} ${lab.summary} ${lab.tags.join(' ')} ${lab.track}`.toLocaleLowerCase()
      return hay.includes(q)
    })
  }, [query, track])

  return (
    <div className="space-y-5">
      <div>
        <div className="mono text-[0.7rem] tracking-[0.14em] text-[var(--pink)]">
          05 // VISUAL LAB
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">可视化实验室</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          从 KV Cache 到分离式 Serving，沿着数据流看系统。共 {catalog.labs.length} 个 walkthrough。
        </p>
      </div>

      <div className="panel p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索 FlashAttention、Mamba、量化…"
          aria-label="搜索实验室"
          className="w-full rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.28)] px-4 py-3 outline-none focus:border-[var(--pink)]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {['全部', ...tracks].map((t) => {
            const pressed = track === t
            return (
              <button
                key={t}
                type="button"
                aria-pressed={pressed}
                onClick={() => setTrack(t)}
                className={[
                  'rounded-full border px-3 py-1.5 text-sm font-bold transition',
                  pressed
                    ? 'border-[var(--pink)] bg-[var(--pink)] text-[#1a0510]'
                    : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]',
                ].join(' ')}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((lab) => (
          <Link
            key={lab.id}
            to={readerPath({ src: lab.href, kind: lab.kind, title: lab.title })}
            className="panel flex min-h-[180px] flex-col p-4 transition hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="mono text-[0.68rem] tracking-wider text-[var(--pink)]">
                {lab.track}
              </span>
              <div className="flex flex-wrap gap-1">
                {lab.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[rgba(255,45,149,0.1)] px-1.5 py-0.5 mono text-[0.62rem] text-[var(--pink)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="mt-3 text-lg font-bold leading-snug">{lab.title}</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--muted)]">{lab.summary}</p>
            <div className="mt-3 text-sm font-extrabold text-[var(--cyan)]">打开 walkthrough →</div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-6 text-center text-[var(--muted)]">没有匹配的 walkthrough。</div>
      ) : null}
    </div>
  )
}
