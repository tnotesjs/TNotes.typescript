# [0250. AST 抽象语法树](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0250.%20AST%20%E6%8A%BD%E8%B1%A1%E8%AF%AD%E6%B3%95%E6%A0%91)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 什么是 AST？](#3--什么是-ast)
  - [3.1. 基本概念](#31-基本概念)
  - [3.2. 为什么需要 AST](#32-为什么需要-ast)
- [4. 🤔 AST 的结构？](#4--ast-的结构)
  - [4.1. Node 节点类型](#41-node-节点类型)
  - [4.2. 节点属性](#42-节点属性)
  - [4.3. 变量声明示例](#43-变量声明示例)
  - [4.4. 函数声明示例](#44-函数声明示例)
- [5. 🤔 如何使用 TypeScript Compiler API？](#5--如何使用-typescript-compiler-api)
  - [5.1. 创建和解析源文件](#51-创建和解析源文件)
  - [5.2. 访问特定节点](#52-访问特定节点)
  - [5.3. 获取类型信息](#53-获取类型信息)
- [6. 🤔 如何遍历和操作 AST？](#6--如何遍历和操作-ast)
  - [6.1. 深度优先遍历](#61-深度优先遍历)
  - [6.2. 使用 Visitor 模式](#62-使用-visitor-模式)
  - [6.3. Transformer API](#63-transformer-api)
- [7. 🤔 AST 的实际应用？](#7--ast-的实际应用)
  - [7.1. 代码分析工具](#71-代码分析工具)
  - [7.2. 代码重构工具](#72-代码重构工具)
  - [7.3. 代码生成工具](#73-代码生成工具)
  - [7.4. Lint 规则实现](#74-lint-规则实现)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- AST 概念
- AST 结构
- TypeScript Compiler API
- AST 遍历和操作
- 实际应用场景

## 2. 🫧 评价

AST 是编译器的核心数据结构，掌握 AST 能够进行代码分析和转换。

- 编译器核心概念
- 代码静态分析基础
- 工具开发必备知识
- 自动化重构工具
- Lint 工具原理

## 3. 🤔 什么是 AST？

AST（Abstract Syntax Tree，抽象语法树）是源代码结构的树状表示。

### 3.1. 基本概念

```typescript
// 源代码
const x = 1 + 2

// AST 树状结构（简化）
/*
VariableStatement
└── VariableDeclarationList
    └── VariableDeclaration
        ├── Identifier: "x"
        └── BinaryExpression
            ├── NumericLiteral: 1
            ├── Operator: +
            └── NumericLiteral: 2
*/
```

### 3.2. 为什么需要 AST

```typescript
// ✅ AST 的用途

// 1. 类型检查
const name: string = 123 // AST 帮助检测类型错误

// 2. 代码转换
// TypeScript -> JavaScript
class Foo {} // 转换为 ES5/ES6 代码

// 3. 代码分析
// 查找所有函数调用
function foo() {}
foo()

// 4. 代码格式化
// Prettier, ESLint 等工具

// 5. 代码优化
// 死代码消除、常量折叠
```

## 4. 🤔 AST 的结构？

### 4.1. Node 节点类型

```typescript
import * as ts from 'typescript'

// TypeScript 中的主要节点类型
enum SyntaxKind {
  // 声明
  VariableDeclaration,
  FunctionDeclaration,
  ClassDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,

  // 表达式
  BinaryExpression,
  CallExpression,
  PropertyAccessExpression,
  ArrowFunction,

  // 语句
  IfStatement,
  ForStatement,
  WhileStatement,
  ReturnStatement,

  // 字面量
  StringLiteral,
  NumericLiteral,
  TrueLiteral,
  FalseLiteral,

  // 类型
  TypeReference,
  UnionType,
  IntersectionType,
  // ...更多
}
```

### 4.2. 节点属性

```typescript
// TypeScript Node 接口
interface Node {
  kind: SyntaxKind // 节点类型
  flags: NodeFlags // 节点标志
  parent?: Node // 父节点
  pos: number // 起始位置
  end: number // 结束位置

  getSourceFile(): SourceFile
  getChildCount(): number
  getChildren(): Node[]
  getText(): string
}
```

### 4.3. 变量声明示例

```typescript
// 源代码
const message: string = 'Hello'

// AST 结构详解
const sourceFile = ts.createSourceFile(
  'example.ts',
  'const message: string = "Hello";',
  ts.ScriptTarget.ES2015,
  true
)

// 访问 AST 节点
function printNode(node: ts.Node, indent = 0) {
  const spaces = ' '.repeat(indent)
  console.log(spaces + ts.SyntaxKind[node.kind])

  node.forEachChild((child) => printNode(child, indent + 2))
}

printNode(sourceFile)
/*
SourceFile
  VariableStatement
    VariableDeclarationList
      VariableDeclaration
        Identifier (message)
        StringKeyword (string)
        StringLiteral ("Hello")
  EndOfFileToken
*/
```

### 4.4. 函数声明示例

```typescript
// 源代码
function add(a: number, b: number): number {
  return a + b
}

// AST 结构
/*
FunctionDeclaration
├── Identifier: "add"
├── Parameter
│   ├── Identifier: "a"
│   └── TypeReference: number
├── Parameter
│   ├── Identifier: "b"
│   └── TypeReference: number
├── TypeReference: number (返回类型)
└── Block
    └── ReturnStatement
        └── BinaryExpression
            ├── Identifier: "a"
            ├── Operator: +
            └── Identifier: "b"
*/
```

## 5. 🤔 如何使用 TypeScript Compiler API？

### 5.1. 创建和解析源文件

```typescript
import * as ts from 'typescript'

// ✅ 从字符串创建源文件
const sourceCode = `
  interface User {
    name: string;
    age: number;
  }
  
  const user: User = {
    name: "Tom",
    age: 25
  };
`

const sourceFile = ts.createSourceFile(
  'example.ts',
  sourceCode,
  ts.ScriptTarget.ES2015,
  true // setParentNodes
)

console.log(sourceFile.statements.length) // 2（interface 和 const）
```

### 5.2. 访问特定节点

```typescript
// ✅ 查找所有变量声明
function findVariableDeclarations(sourceFile: ts.SourceFile) {
  const variables: ts.VariableDeclaration[] = []

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node)) {
      variables.push(node)
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return variables
}

const vars = findVariableDeclarations(sourceFile)
vars.forEach((v) => {
  const name = v.name.getText(sourceFile)
  console.log(`变量：${name}`)
})
```

### 5.3. 获取类型信息

```typescript
// ✅ 使用 TypeChecker 获取类型
function getTypeInfo(sourceCode: string) {
  const sourceFile = ts.createSourceFile(
    'example.ts',
    sourceCode,
    ts.ScriptTarget.ES2015,
    true
  )

  // 创建程序
  const compilerHost: ts.CompilerHost = {
    getSourceFile: (fileName) =>
      fileName === 'example.ts' ? sourceFile : undefined,
    writeFile: () => {},
    getCurrentDirectory: () => '',
    getDirectories: () => [],
    fileExists: () => true,
    readFile: () => '',
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
    getDefaultLibFileName: () => 'lib.d.ts',
  }

  const program = ts.createProgram(['example.ts'], {}, compilerHost)

  const checker = program.getTypeChecker()

  // 访问节点并获取类型
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node)) {
      const type = checker.getTypeAtLocation(node)
      const typeName = checker.typeToString(type)
      const name = node.name.getText(sourceFile)
      console.log(`${name}: ${typeName}`)
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
}

getTypeInfo(`
  const name = "Tom";
  const age = 25;
  const user = { name: "Tom", age: 25 };
`)
// name: "Tom"
// age: 25
// user: { name: string; age: number; }
```

## 6. 🤔 如何遍历和操作 AST？

### 6.1. 深度优先遍历

```typescript
// ✅ 递归遍历所有节点
function traverseAST(node: ts.Node, callback: (node: ts.Node) => void) {
  callback(node)
  ts.forEachChild(node, (child) => traverseAST(child, callback))
}

// 使用
traverseAST(sourceFile, (node) => {
  console.log(ts.SyntaxKind[node.kind])
})
```

### 6.2. 使用 Visitor 模式

```typescript
// ✅ Visitor 模式
class ASTVisitor {
  visitSourceFile(node: ts.SourceFile) {
    this.visitNode(node)
  }

  visitNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.FunctionDeclaration:
        this.visitFunctionDeclaration(node as ts.FunctionDeclaration)
        break
      case ts.SyntaxKind.ClassDeclaration:
        this.visitClassDeclaration(node as ts.ClassDeclaration)
        break
      case ts.SyntaxKind.InterfaceDeclaration:
        this.visitInterfaceDeclaration(node as ts.InterfaceDeclaration)
        break
    }

    ts.forEachChild(node, (child) => this.visitNode(child))
  }

  visitFunctionDeclaration(node: ts.FunctionDeclaration) {
    console.log(`函数：${node.name?.getText()}`)
  }

  visitClassDeclaration(node: ts.ClassDeclaration) {
    console.log(`类：${node.name?.getText()}`)
  }

  visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
    console.log(`接口：${node.name?.getText()}`)
  }
}

const visitor = new ASTVisitor()
visitor.visitSourceFile(sourceFile)
```

### 6.3. Transformer API

```typescript
// ✅ 使用 Transformer 修改 AST
function removeConsoleLog(): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = (node: ts.Node): ts.Node | undefined => {
        // 移除 console.log 调用
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          node.expression.expression.getText() === 'console' &&
          node.expression.name.getText() === 'log'
        ) {
          return undefined // 移除节点
        }

        return ts.visitEachChild(node, visitor, context)
      }

      return ts.visitNode(sourceFile, visitor)
    }
  }
}

// 使用 transformer
const result = ts.transform(sourceFile, [removeConsoleLog()])
const transformedFile = result.transformed[0]
const printer = ts.createPrinter()
const output = printer.printFile(transformedFile)

console.log(output)
```

## 7. 🤔 AST 的实际应用？

### 7.1. 代码分析工具

```typescript
// ✅ 查找未使用的变量
function findUnusedVariables(sourceFile: ts.SourceFile) {
  const declared = new Set<string>()
  const used = new Set<string>()

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node)) {
      const name = node.name.getText(sourceFile)
      declared.add(name)
    }

    if (ts.isIdentifier(node)) {
      const name = node.getText(sourceFile)
      used.add(name)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  const unused = Array.from(declared).filter((name) => !used.has(name))
  return unused
}
```

### 7.2. 代码重构工具

```typescript
// ✅ 重命名变量
function renameVariable(
  sourceFile: ts.SourceFile,
  oldName: string,
  newName: string
): string {
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    return (root: ts.SourceFile) => {
      const visitor = (node: ts.Node): ts.Node => {
        if (ts.isIdentifier(node) && node.text === oldName) {
          return ts.factory.createIdentifier(newName)
        }
        return ts.visitEachChild(node, visitor, context)
      }
      return ts.visitNode(root, visitor)
    }
  }

  const result = ts.transform(sourceFile, [transformer])
  const printer = ts.createPrinter()
  return printer.printFile(result.transformed[0])
}
```

### 7.3. 代码生成工具

```typescript
// ✅ 生成类型安全的 API 客户端
function generateAPIClient(endpoints: { name: string; path: string }[]) {
  const statements: ts.Statement[] = endpoints.map((endpoint) => {
    return ts.factory.createFunctionDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      endpoint.name,
      undefined,
      [],
      ts.factory.createTypeReferenceNode('Promise', [
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
      ]),
      ts.factory.createBlock([
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier('fetch'),
            undefined,
            [ts.factory.createStringLiteral(endpoint.path)]
          )
        ),
      ])
    )
  })

  const sourceFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  )

  const printer = ts.createPrinter()
  return printer.printFile(sourceFile)
}

const code = generateAPIClient([
  { name: 'getUsers', path: '/api/users' },
  { name: 'getUser', path: '/api/users/:id' },
])

console.log(code)
/*
export function getUsers(): Promise<any> {
    return fetch("/api/users");
}
export function getUser(): Promise<any> {
    return fetch("/api/users/:id");
}
*/
```

### 7.4. Lint 规则实现

```typescript
// ✅ 自定义 Lint 规则：禁止使用 var
function noVarRule(sourceFile: ts.SourceFile): string[] {
  const errors: string[] = []

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      const declarationList = node.declarationList
      if (declarationList.flags & ts.NodeFlags.Let) {
        // let
      } else if (declarationList.flags & ts.NodeFlags.Const) {
        // const
      } else {
        // var
        errors.push(`不应使用 var，请使用 let 或 const`)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return errors
}
```

## 8. 🔗 引用

- [TypeScript Compiler API][1]
- [AST Explorer][2]
- [ts-morph Library][3]

[1]: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
[2]: https://astexplorer.net/
[3]: https://ts-morph.com/
