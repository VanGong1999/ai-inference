import raw from '../data/catalog.json'

export type Chapter = {
  id: string
  no: string
  title: string
  summary: string
  href: string
  kind: string
}

export type Book = {
  id: string
  title: string
  short: string
  author: string
  focus: string
  summary: string
  color: string
  tag: string
  format: string
  rootHref: string
  chapters: Chapter[]
}

export type GraphNode = {
  id: string
  label: string
  category: string
  val: number
  desc?: string
  bookId?: string
  route?: string
}

export type GraphLink = {
  source: string
  target: string
}

export type LabItem = {
  id: string
  title: string
  summary: string
  track: string
  tags: string[]
  href: string
  kind: string
}

export type Catalog = {
  meta: { title: string; version: string; github: string }
  books: Book[]
  labs: LabItem[]
  graph: { nodes: GraphNode[]; links: GraphLink[] }
  categories: Record<string, { label: string; color: string }>
}

export const catalog = raw as Catalog

export function categoryColor(category: string): string {
  return catalog.categories[category]?.color ?? '#5cddff'
}

export function getBook(bookId: string): Book | undefined {
  return catalog.books.find((b) => b.id === bookId)
}

export function totalChapters(): number {
  return catalog.books.reduce((sum, b) => sum + b.chapters.length, 0)
}
