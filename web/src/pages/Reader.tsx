import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { staticUrl } from '../lib/paths'

export function Reader() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const src = params.get('src') ?? ''
  const title = params.get('title') ?? '正文阅读'
  const kind = params.get('kind') ?? 'html'

  if (!src) {
    return (
      <div className="panel p-8 text-center">
        <h1 className="text-2xl font-bold">未指定资源</h1>
        <p className="mt-2 text-[var(--muted)]">请从资源库或实验室选择一项内容。</p>
        <Link to="/library" className="mt-4 inline-flex font-bold text-[var(--cyan)]">
          返回资源库 →
        </Link>
      </div>
    )
  }

  const iframeSrc = staticUrl(src)
  const external = /^https?:\/\//i.test(src)

  return (
    <div className="flex h-[calc(100vh-11rem)] min-h-[480px] flex-col gap-3">
      <div className="panel flex flex-wrap items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-bold text-[var(--muted)] hover:text-[var(--text)]"
        >
          ← 返回
        </button>
        <div className="min-w-0 flex-1">
          <div className="mono text-[0.62rem] tracking-[0.12em] text-[var(--cyan)]">
            READER // {kind.toUpperCase()}
          </div>
          <h1 className="truncate text-base font-bold">{title}</h1>
        </div>
        <a
          href={iframeSrc}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm font-bold text-[var(--cyan)] hover:border-[var(--line-strong)]"
        >
          新窗口打开 ↗
        </a>
      </div>

      <div className="panel neon-border relative min-h-0 flex-1 overflow-hidden">
        {external ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-[var(--muted)]">外部链接无法在 iframe 中嵌入。</p>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[var(--cyan)] px-4 py-2 font-bold text-[#03111d]"
            >
              前往外部页面
            </a>
          </div>
        ) : (
          <iframe
            title={title}
            src={iframeSrc}
            className="h-full w-full border-0 bg-[#0a0a0f]"
          />
        )}
      </div>
    </div>
  )
}
