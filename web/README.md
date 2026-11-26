# Inference Control Room（门户壳）

Vite + React + TypeScript SPA：霓虹总控台、Force Graph、资源库、可视化实验室。

正文仍来自上级 `docs/` 静态文件（iframe / 直链）。

```bash
npm install
npm run dev       # 本地开发（挂载 ../docs 静态资源）
npm run build     # 输出到 ../docs（保留现有静态文件）
npm run preview   # 生产预览：/ai-inference/
```

数据入口：[`src/data/catalog.json`](src/data/catalog.json)。

- 四本书舱（互不混排）：`/books`、`/books/:bookId`
- Vizuara 可视化 walkthrough：`/lab`
- KPI / 面板只反映目录真实统计，无假实时数据；后续接真数据时扩 catalog 或 API 即可。
