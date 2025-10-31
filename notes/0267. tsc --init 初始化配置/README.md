# [0267. tsc --init 初始化配置](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0267.%20tsc%20--init%20%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 --init 的作用？](#3----init-的作用)
  - [3.1. 基本用法](#31-基本用法)
  - [3.2. 生成的文件](#32-生成的文件)
- [4. 🤔 生成的配置内容？](#4--生成的配置内容)
  - [4.1. 完整生成文件](#41-完整生成文件)
  - [4.2. 主要配置项](#42-主要配置项)
- [5. 🤔 如何自定义配置？](#5--如何自定义配置)
  - [5.1. 根据项目类型修改](#51-根据项目类型修改)
    - [5.1.1. Node.js 项目](#511-nodejs-项目)
    - [5.1.2. 浏览器项目](#512-浏览器项目)
    - [5.1.3. 库项目](#513-库项目)
  - [5.2. 使用预设配置](#52-使用预设配置)
  - [5.3. 渐进式严格配置](#53-渐进式严格配置)
  - [5.4. 实际工作流](#54-实际工作流)
- [6. 🔗 引用](#6--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- --init 参数作用
- 生成的配置内容
- 自定义配置方法

## 2. 🫧 评价

`tsc --init` 快速生成标准的 `tsconfig.json` 配置文件，是项目初始化的便捷工具。

- 快速生成配置文件
- 包含详细注释说明
- 提供常用选项
- 新项目必备命令
- 学习配置的好材料

## 3. 🤔 --init 的作用？

`tsc --init` 在当前目录生成 `tsconfig.json` 配置文件。

### 3.1. 基本用法

```bash
# 在当前目录生成 tsconfig.json
$ tsc --init

Created a new tsconfig.json with:
  target: ES2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true

You can learn more at https://aka.ms/tsconfig
```

### 3.2. 生成的文件

```json
// tsconfig.json（简化版）
{
  "compilerOptions": {
    "target": "ES2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 4. 🤔 生成的配置内容？

### 4.1. 完整生成文件

```json
// tsconfig.json（实际生成的文件）
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,
    // "composite": true,
    // "tsBuildInfoFile": "./.tsbuildinfo",
    // "disableSourceOfProjectReferenceRedirect": true,
    // "disableSolutionSearching": true,
    // "disableReferencedProjectLoad": true,

    /* Language and Environment */
    "target": "ES2016",
    // "lib": [],
    // "jsx": "preserve",
    // "experimentalDecorators": true,
    // "emitDecoratorMetadata": true,
    // "jsxFactory": "",
    // "jsxFragmentFactory": "",
    // "jsxImportSource": "",
    // "reactNamespace": "",
    // "noLib": false,
    // "useDefineForClassFields": true,
    // "moduleDetection": "auto",

    /* Modules */
    "module": "commonjs",
    // "rootDir": "./",
    // "moduleResolution": "node10",
    // "baseUrl": "./",
    // "paths": {},
    // "rootDirs": [],
    // "typeRoots": [],
    // "types": [],
    // "allowUmdGlobalAccess": true,
    // "moduleSuffixes": [],
    // "allowImportingTsExtensions": true,
    // "resolvePackageJsonExports": true,
    // "resolvePackageJsonImports": true,
    // "customConditions": [],
    // "resolveJsonModule": true,
    // "allowArbitraryExtensions": true,
    // "noResolve": true,

    /* JavaScript Support */
    // "allowJs": true,
    // "checkJs": true,
    // "maxNodeModuleJsDepth": 1,

    /* Emit */
    // "declaration": true,
    // "declarationMap": true,
    // "emitDeclarationOnly": true,
    // "sourceMap": true,
    // "inlineSourceMap": true,
    // "outFile": "./",
    // "outDir": "./",
    // "removeComments": true,
    // "noEmit": true,
    // "importHelpers": true,
    // "importsNotUsedAsValues": "remove",
    // "downlevelIteration": true,
    // "sourceRoot": "",
    // "mapRoot": "",
    // "inlineSources": true,
    // "emitBOM": true,
    // "newLine": "crlf",
    // "stripInternal": true,
    // "noEmitHelpers": true,
    // "noEmitOnError": true,
    // "preserveConstEnums": true,
    // "declarationDir": "./",
    // "preserveValueImports": true,

    /* Interop Constraints */
    // "isolatedModules": true,
    // "verbatimModuleSyntax": true,
    // "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    // "preserveSymlinks": true,
    "forceConsistentCasingInFileNames": true,

    /* Type Checking */
    "strict": true,
    // "noImplicitAny": true,
    // "strictNullChecks": true,
    // "strictFunctionTypes": true,
    // "strictBindCallApply": true,
    // "strictPropertyInitialization": true,
    // "noImplicitThis": true,
    // "useUnknownInCatchVariables": true,
    // "alwaysStrict": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "exactOptionalPropertyTypes": true,
    // "noImplicitReturns": true,
    // "noFallthroughCasesInSwitch": true,
    // "noUncheckedIndexedAccess": true,
    // "noImplicitOverride": true,
    // "noPropertyAccessFromIndexSignature": true,
    // "allowUnusedLabels": true,
    // "allowUnreachableCode": true,

    /* Completeness */
    // "skipDefaultLibCheck": true,
    "skipLibCheck": true
  }
}
```

### 4.2. 主要配置项

```text
默认启用的选项：
✅ target: ES2016
✅ module: commonjs
✅ strict: true
✅ esModuleInterop: true
✅ skipLibCheck: true
✅ forceConsistentCasingInFileNames: true

其他选项：
⚠️ 全部被注释（需要手动启用）
📝 包含详细的说明注释
🔗 包含官方文档链接
```

## 5. 🤔 如何自定义配置？

### 5.1. 根据项目类型修改

#### 5.1.1. Node.js 项目

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
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 5.1.2. 浏览器项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

#### 5.1.3. 库项目

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
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 5.2. 使用预设配置

```bash
# 安装预设
npm install --save-dev @tsconfig/node16

# 或其他预设
npm install --save-dev @tsconfig/react-native
npm install --save-dev @tsconfig/recommended
```

```json
// 使用预设
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 5.3. 渐进式严格配置

```json
// 第一阶段：基础配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": false,
    "allowJs": true,
    "outDir": "./dist"
  }
}

// 第二阶段：启用部分严格检查
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "noImplicitAny": true,
    "strictNullChecks": true,
    "outDir": "./dist"
  }
}

// 第三阶段：完全严格
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "outDir": "./dist"
  }
}
```

### 5.4. 实际工作流

```bash
# 1. 初始化项目
mkdir my-project && cd my-project
npm init -y

# 2. 安装 TypeScript
npm install --save-dev typescript

# 3. 生成配置文件
npx tsc --init

# 4. 根据项目类型修改配置
# 编辑 tsconfig.json

# 5. 创建源码目录
mkdir src
echo "console.log('Hello, TypeScript!');" > src/index.ts

# 6. 编译
npx tsc

# 7. 运行
node dist/index.js
```

## 6. 🔗 引用

- [TSConfig Reference][1]
- [TSConfig Bases][2]
- [Compiler Options][3]

[1]: https://www.typescriptlang.org/tsconfig
[2]: https://github.com/tsconfig/bases
[3]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
