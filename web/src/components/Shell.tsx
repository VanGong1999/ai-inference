import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { catalog } from '../lib/catalog'
import { KpiBar } from './KpiBar'

const nav = [
  { to: '/', label: '总控', end: true },
  { to: '/books', label: '书舱' },
  { to: '/lab', label: '实验室' },
]

export function Shell() {
  const { pathname } = useLocation()
  const isReader = pathname === '/read' || pathname.endsWith('/read')

  return (
    <div
      className={[
        'mx-auto flex min-h-screen w-[min(1280px,calc(100%-1.5rem))] flex-col',
        isReader ? 'pb-0 pt-3' : 'pb-16 pt-4',
      ].join(' ')}
    >
      {!isReader ? (
        <>
          <header className="panel sticky top-3 z-30 mb-5 flex flex-wrap items-center gap-3 px-3 py-2.5 backdrop-blur-xl">
            <NavLink to="/" className="flex min-w-0 items-center gap-2.5 font-extrabold tracking-tight">
              <img
                src={`${import.meta.env.BASE_URL}vizlogo.png`}
                alt=""
                className="h-8 w-8 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.35)]"
              />
              <span className="truncate">{catalog.meta.title}</span>
            </NavLink>

            <nav className="ml-auto flex flex-wrap items-center gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                      isActive
                        ? 'bg-[rgba(0,240,255,0.12)] text-[var(--cyan)] border border-[var(--line-strong)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.04)]',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={catalog.meta.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)]"
              >
                GitHub
              </a>
              <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-1 mono text-[0.65rem] text-[var(--green)]">
                <span className="status-live inline-block h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                READY
              </span>
            </nav>
          </header>

          <div className="mb-5">
            <KpiBar />
          </div>
        </>
      ) : null}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isReader ? (
        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
          <p>AI 推理工程 · 四书分舱 · React Control Shell v{catalog.meta.version}</p>
          <a href={catalog.meta.github} target="_blank" rel="noreferrer">
            GitHub 仓库 ↗
          </a>
        </footer>
      ) : null}
    </div>
  )
}
