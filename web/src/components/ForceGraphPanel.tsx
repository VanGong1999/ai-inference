import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D, { type ForceGraphMethods, type NodeObject } from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import { catalog, categoryColor, type GraphNode } from '../lib/catalog'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type FgNode = NodeObject & GraphNode

type Props = {
  selectedId: string | null
  onSelect: (node: GraphNode | null) => void
}

export function ForceGraphPanel({ selectedId, onSelect }: Props) {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const fgRef = useRef<ForceGraphMethods<FgNode> | undefined>(undefined)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 640, h: 420 })

  const data = useMemo(
    () => ({
      nodes: catalog.graph.nodes.map((n) => ({ ...n })),
      links: catalog.graph.links.map((l) => ({ ...l })),
    }),
    [],
  )

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setDims({ w: Math.max(280, width), h: Math.max(280, height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const openNode = useCallback(
    (node: GraphNode) => {
      onSelect(node)
      if (node.route) {
        navigate(node.route)
        return
      }
      if (node.bookId) {
        navigate(`/books/${node.bookId}`)
      }
    },
    [navigate, onSelect],
  )

  const paintNode = useCallback(
    (node: FgNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.label
      const fontSize = 12 / globalScale
      const r = Math.sqrt(node.val || 8) * 1.6
      const color = categoryColor(node.category)
      const isSelected = node.id === selectedId

      ctx.beginPath()
      ctx.arc(node.x ?? 0, node.y ?? 0, r + (isSelected ? 2.5 : 0), 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.globalAlpha = isSelected ? 0.95 : 0.78
      ctx.shadowColor = color
      ctx.shadowBlur = isSelected ? 18 : 8
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      ctx.beginPath()
      ctx.arc(node.x ?? 0, node.y ?? 0, r * 0.45, 0, 2 * Math.PI)
      ctx.fillStyle = '#0a0a0f'
      ctx.fill()

      ctx.font = `${fontSize}px JetBrains Mono, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#e8f2ff'
      ctx.fillText(label, node.x ?? 0, (node.y ?? 0) + r + 2)
    },
    [selectedId],
  )

  return (
    <div
      ref={wrapRef}
      className="panel neon-border relative h-[min(58vh,520px)] min-h-[320px] w-full overflow-hidden"
    >
      {!reduced && <div className="scan-line" />}
      <div className="pointer-events-none absolute left-3 top-3 z-10 mono text-[0.65rem] tracking-[0.14em] text-[var(--cyan)]">
        LIBRARY GRAPH // 4 BOOK SILOS
      </div>
      <ForceGraph2D
        ref={fgRef}
        width={dims.w}
        height={dims.h}
        graphData={data}
        nodeId="id"
        backgroundColor="rgba(0,0,0,0)"
        linkColor={() => 'rgba(0, 240, 255, 0.22)'}
        linkWidth={1}
        linkDirectionalParticles={reduced ? 0 : 1}
        linkDirectionalParticleWidth={1.4}
        linkDirectionalParticleSpeed={0.003}
        linkDirectionalParticleColor={() => '#00f0ff'}
        cooldownTicks={reduced ? 40 : 100}
        enableNodeDrag
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          const r = Math.sqrt((node as FgNode).val || 8) * 1.6 + 4
          ctx.beginPath()
          ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
        }}
        onNodeClick={(node) => openNode(node as FgNode)}
        onNodeHover={(node) => {
          if (wrapRef.current) {
            wrapRef.current.style.cursor = node ? 'pointer' : 'grab'
          }
          if (node) onSelect(node as FgNode)
        }}
        onBackgroundClick={() => onSelect(null)}
      />
    </div>
  )
}
