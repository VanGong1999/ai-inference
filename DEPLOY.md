# 部署与发布说明

本文件说明如何把本仓库发布到 GitHub Pages，以及如何在本地预览。

## 仓库现状

- 分支：`main`
- 远端：`origin` → `https://github.com/VanGong1999/ai-inference.git`
- GitHub Pages 根目录：`docs/`（公开访问，无需登录）
- 门户壳：`web/`（Vite + React SPA），构建产物写入 `docs/index.html`、`docs/404.html`、`docs/portal-assets/`

## 1. 本地开发（推荐）

```bash
cd web
npm install
npm run dev
# 打开终端提示的本地地址（默认 http://localhost:5173/）
# 开发服务器会把 ../docs 下的静态正文（md.html / book / walkthrough）挂载出来供 iframe 阅读
```

## 2. 构建门户并写入 docs/

每次改完 `web/` 后必须构建，GitHub Pages 才看得到新壳：

```bash
cd web
npm run build
# 等价：tsc → vite build（base=/ai-inference/，outDir=../docs，emptyOutDir=false）
#      → 复制 index.html → 404.html，清理过期 portal-assets
```

构建**不会删除** `docs/` 下的书籍、Markdown、walkthrough 等静态资源。

### 构建后本地预览 SPA

因生产资源路径带 `/ai-inference/` 前缀，请用 Vite preview：

```bash
cd web
npm run preview
# 打开 http://localhost:4173/ai-inference/
```

仅预览静态正文（不走 SPA 路由）仍可用：

```bash
cd docs
python3 -m http.server 8000
# http://localhost:8000/book.zh.html
# http://localhost:8000/md.html?src=guides/README.md
```

> 注意：用 Python 直接开 `docs/` 根路径时，SPA 的 `/ai-inference/...` 资源路径会对不上；看总控台请用 `npm run preview` 或线上 Pages。

## 3. 提交并推送

```bash
git status
git add -A
git commit -m "Update inference control room SPA"
git push origin main
```

请确保提交包含：

- `web/` 源码
- `docs/index.html`、`docs/404.html`
- `docs/portal-assets/*`

## 4. 配置 GitHub Pages

1. 打开 `https://github.com/VanGong1999/ai-inference`
2. **Settings → Pages**
3. **Source** = Deploy from a branch
4. **Branch** = `main`，目录 = **`/docs`**，Save
5. 等待 1–2 分钟

`docs/404.html` 与首页同为 SPA 入口，用于深链刷新（`/library`、`/lab`、`/read`）。

## 5. 访问

```text
https://vanguong1999.github.io/ai-inference/
```

| 入口 | URL |
|------|-----|
| 总控台（SPA） | `/` |
| 资源库 | `/library` |
| 实验室 | `/lab` |
| 正文阅读壳 | `/read?src=...` |
| 中文书籍（直链） | `/book.zh.html` |
| Markdown 渲染（直链） | `/md.html?src=guides/README.md` |
| 旧 walkthrough 索引 | `/visual-walkthroughs.html` |

## 6. 验证清单

- [ ] 首页为霓虹总控台，知识图谱可拖拽 / 悬停
- [ ] `/library`、`/lab` 刷新不白屏（404.html 回退）
- [ ] 资源 / 实验室可进入 Reader iframe，或「新窗口打开」直达原文
- [ ] `book.zh.html` / `md.html?src=...` 旧直链仍可用
- [ ] `figures/` 插图、walkthrough HTML 正常
- [ ] 无障碍：系统开启「减少动态效果」时脉冲 / 扫描线减弱

## 7. 故障排查

| 现象 | 处理 |
|------|------|
| 首页空白 / JS 404 | 确认已 `npm run build` 且 `docs/portal-assets/` 已推送 |
| `/library` 刷新 404 且无壳 | 确认存在 `docs/404.html`（与 index 同内容） |
| iframe 打不开正文 | 开发用 `npm run dev`；线上确认 `src` 相对 `docs/` 路径正确 |
| 插图不显示 | 确认 `docs/figures/` 已提交 |
| 本地 Python 打开首页资源 404 | 改用 `cd web && npm run preview` |
