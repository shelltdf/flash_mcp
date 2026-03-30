# flash-editor-web — 物理规格

## 构建与运行

- **开发**：在 `flash/` 执行 `npm install`（首次）、`npm run dev`；默认 `http://localhost:5173`（以 Vite 控制台为准）。
- **生产构建**：`npm run build`；输出 `flash/dist/`。
- **Node**：建议 LTS 18+。

## 默认舞台

- 逻辑尺寸：**550 × 400**（像素单位，与经典默认一致，可配置为后续项）。
- 默认帧率显示：**24 fps**。

## 工具 ID（MVP）

`select` | `hand` | `zoom` | `rect` | `oval` | `line` | `text` | `pencil` | `brush` | `bucket` | `eraser`

未实现交互的工具在 UI 上可见，点击可切换 `activeTool`，舞台侧行为可逐步补齐。

## 文件打开（Adobe Animate）

### 支持的来源

1. **单文件（文件 → 打开…）**
   - **ZIP 容器**：内含 **`DOMDocument.xml`** 的工程包（含将 **未压缩 XFL 整包打成 .zip**）。
   - **`.fla`**：若文件头为 **ZIP（PK）**（Animate 常见：实为内含 XML 的包），与上相同流程解析。
2. **未压缩 XFL（文件 → 打开 XFL 文件夹…）**
   - 用户选择 Animate **「另存为」→「Animate 未压缩文档」** 得到的**文件夹**（内含 `DOMDocument.xml`、`LIBRARY/` 等）。通过 `webkitdirectory` 读取文件列表并解析。

### 解析步骤

1. 定位 **`DOMDocument.xml`**（路径大小写不敏感）。
2. **DOMParser** 解析 XML；读取根元素 **`frameRate` / `width` / `height`**（若存在）同步到编辑器状态。
3. 收集 **`DOMLayer`**：图层名、由 **`DOMFrame/@index`** 推导帧数；收集 **`DOMTimeline/@name`** 为场景名列表。
4. **`LIBRARY/`** 下符号：列出相对路径（去 `.xml` 后缀），路径相对工程根且 **大小写不敏感** 匹配 `library/`。

### 失败与限制

- **旧版纯二进制 `.fla`**（非 ZIP）：无法解析；提示用户 **另存为未压缩 XFL** 后使用「打开 XFL 文件夹」或打包为 ZIP。
- **损坏或非工程 ZIP**：提示无法读取或未找到 `DOMDocument.xml`。

所有失败路径须 **可展示错误文案**，不抛未捕获异常。

## SWF 发布

- **MVP**：菜单「发布」可显示「需要外部编译器或后续集成」类提示，不生成有效 SWF。
- **预览（后续）**：通过独立运行时组件加载 SWF Blob。

## 错误语义（打开文件）

| 情况 | 用户可见结果 |
|------|----------------|
| 非 ZIP 的单文件（如二进制 .fla） | 提示另存为 XFL 或使用文件夹/ZIP |
| ZIP 无 DOMDocument.xml | 提示未找到 XFL 根文档 |
| 文件夹无 DOMDocument.xml | 提示选择正确的 XFL 目录 |
| XML 解析失败 | 提示损坏或版本不兼容 |

## 退出码（CLI 封装）

- `build.py` / `test.py` 依赖 `npm run build` 成功为 0，失败为非 0。
