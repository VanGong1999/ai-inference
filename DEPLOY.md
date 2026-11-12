# 部署与发布说明

本文件说明如何把本仓库发布到 GitHub Pages，以及如何在本地预览。

## 仓库现状

- 分支：`main`
- 远端：`origin` 已指向 `https://github.com/VanGong1999/ai-inference.git`
- GitHub Pages 根目录：`docs/`（站点内容已就绪）

> 当前仓库没有提交历史（全新仓库）。以下步骤会创建首个提交并推送。

## 1. 本地预览

站点根目录是 `docs/`，用 Python 起静态服务器：

```bash
cd docs
python3 -m http.server 8000
```

浏览器打开：

- 中文门户首页：<http://localhost:8000/>
- 中文书籍：<http://localhost:8000/book.zh.html>
- 英文书籍：<http://localhost:8000/book.html>
- 导读渲染示例：<http://localhost:8000/md.html?src=guides/lectures/06-vLLM-Step-的解剖.md>
- Walkthrough 索引：<http://localhost:8000/visual-walkthroughs.html>

> `docs/md.html` 会把 Markdown 渲染成排版网页（标题 / 加粗 / 表格）。源 `.md` 仍保留，也可在 GitHub 仓库页面阅读。`docs/.nojekyll` 让 GitHub Pages 跳过 Jekyll，直接按静态文件服务。

## 2. 提交并推送

```bash
# 1) 查看将要提交的内容
git status
git add -A

# 2) 提交
git commit -m "Reorganize into Chinese-guided inference engineering repo"

# 3) 推送到远端（首次推送用 -u 建立跟踪）
git push -u origin main
```

> 如果 `origin` 尚未正确指向远端，先执行：
>
> ```bash
> git remote add origin https://github.com/VanGong1999/ai-inference.git
> ```

## 3. 配置 GitHub Pages

1. 打开仓库页面：`https://github.com/VanGong1999/ai-inference`
2. 进入 **Settings → Pages**（左侧菜单）。
3. **Source** 选择 **Deploy from a branch**。
4. **Branch** 选择 `main`，目录选择 **`/docs`**，点击 **Save**。
5. 等待构建完成（通常 1–2 分钟）。

## 4. 访问

站点地址：

```text
https://vanguong1999.github.io/ai-inference/
```

中文门户首页对应 `docs/index.html`，因此：

- 首页：`https://vanguong1999.github.io/ai-inference/`
- 中文书籍：`https://vanguong1999.github.io/ai-inference/book.zh.html`
- 英文书籍：`https://vanguong1999.github.io/ai-inference/book.html`
- 导读渲染：`https://vanguong1999.github.io/ai-inference/md.html?src=guides/README.md`
- 面试笔记：`https://vanguong1999.github.io/ai-inference/md.html?src=llm-notes/README.md`
- Kiely 书：`https://vanguong1999.github.io/ai-inference/md.html?src=inference-engineering/README.md`
- 生产笔记：`https://vanguong1999.github.io/ai-inference/md.html?src=lecture-notes/l13-production-inference-systems/README.md`
- Walkthrough 索引：`https://vanguong1999.github.io/ai-inference/visual-walkthroughs.html`

## 5. 验证清单

部署后逐项检查：

- [ ] 中文门户首页正常渲染（标题、卡片、链接）。
- [ ] `book.html` / `book.zh.html` 正常加载，27 章插图（`figures/`）显示正常。
- [ ] `md.html?src=llm-notes/README.md` 可打开，且目录内各章 Markdown 可互相跳转。
- [ ] `md.html?src=inference-engineering/README.md` 可打开，且目录内各章 Markdown 可互相跳转。
- [ ] `md.html?src=lecture-notes/l13-production-inference-systems/README.md` 列出全部 4 篇笔记。
- [ ] `visual-walkthroughs.html` 中所有内部链接可用（已从绝对路径改为相对路径）。
- [ ] 各 walkthrough HTML（FFT、Mamba、FlashAttention、RadixAttention 等）正常打开。
- [ ] 根 `README.md` 与 `docs/guides/*.md` 在 GitHub 仓库页面正常渲染。

## 6. 故障排查

| 现象 | 处理 |
|---|---|
| 首页 404 | 确认 Pages 目录选的是 `/docs`，且仓库根存在 `docs/index.html` |
| 插图不显示 | 确认 `docs/figures/` 已提交，链接为相对路径 |
| Markdown 导读在 Pages 上显示为纯文本 | 正常现象，`.nojekyll` 禁用了 Jekyll；在 GitHub 仓库页面阅读即可 |
| 内部链接跳到旧站点 | 确认 `docs/` 与导读中 walkthrough 已指向本地路径（`dna-of-a-transformer/` 等），不再依赖 `vizuaraai.github.io` |
