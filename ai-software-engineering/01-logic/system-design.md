# 系统设计

## 子系统协作

```mermaid
flowchart LR
  Shell[编辑器外壳]
  Stage[舞台]
  Timeline[时间轴]
  Library[库]
  Props[属性]
  IO[文档 IO]

  Shell --> Timeline
  Shell --> Stage
  Shell --> Library
  Shell --> Props
  IO --> Library
  IO --> Timeline
  Timeline --> Stage
  Library --> Stage
  Stage --> Props
```

## 与概念阶段一致性

产品愿景与范围见 `00-concept/product-design.md`；本系统实现 **单页 Web 编辑器** 子集，对应物理目标 `flash-editor-web`。

## 与物理阶段对应

- 对外可验证行为（帧率、面板布局、打开 XFL 检测结果）以 `02-physical/flash-editor-web/spec.md` 为准。
