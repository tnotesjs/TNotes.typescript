# [0264. tsc --noEmit 只检查不输出](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0264.%20tsc%20--noEmit%20%E5%8F%AA%E6%A3%80%E6%9F%A5%E4%B8%8D%E8%BE%93%E5%87%BA)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 --noEmit 的作用？](#3----noemit-的作用)
  - [3.1. 基本用法](#31-基本用法)
  - [3.2. 配置文件方式](#32-配置文件方式)
  - [3.3. 执行过程](#33-执行过程)
  - [3.4. 示例](#34-示例)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- --noEmit 参数作用
- 使用场景
- 参数组合
- CI/CD 应用

## 2. 🫧 评价

`--noEmit` 让 TypeScript 只进行类型检查而不生成输出文件，是 CI/CD 和类型检查的常用选项。

- 只检查类型不生成文件
- CI/CD 中必备选项
- 配合打包工具使用
- 提升检查速度
- 避免不必要的文件生成

## 3. 🤔 --noEmit 的作用？

`--noEmit` 告诉 TypeScript 只执行类型检查，不生成任何输出文件。

### 3.1. 基本用法

```bash
# 只检查类型，不生成文件
tsc --noEmit

# 检查指定文件
tsc --noEmit index.ts

# 使用配置文件
tsc --noEmit --project tsconfig.json
```

### 3.2. 配置文件方式

```json
// tsconfig.json
{
  "compilerOptions": {
    "noEmit": true,
    "strict": true
  }
}
```

```bash
tsc
```

### 3.3. 执行过程

```text
普通编译（tsc）：
1. 解析 TypeScript 代码
2. 执行类型检查
3. 转换为 JavaScript   ✅ 生成 .js 文件
4. 生成 sourceMap        ✅ 生成 .map 文件
5. 生成声明文件          ✅ 生成 .d.ts 文件

使用 --noEmit：
1. 解析 TypeScript 代码
2. 执行类型检查
3. ❌ 跳过文件生成
4. 退出（返回错误码）
```

### 3.4. 示例

```typescript
// index.ts
function greet(name: string): string {
  return `Hello, ${name}!`
}

greet(123) // ❌ 类型错误
```

```bash
$ tsc --noEmit

index.ts:5:7 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

5 greet(123);
        ~~~

Found 1 error in index.ts:5
```

```text
结果：
✅ 检测到类型错误
❌ 没有生成任何文件
```

## 4. 🤔 使用场景？

### 4.1. CI/CD 类型检查

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run type-check # tsc --noEmit

  build:
    runs-on: ubuntu-latest
    needs: type-check
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build # Webpack/Vite 构建
```

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "vite build"
  }
}
```

### 4.2. 配合打包工具

```text
现代项目架构：

TypeScript  →  tsc --noEmit     ✅ 类型检查
            ↓
           Babel/Webpack/Vite   ✅ 转译和打包
            ↓
         生产代码

优势：
- TypeScript 专注类型检查
- 打包工具处理代码转换
- 各司其职，性能更好
```

```json
// tsconfig.json（只用于类型检查）
{
  "compilerOptions": {
    "noEmit": true,
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

### 4.3. 编辑器集成

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "TypeScript Type Check",
      "type": "shell",
      "command": "tsc",
      "args": ["--noEmit", "--watch"],
      "isBackground": true,
      "problemMatcher": "$tsc-watch"
    }
  ]
}
```

### 4.4. Git Hooks

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run type-check"
    }
  }
}
```

```bash
# 提交前自动检查类型
git commit -m "feat: add new feature"

# 如果有类型错误，提交被阻止
```

## 5. � 与其他选项配合？

### 5.1. watch 模式

```bash
# 持续监听并检查类型
tsc --noEmit --watch
```

```json
// package.json
{
  "scripts": {
    "dev": "concurrently \"tsc --noEmit --watch\" \"vite\""
  }
}
```

```text
效果：
- tsc 持续检查类型
- vite 负责开发服务器
- 两者并行运行
```

### 5.2. 指定项目

```bash
# 检查特定项目
tsc --noEmit --project tsconfig.prod.json

# 检查多个项目
tsc --noEmit --project packages/*/tsconfig.json
```

### 5.3. 跳过库检查

```bash
# 跳过 node_modules 中的类型检查（提升速度）
tsc --noEmit --skipLibCheck
```

```json
{
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true // ✅ 提升检查速度
  }
}
```

### 5.4. 增量检查

```bash
# 增量类型检查（利用缓存）
tsc --noEmit --incremental
```

```json
{
  "compilerOptions": {
    "noEmit": true,
    "incremental": true
  }
}
```

```text
优势：
- 首次检查：完整检查
- 后续检查：只检查变化的文件
- 大幅提升速度
```

## 6. 🤔 CI/CD 中的应用？

### 6.1. 完整 CI 配置

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Type Check
        run: npm run type-check

  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [type-check, lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### 6.2. package.json 脚本

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "jest",
    "build": "vite build"
  }
}
```

### 6.3. GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - check
  - test
  - build

type-check:
  stage: check
  script:
    - npm ci
    - npm run type-check

lint:
  stage: check
  script:
    - npm ci
    - npm run lint

test:
  stage: test
  script:
    - npm ci
    - npm test

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
```

### 6.4. 性能优化

```json
// tsconfig.json（CI 优化配置）
{
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true, // ✅ 跳过库检查
    "incremental": true, // ✅ 增量检查
    "tsBuildInfoFile": ".cache/tsbuildinfo"
  }
}
```

```yaml
# 缓存 tsbuildinfo
cache:
  paths:
    - node_modules/
    - .cache/
```

## 7. 🔗 引用

- [Compiler Options][1]
- [Project Configuration][2]
- [CI/CD Best Practices][3]

[1]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[2]: https://www.typescriptlang.org/tsconfig
[3]: https://www.typescriptlang.org/docs/handbook/configuring-watch.html
