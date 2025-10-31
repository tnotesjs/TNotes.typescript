# [0266. tsc --listFiles 列出编译文件](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0266.%20tsc%20--listFiles%20%E5%88%97%E5%87%BA%E7%BC%96%E8%AF%91%E6%96%87%E4%BB%B6)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 --listFiles 的作用？](#3----listfiles-的作用)
  - [3.1. 作用](#31-作用)
  - [3.2. 基本输出](#32-基本输出)
- [4. 🤔 如何使用？](#4--如何使用)
  - [4.1. 基本用法](#41-基本用法)
  - [4.2. 保存到文件](#42-保存到文件)
  - [4.3. 分析输出](#43-分析输出)
  - [4.4. 统计分析](#44-统计分析)
- [5. � 调试编译问题？](#5--调试编译问题)
  - [5.1. 问题 1：文件未包含](#51-问题-1文件未包含)
  - [5.2. 问题 2：包含不必要的文件](#52-问题-2包含不必要的文件)
  - [5.3. 问题 3：类型文件缺失](#53-问题-3类型文件缺失)
  - [5.4. 问题 4：重复文件](#54-问题-4重复文件)
  - [5.5. 实际案例](#55-实际案例)
  - [5.6. 优化编译范围](#56-优化编译范围)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- --listFiles 参数作用
- 使用方法
- 调试编译问题

## 2. 🫧 评价

`--listFiles` 列出所有参与编译的文件，是排查编译范围问题的重要工具。

- 查看编译文件列表
- 排查 include/exclude 问题
- 调试依赖关系
- 分析编译范围
- 优化编译性能

## 3. 🤔 --listFiles 的作用？

`--listFiles` 列出 TypeScript 编译器处理的所有文件。

### 3.1. 作用

```text
1. 查看编译范围
   - 列出所有参与编译的文件
   - 包括源文件
   - 包括类型声明文件

2. 调试配置
   - 验证 include/exclude 规则
   - 检查是否包含意外文件
   - 检查是否遗漏必要文件

3. 性能分析
   - 查看编译文件数量
   - 发现不必要的文件
   - 优化编译范围
```

### 3.2. 基本输出

```bash
$ tsc --listFiles
```

```text
/path/to/project/node_modules/typescript/lib/lib.d.ts
/path/to/project/node_modules/typescript/lib/lib.es5.d.ts
/path/to/project/node_modules/typescript/lib/lib.dom.d.ts
/path/to/project/node_modules/@types/node/index.d.ts
/path/to/project/src/index.ts
/path/to/project/src/utils/helper.ts
/path/to/project/src/types/custom.d.ts
```

## 4. 🤔 如何使用？

### 4.1. 基本用法

```bash
# 列出所有文件
tsc --listFiles

# 组合其他参数
tsc --listFiles --noEmit

# 指定配置文件
tsc --listFiles --project tsconfig.json
```

### 4.2. 保存到文件

```bash
# 保存文件列表
tsc --listFiles > files-list.txt

# 统计文件数量
tsc --listFiles | wc -l

# 过滤特定文件
tsc --listFiles | grep "src/"
tsc --listFiles | grep ".d.ts"
```

### 4.3. 分析输出

```bash
$ tsc --listFiles
```

```text
类型库文件：
/usr/local/lib/node_modules/typescript/lib/lib.d.ts
/usr/local/lib/node_modules/typescript/lib/lib.es2020.d.ts
/usr/local/lib/node_modules/typescript/lib/lib.dom.d.ts

第三方类型：
/project/node_modules/@types/node/index.d.ts
/project/node_modules/@types/react/index.d.ts

项目文件：
/project/src/index.ts
/project/src/utils/helper.ts
/project/src/components/Button.tsx
```

### 4.4. 统计分析

```bash
# 统计总文件数
$ tsc --listFiles | wc -l
127

# 统计源文件数
$ tsc --listFiles | grep "src/" | wc -l
45

# 统计类型声明文件
$ tsc --listFiles | grep ".d.ts" | wc -l
82

# 统计 node_modules 文件
$ tsc --listFiles | grep "node_modules" | wc -l
82
```

## 5. � 调试编译问题？

### 5.1. 问题 1：文件未包含

```text
问题：
某个 .ts 文件没有被编译

调试：
$ tsc --listFiles | grep "missing-file.ts"
```

```text
如果没有输出，检查：
1. include/exclude 配置
2. 文件路径是否正确
3. 文件是否被其他文件导入
```

```json
// tsconfig.json
{
  "include": ["src/**/*"],
  "exclude": ["src/test/**/*"] // ⚠️ 可能排除了需要的文件
}
```

### 5.2. 问题 2：包含不必要的文件

```bash
$ tsc --listFiles | grep "test"
```

```text
/project/src/test/setup.ts
/project/src/test/utils.ts
```

```text
发现测试文件被包含，需要排除：
```

```json
{
  "exclude": ["node_modules", "**/*.test.ts", "**/*.spec.ts", "**/test/**/*"]
}
```

### 5.3. 问题 3：类型文件缺失

```bash
$ tsc --listFiles | grep "@types"
```

```text
没有找到 @types/node，需要安装：
```

```bash
npm install --save-dev @types/node
```

### 5.4. 问题 4：重复文件

```bash
$ tsc --listFiles | sort | uniq -d
```

```text
发现重复文件可能表示：
- 配置冲突
- 符号链接问题
- include 规则重叠
```

### 5.5. 实际案例

```text
场景1：编译速度慢

调试步骤：
```

```bash
# 查看文件数量
$ tsc --listFiles | wc -l
5234  # ❌ 太多文件

# 查看 node_modules 文件
$ tsc --listFiles | grep "node_modules" | wc -l
4891  # ❌ 包含了大量 node_modules 文件

# 解决：排除不必要的文件
```

```json
{
  "compilerOptions": {
    "skipLibCheck": true // ✅ 跳过库文件检查
  },
  "exclude": ["node_modules", "**/node_modules/*"]
}
```

```text
场景2：类型错误

问题：某个模块找不到类型定义

调试：
```

```bash
# 检查是否包含类型文件
$ tsc --listFiles | grep "lodash"

# 如果没有，安装类型包
npm install --save-dev @types/lodash

# 再次检查
$ tsc --listFiles | grep "lodash"
/project/node_modules/@types/lodash/index.d.ts  # ✅ 已包含
```

```text
场景3：配置验证

验证 include/exclude 规则：
```

```bash
# 应该包含的文件
$ tsc --listFiles | grep "src/index.ts"
/project/src/index.ts  # ✅ 已包含

# 应该排除的文件
$ tsc --listFiles | grep "test"
# 无输出  # ✅ 已排除

# 应该排除的 node_modules
$ tsc --listFiles | grep "node_modules/@types" | head -5
# ⚠️ 类型文件仍会包含（这是正常的）
```

### 5.6. 优化编译范围

```bash
# 查看当前编译文件
$ tsc --listFiles > before.txt

# 修改配置排除更多文件
```

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  },
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/test/**",
    "coverage"
  ]
}
```

```bash
# 再次查看
$ tsc --listFiles > after.txt

# 对比差异
$ diff before.txt after.txt

# 统计减少的文件
$ echo "Before: $(wc -l < before.txt)"
$ echo "After: $(wc -l < after.txt)"
```

## 6. 🔗 引用

- [Compiler Options][1]
- [TSConfig Reference][2]
- [Project Configuration][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/tsconfig
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
