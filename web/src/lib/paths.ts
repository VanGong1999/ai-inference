/** Resolve a docs/ static asset URL against the Vite base (GH Pages: /ai-inference/). */
export function staticUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}

export function readerPath(opts: {
  src: string
  kind?: string
  title?: string
}): string {
  const params = new URLSearchParams()
  params.set('src', opts.src)
  if (opts.kind) params.set('kind', opts.kind)
  if (opts.title) params.set('title', opts.title)
  return `/read?${params.toString()}`
}
