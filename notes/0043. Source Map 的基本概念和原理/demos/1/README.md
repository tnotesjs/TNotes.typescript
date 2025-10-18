# TypeScript Source Map 差异演示

本项目现已精简为单文件 `src/index.ts`，用于快速对比“关闭 / 开启 source map”时错误堆栈定位的不同。此前的 `manual-sm.ts`、手动 `source-map-support` 演示已移除，不再适用本 README。

## 核心概念澄清

1. TypeScript 编译器只生成 `.js.map`；它本身不修改运行时堆栈。
2. 是否显示 TS 行列取决于运行环境是否消费 source map：
   - Node 原生：需要 `--enable-source-maps`（Node 12+，在高版本更完善）。
   - ts-node / ts-node-dev：内部集成（类似自动安装 source-map-support）直接给出 TS 位置。
3. 未消费能力时，堆栈指向编译后 JS 文件（`dist/index.js`）。

## 快速对照步骤

准备：确保 `tsconfig.json` 中 `outDir: dist`。

### 1. 关闭 source map 构建运行

```bash
pnpm build:no-map
pnpm run:dist
```

期望：堆栈文件名为 `dist/index.js`。

### 2. 开启 source map 构建运行

```bash
pnpm build:map
pnpm run:dist:maps
```

期望：堆栈文件名映射回 `src/index.ts`，行列与源代码一致。

### 3. 即时运行（无需显式构建）

```bash
pnpm dev
```

期望：堆栈直接显示 `src/index.ts`（因为 ts-node-dev 已消费映射）。

## 总结表

| 模式                      | 构建脚本     | 运行脚本      | 堆栈文件指向  |
| ------------------------- | ------------ | ------------- | ------------- |
| 无 source map             | build:no-map | run:dist      | dist/index.js |
| 有 source map + Node 原生 | build:map    | run:dist:maps | src/index.ts  |
| ts-node-dev 即时          | （省略）     | dev           | src/index.ts  |

## 常见误区

| 说法 | 说明 |
| --- | --- |
| “TypeScript 默认集成 source-map-support” | 不准确：TS 只生成 map；实际是 ts-node / 运行时工具帮你显示。 |
| “只要生成 .map Node 就会用” | 需 `--enable-source-maps`（或运行时框架自行 hook）。 |
| “生产必须装 source-map-support” | 高版本 Node 已原生支持，选择其一即可。 |

## 可继续扩展

- 增加异步/Promise 场景测试堆栈跨异步的映射准确性。
- 使用 inlineSourceMap（`compilerOptions.inlineSourceMap: true`）与外部 map 对比。
- 对比无 flag 运行有 map 构建：`pnpm build:map && node dist/index.js`，观察仍指向 dist。

## 一键演示脚本

你也可以使用：

```bash
pnpm demo
```

自动串行展示关闭与开启的堆栈差异。
