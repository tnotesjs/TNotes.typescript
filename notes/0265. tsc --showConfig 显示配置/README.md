# [0265. tsc --showConfig 显示配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0265.%20tsc%20--showConfig%20%E6%98%BE%E7%A4%BA%E9%85%8D%E7%BD%AE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 --showConfig 的作用？](#3----showconfig-的作用)
  - [3.1. 作用](#31-作用)
  - [3.2. 基本输出](#32-基本输出)
- [4. 🤔 如何使用？](#4--如何使用)
  - [4.1. 查看默认配置](#41-查看默认配置)
  - [4.2. 验证配置继承](#42-验证配置继承)
  - [4.3. 验证命令行覆盖](#43-验证命令行覆盖)
  - [4.4. 查看文件列表](#44-查看文件列表)
- [5. 🤔 调试配置问题？](#5--调试配置问题)
  - [5.1. 问题 1：配置未生效](#51-问题-1配置未生效)
  - [5.2. 问题 2：继承不生效](#52-问题-2继承不生效)
  - [5.3. 问题 3：npm 包继承](#53-问题-3npm-包继承)
  - [5.4. 问题 4：多重继承](#54-问题-4多重继承)
  - [5.5. 调试 workflow](#55-调试-workflow)
  - [5.6. 实际案例](#56-实际案例)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- --showConfig 参数作用
- 基本使用方法
- 配置调试技巧

## 2. 🫧 评价

`--showConfig` 显示最终生效的配置，是调试配置问题的利器。

- 查看最终配置
- 调试继承问题
- 排查配置冲突
- 验证命令行覆盖
- 配置问题必备工具

## 3. 🤔 --showConfig 的作用？

`--showConfig` 显示 TypeScript 最终使用的完整配置。

### 3.1. 作用

```text
1. 查看最终配置
   - 显示所有生效的选项
   - 包括默认值
   - 包括继承的配置

2. 调试配置
   - 查看 extends 继承结果
   - 验证命令行参数覆盖
   - 排查配置文件路径问题

3. 学习配置
   - 了解默认值
   - 学习配置结构
   - 参考配置示例
```

### 3.2. 基本输出

```bash
$ tsc --showConfig
```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "files": [],
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 4. 🤔 如何使用？

### 4.1. 查看默认配置

```bash
# 查看当前目录配置
tsc --showConfig

# 指定配置文件
tsc --showConfig --project tsconfig.prod.json

# 简写
tsc --showConfig -p tsconfig.prod.json
```

### 4.2. 验证配置继承

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true
  }
}
```

```bash
$ tsc --showConfig
```

```json
{
  "compilerOptions": {
    "target": "ES2020", // ✅ 来自 base
    "module": "commonjs", // ✅ 来自 base
    "strict": true, // ✅ 来自 base
    "outDir": "./dist", // ✅ 来自当前
    "sourceMap": true // ✅ 来自当前
  }
}
```

### 4.3. 验证命令行覆盖

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "outDir": "./dist"
  }
}
```

```bash
$ tsc --showConfig --target ES2020
```

```json
{
  "compilerOptions": {
    "target": "ES2020", // ✅ 命令行覆盖了配置文件
    "outDir": "./dist"
  }
}
```

### 4.4. 查看文件列表

```bash
# 显示配置（不包含编译的文件）
tsc --showConfig

# 列出编译的文件
tsc --listFiles

# 组合使用
tsc --showConfig && tsc --listFiles
```

## 5. 🤔 调试配置问题？

### 5.1. 问题 1：配置未生效

```text
问题：
修改了 tsconfig.json，但编译结果没变化

调试步骤：
1. 运行 tsc --showConfig
2. 检查输出的配置是否包含修改
3. 如果没有，检查：
   - 是否在正确的目录
   - 是否指定了其他配置文件
   - 命令行参数是否覆盖了配置
```

```bash
# 检查最终配置
$ tsc --showConfig

# 如果不符合预期，尝试：
$ tsc --showConfig --project tsconfig.json
```

### 5.2. 问题 2：继承不生效

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json"
}
```

```bash
$ tsc --showConfig
```

```json
{
  "compilerOptions": {
    "strict": true // ✅ 继承成功
  }
}
```

```text
常见问题：
❌ "extends": "tsconfig.base.json"  // 错误：缺少 ./
✅ "extends": "./tsconfig.base.json"

❌ extends 路径错误
✅ extends 使用相对路径或 npm 包名
```

### 5.3. 问题 3：npm 包继承

```json
{
  "extends": "@tsconfig/node16/tsconfig.json"
}
```

```bash
# 确认 npm 包已安装
$ npm list @tsconfig/node16

# 查看最终配置
$ tsc --showConfig
```

### 5.4. 问题 4：多重继承

```json
// configs/base.json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}

// configs/strict.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "strict": true
  }
}

// tsconfig.json
{
  "extends": "./configs/strict.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

```bash
$ tsc --showConfig
```

```json
{
  "compilerOptions": {
    "target": "ES2020", // ✅ 来自 base
    "strict": true, // ✅ 来自 strict
    "outDir": "./dist" // ✅ 来自当前
  }
}
```

### 5.5. 调试 workflow

```bash
# 1. 查看最终配置
tsc --showConfig

# 2. 保存到文件方便查看
tsc --showConfig > config-output.json

# 3. 对比不同环境配置
tsc --showConfig -p tsconfig.dev.json > dev-config.json
tsc --showConfig -p tsconfig.prod.json > prod-config.json
diff dev-config.json prod-config.json

# 4. 验证特定选项
tsc --showConfig | grep "target"
tsc --showConfig | grep "strict"
```

### 5.6. 实际案例

```text
场景：
配置了 strict: true，但代码仍可以使用隐式 any

调试：
$ tsc --showConfig | grep strict
```

```json
{
  "strict": false // ❌ 实际是 false
}
```

```text
原因发现：
命令行使用了 --strict false，覆盖了配置文件

解决：
移除命令行参数，或在配置文件中明确设置
```

## 6. 🔗 引用

- [Compiler Options][1]
- [TSConfig Reference][2]
- [Project Configuration][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/tsconfig
[3]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
