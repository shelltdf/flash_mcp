# 开发维护说明书

## 仓库结构

- `ai-software-engineering/`：四阶段文档（概念 / 逻辑 / 物理 / 运维）。
- `flash/`：Vue 3 + Vite 实现（构建目标 **flash-editor-web**）。
- `flash/build.py`、`test.py`、`run.py`、`publish.py`、`dev.py`：工程化入口（Python 封装 npm）。

## 命令

在 `flash/` 目录：

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 → `dist/` |
| `npm run preview` | 预览构建结果 |

## 依赖

- 见 `flash/package.json`。主要运行时依赖：`vue`、`pinia`、`jszip`。

## 发布产物

- 将 `flash/dist/` 部署到任意静态文件服务器即可。
