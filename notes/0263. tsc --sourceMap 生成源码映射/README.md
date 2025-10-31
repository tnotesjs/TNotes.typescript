# [0263. tsc --sourceMap 生成源码映射](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0263.%20tsc%20--sourceMap%20%E7%94%9F%E6%88%90%E6%BA%90%E7%A0%81%E6%98%A0%E5%B0%84)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 sourceMap 是什么？](#3--sourcemap-是什么)
  - [3.1. 作用](#31-作用)
  - [3.2. 工作原理](#32-工作原理)
- [4. 🤔 如何生成 sourceMap？](#4--如何生成-sourcemap)
  - [4.1. 命令行方式](#41-命令行方式)
  - [4.2. 配置文件方式](#42-配置文件方式)
  - [4.3. 目录结构](#43-目录结构)
  - [4.4. 浏览器中查看](#44-浏览器中查看)
- [5. 🤔 相关配置选项？](#5--相关配置选项)
  - [5.1. inlineSourceMap](#51-inlinesourcemap)
  - [5.2. sourceRoot](#52-sourceroot)
  - [5.3. mapRoot](#53-maproot)
  - [5.4. inlineSources](#54-inlinesources)
  - [5.5. declarationMap](#55-declarationmap)
- [6. 🤔 如何调试 TypeScript？](#6--如何调试-typescript)
  - [6.1. Node.js 调试](#61-nodejs-调试)
  - [6.2. 浏览器调试](#62-浏览器调试)
  - [6.3. 生产环境考虑](#63-生产环境考虑)
  - [6.4. 配合打包工具](#64-配合打包工具)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- sourceMap 概念
- 生成 sourceMap
- 配置选项
- 调试 TypeScript

## 2. 🫧 评价

sourceMap 将编译后的 JavaScript 映射回原始 TypeScript，是调试的关键工具。

- 调试必备功能
- 在浏览器中调试 TypeScript
- 显示原始代码和行号
- 提升调试体验
- 生产环境可选择关闭

## 3. 🤔 sourceMap 是什么？

sourceMap 是一个映射文件，建立编译后代码与源代码的对应关系。

### 3.1. 作用

```text
1. 调试支持
   - 在浏览器中显示原始 TypeScript 代码
   - 显示正确的行号和文件名
   - 支持断点调试

2. 错误定位
   - 错误堆栈显示 TypeScript 位置
   - 而不是编译后的 JavaScript 位置

3. 性能分析
   - Profiling 工具显示 TypeScript 代码
   - 准确定位性能瓶颈
```

### 3.2. 工作原理

```typescript
// index.ts（源代码）
function greet(name: string): string {
  return `Hello, ${name}!`
}
console.log(greet('TypeScript'))
```

编译后：

```javascript
// index.js
function greet(name) {
  return 'Hello, ' + name + '!'
}
console.log(greet('TypeScript'))
//# sourceMappingURL=index.js.map
```

sourceMap 文件：

```json
// index.js.map
{
  "version": 3,
  "file": "index.js",
  "sourceRoot": "",
  "sources": ["../src/index.ts"],
  "names": [],
  "mappings": "AAAA,SAAS,KAAK,CAAC,IAAY;IACzB,OAAO,WAAS,IAI,MAAG,CAAC;AACxB,CAAC;AACD,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,YAAY,CAAC,CAAC,CAAC"
}
```

## 4. 🤔 如何生成 sourceMap？

### 4.1. 命令行方式

```bash
# 生成 sourceMap
tsc --sourceMap

# 指定输出目录
tsc --sourceMap --outDir dist
```

### 4.2. 配置文件方式

```json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

```bash
tsc
```

### 4.3. 目录结构

```text
项目结构：
src/
├── index.ts
└── utils/
    └── helper.ts

编译后：
dist/
├── index.js
├── index.js.map       ✅ sourceMap 文件
└── utils/
    ├── helper.js
    └── helper.js.map  ✅ sourceMap 文件
```

### 4.4. 浏览器中查看

```text
1. 打开浏览器开发者工具
2. Sources 标签页
3. 可以看到原始 TypeScript 文件
4. 可以直接在 TypeScript 代码中设置断点
```

## 5. 🤔 相关配置选项？

### 5.1. inlineSourceMap

将 sourceMap 内联到 JS 文件中：

```json
{
  "compilerOptions": {
    "inlineSourceMap": true
  }
}
```

```javascript
// index.js（内联 sourceMap）
function greet(name) {
  return 'Hello, ' + name + '!'
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMi...
```

```text
对比：
sourceMap: true
  ├── 生成独立的 .js.map 文件
  ├── 文件更小
  └── 适合生产环境

inlineSourceMap: true
  ├── sourceMap 内联到 .js 文件
  ├── 文件更大
  └── 适合简单项目
```

### 5.2. sourceRoot

指定调试器查找 TypeScript 源文件的根路径：

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "sourceRoot": "/"
  }
}
```

### 5.3. mapRoot

指定调试器查找 sourceMap 文件的位置：

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "mapRoot": "https://cdn.example.com/maps/"
  }
}
```

### 5.4. inlineSources

将 TypeScript 源代码嵌入 sourceMap：

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true
  }
}
```

```text
作用：
- 调试时不需要访问原始 .ts 文件
- sourceMap 包含完整源代码
- 文件大小增加

适用场景：
- 生产环境调试
- 源代码不可访问
- CDN 部署
```

### 5.5. declarationMap

为声明文件生成 sourceMap：

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

```text
生成：
dist/
├── index.js
├── index.d.ts
└── index.d.ts.map    ✅ 声明文件 sourceMap

作用：
- 在编辑器中跳转到 TypeScript 源码
- 而不是跳转到 .d.ts 文件
```

## 6. 🤔 如何调试 TypeScript？

### 6.1. Node.js 调试

```json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

```text
调试步骤：
1. 在 TypeScript 代码中设置断点
2. 按 F5 启动调试
3. 程序在断点处暂停
4. 可以查看变量、执行表达式等
```

### 6.2. 浏览器调试

```json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true,
    "target": "ES2015",
    "module": "esnext"
  }
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Debug TypeScript</title>
  </head>
  <body>
    <script type="module" src="dist/index.js"></script>
  </body>
</html>
```

```text
调试步骤：
1. 编译：tsc
2. 启动本地服务器
3. 打开浏览器开发者工具
4. Sources 标签页看到 TypeScript 文件
5. 在 TypeScript 代码中设置断点
6. 刷新页面触发断点
```

### 6.3. 生产环境考虑

```json
// tsconfig.prod.json（生产）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,      // ⚠️ 关闭 sourceMap
    "removeComments": true,
    "declaration": true
  }
}

// tsconfig.dev.json（开发）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,       // ✅ 启用 sourceMap
    "incremental": true
  }
}
```

```json
// package.json
{
  "scripts": {
    "dev": "tsc -p tsconfig.dev.json --watch",
    "build": "tsc -p tsconfig.prod.json"
  }
}
```

```text
原因：
❌ 生产环境启用 sourceMap：
- 暴露源代码
- 增加文件大小
- 可能泄露商业逻辑

✅ 开发环境启用 sourceMap：
- 方便调试
- 快速定位问题
- 提升开发效率
```

### 6.4. 配合打包工具

```javascript
// webpack.config.js
module.exports = {
  mode: 'development',
  devtool: 'source-map', // ✅ 生成 sourceMap
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json', // sourceMap: true
          },
        },
      },
    ],
  },
}
```

## 7. 🔗 引用

- [TypeScript Debugging][1]
- [Source Map Specification][2]
- [Compiler Options][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://sourcemaps.info/spec.html
[3]: https://www.typescriptlang.org/tsconfig#sourceMap
