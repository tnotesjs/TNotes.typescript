# [0248. 常用编译配置组合](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0248.%20%E5%B8%B8%E7%94%A8%E7%BC%96%E8%AF%91%E9%85%8D%E7%BD%AE%E7%BB%84%E5%90%88)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Node.js 项目配置？](#3--nodejs-项目配置)
  - [3.1. 基础 Node.js 项目](#31-基础-nodejs-项目)
  - [3.2. Node.js + TypeScript 最新版](#32-nodejs--typescript-最新版)
  - [3.3. Express 应用](#33-express-应用)
- [4. 🤔 前端项目配置？](#4--前端项目配置)
  - [4.1. React 项目](#41-react-项目)
  - [4.2. Vue 3 项目](#42-vue-3-项目)
  - [4.3. Next.js 项目](#43-nextjs-项目)
- [5. 🤔 库项目配置？](#5--库项目配置)
  - [5.1. 通用库配置](#51-通用库配置)
  - [5.2. 多格式输出（ESM + CJS）](#52-多格式输出esm--cjs)
- [6. 🤔 Monorepo 配置？](#6--monorepo-配置)
  - [6.1. Monorepo 根配置](#61-monorepo-根配置)
  - [6.2. 子包配置](#62-子包配置)
- [7. 🤔 如何选择合适的配置？](#7--如何选择合适的配置)
  - [7.1. 根据项目类型选择](#71-根据项目类型选择)
  - [7.2. 开发 vs. 生产](#72-开发-vs-生产)
  - [7.3. 严格程度](#73-严格程度)
  - [7.4. 使用预设配置](#74-使用预设配置)
  - [7.5. 迁移策略](#75-迁移策略)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- Node.js 项目配置
- React/Vue 前端配置
- 库项目配置
- Monorepo 配置
- 全栈项目配置
- 配置选择建议

## 2. 🫧 评价

不同类型项目需要不同的 TypeScript 配置，本节提供常见场景的最佳实践配置模板。

- 开箱即用的配置模板
- 针对不同项目类型优化
- 包含开发和生产环境
- 遵循社区最佳实践
- 可直接复制使用
- 节省配置时间

## 3. 🤔 Node.js 项目配置？

### 3.1. 基础 Node.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "moduleResolution": "node",
    "resolveJsonModule": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.2. Node.js + TypeScript 最新版

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "moduleResolution": "node16",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,

    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

### 3.3. Express 应用

```json
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "incremental": true,
    "types": ["node", "express"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 4. 🤔 前端项目配置？

### 4.1. React 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "esnext",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    "allowSyntheticDefaultImports": true,
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.2. Vue 3 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.3. Next.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 5. 🤔 库项目配置？

### 5.1. 通用库配置

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "esnext",
    "lib": ["ES2015"],

    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

### 5.2. 多格式输出（ESM + CJS）

```json
// tsconfig.json（基础配置）
{
  "compilerOptions": {
    "target": "ES2015",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

// tsconfig.esm.json（ESM 构建）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "esnext",
    "outDir": "./dist/esm"
  }
}

// tsconfig.cjs.json（CommonJS 构建）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist/cjs"
  }
}
```

```json
// package.json
{
  "name": "my-library",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/esm/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/esm/index.d.ts"
    }
  },
  "scripts": {
    "build": "npm run build:esm && npm run build:cjs",
    "build:esm": "tsc -p tsconfig.esm.json",
    "build:cjs": "tsc -p tsconfig.cjs.json"
  }
}
```

## 6. 🤔 Monorepo 配置？

### 6.1. Monorepo 根配置

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    "moduleResolution": "node",
    "resolveJsonModule": true,
    "composite": true
  }
}

// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/app" }
  ]
}
```

### 6.2. 子包配置

```json
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../core" },
    { "path": "../utils" }
  ],
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 7. 🤔 如何选择合适的配置？

### 7.1. 根据项目类型选择

```text
Node.js 服务器：
- target: ES2020
- module: commonjs 或 node16
- lib: ES2020

浏览器应用：
- target: ES2020
- module: esnext
- lib: ES2020, DOM, DOM.Iterable
- jsx: react-jsx 或 preserve

库项目：
- target: ES2015（更广兼容性）
- declaration: true
- 多格式输出

Monorepo：
- composite: true
- references: [...]
- 继承基础配置
```

### 7.2. 开发 vs. 生产

```json
// tsconfig.json（开发）
{
  "compilerOptions": {
    "sourceMap": true,
    "incremental": true,
    "noEmit": false
  }
}

// tsconfig.prod.json（生产）
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true,
    "declaration": true
  }
}
```

### 7.3. 严格程度

```json
// 宽松（快速开发）
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true
  }
}

// 标准（推荐）
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}

// 严格（高质量）
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 7.4. 使用预设配置

```bash
# 安装预设
npm install --save-dev @tsconfig/node16
npm install --save-dev @tsconfig/react-native
npm install --save-dev @tsconfig/recommended
```

```json
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 7.5. 迁移策略

```text
阶段 1：基础配置
- 启用 TypeScript
- 关闭严格检查
- allowJs: true

阶段 2：逐步严格
- 启用 noImplicitAny
- 启用 strictNullChecks
- 修复错误

阶段 3：完全严格
- strict: true
- 启用所有检查
- 代码质量最佳
```

## 8. 🔗 引用

- [TSConfig Bases][1]
- [TypeScript Configuration][2]
- [Project Examples][3]

[1]: https://github.com/tsconfig/bases
[2]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
[3]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html
