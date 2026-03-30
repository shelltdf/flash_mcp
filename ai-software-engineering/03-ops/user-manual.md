# 用户说明书：Flash 编辑器（Web）

## 环境前提

- 现代浏览器（Chrome / Edge / Firefox 最新稳定版）。
- [Node.js](https://nodejs.org/) LTS（仅本地运行时需安装）。

## 启动（开发）

在仓库中进入实现目录 `flash/`，执行：

```bash
npm install
npm run dev
```

浏览器访问终端提示的本地地址（通常为 `http://localhost:5173`）。

## 打开工程（Adobe Animate）

1. **文件 → 打开…**：选择 **ZIP 包**、或 **实为 ZIP 的 `.fla`**（Animate 常用：内含 `DOMDocument.xml`）。  
2. **文件 → 打开 XFL 文件夹…**：选择 **「另存为」→「Animate 未压缩文档」** 得到的整个文件夹（根目录须有 `DOMDocument.xml`）。

**说明**：若 `.fla` 为**旧版纯二进制**（不是 ZIP），浏览器无法读取；请在 Animate 中 **另存为未压缩 XFL**，再用上两种方式之一打开。

## 发布 SWF

当前版本 **不保证** 生成可在 Flash Player 中播放的 SWF 文件；菜单中的发布入口为规划能力，请以界面提示为准。

## 常见问题

- **打不开文件**：确认文件为含 `DOMDocument.xml` 的 XFL/ZIP；旧版二进制需先转换。
