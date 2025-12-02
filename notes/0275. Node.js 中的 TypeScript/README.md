# [0275. Node.js 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0275.%20Node.js%20%E4%B8%AD%E7%9A%84%20TypeScript)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Node.js 项目配置？](#3--nodejs-项目配置)
  - [3.1. 基本 tsconfig.json](#31-基本-tsconfigjson)
  - [3.2. ESM 项目配置](#32-esm-项目配置)
  - [3.3. 安装类型定义](#33-安装类型定义)
- [4. 🤔 模块系统类型？](#4--模块系统类型)
  - [4.1. CommonJS 模块](#41-commonjs-模块)
  - [4.2. ES 模块](#42-es-模块)
  - [4.3. require 类型](#43-require-类型)
  - [4.4. 动态导入](#44-动态导入)
- [5. 🤔 异步操作类型？](#5--异步操作类型)
  - [5.1. Promise 类型](#51-promise-类型)
  - [5.2. 回调函数类型](#52-回调函数类型)
  - [5.3. Promise 化](#53-promise-化)
  - [5.4. EventEmitter 类型](#54-eventemitter-类型)
- [6. 🤔 文件系统类型？](#6--文件系统类型)
  - [6.1. fs 模块](#61-fs-模块)
  - [6.2. 文件操作类型](#62-文件操作类型)
  - [6.3. Stream 类型](#63-stream-类型)
- [7. 🤔 HTTP 服务类型？](#7--http-服务类型)
  - [7.1. 原生 http 模块](#71-原生-http-模块)
  - [7.2. Express 类型](#72-express-类型)
  - [7.3. 自定义类型扩展](#73-自定义类型扩展)
  - [7.4. 错误处理](#74-错误处理)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- Node.js 项目配置
- 模块系统类型
- 异步操作类型
- 文件系统类型
- HTTP 服务类型

## 2. 🫧 评价

TypeScript 在 Node.js 开发中提供了完善的类型支持，提升后端开发体验。

- 完整的 Node.js API 类型
- 支持 ESM 和 CommonJS
- 异步操作类型安全
- 减少运行时错误
- 生产环境广泛应用

## 3. 🤔 Node.js 项目配置？

### 3.1. 基本 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.2. ESM 项目配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

```json
// package.json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

### 3.3. 安装类型定义

```bash
# ✅ 安装 Node.js 类型定义
npm install --save-dev @types/node

# ✅ 常用库的类型定义
npm install --save-dev @types/express
npm install --save-dev @types/node
```

## 4. 🤔 模块系统类型？

### 4.1. CommonJS 模块

```ts
// ✅ 导出
export function greet(name: string): string {
  return `Hello, ${name}`
}

export class User {
  constructor(public name: string) {}
}

// ✅ 默认导出
export default function main() {
  console.log('Main function')
}

// ✅ 导入
import { greet, User } from './utils'
import main from './main'
```

### 4.2. ES 模块

```ts
// ✅ 命名导出
export const API_URL = 'https://api.example.com'

export function fetchData(url: string): Promise<unknown> {
  return fetch(url).then((res) => res.json())
}

// ✅ 默认导出
export default class Server {
  start() {
    console.log('Server started')
  }
}

// ✅ 导入
import Server from './server.js' // ESM 需要 .js 扩展名
import { API_URL, fetchData } from './utils.js'
```

### 4.3. require 类型

```ts
// ✅ CommonJS require
const fs = require('fs') // ❌ 类型为 any

// ✅ 使用 import = require
import fs = require('fs') // ✅ 有类型

// ✅ 或使用 import
import * as fs from 'fs'
```

### 4.4. 动态导入

```ts
// ✅ 动态导入类型
async function loadModule() {
  const { greet } = await import('./utils.js')
  console.log(greet('World'))
}

// ✅ 类型断言
interface Utils {
  greet(name: string): string
}

const utils = (await import('./utils.js')) as Utils
```

## 5. 🤔 异步操作类型？

### 5.1. Promise 类型

```ts
// ✅ Promise 返回类型
function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then((res) => res.json())
    .then((data) => data as User)
}

// ✅ async/await
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()
  return data as User
}
```

### 5.2. 回调函数类型

```ts
import { readFile } from 'fs'

// ✅ Node.js 风格回调
type NodeCallback<T> = (err: Error | null, data: T) => void

readFile('file.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data) // data 类型：string
})
```

### 5.3. Promise 化

```ts
import { promisify } from 'util'
import { readFile } from 'fs'

// ✅ promisify 保留类型
const readFileAsync = promisify(readFile)

async function readContent() {
  const data = await readFileAsync('file.txt', 'utf-8')
  console.log(data) // data 类型：string
}
```

### 5.4. EventEmitter 类型

```ts
import { EventEmitter } from 'events'

// ✅ 类型安全的事件
interface MyEvents {
  data: (value: number) => void
  error: (err: Error) => void
  close: () => void
}

class MyEmitter extends EventEmitter {
  on<K extends keyof MyEvents>(event: K, listener: MyEvents[K]): this {
    return super.on(event, listener)
  }

  emit<K extends keyof MyEvents>(
    event: K,
    ...args: Parameters<MyEvents[K]>
  ): boolean {
    return super.emit(event, ...args)
  }
}

const emitter = new MyEmitter()

emitter.on('data', (value) => {
  console.log(value) // value 类型：number
})

emitter.emit('data', 42)
// emitter.emit("data", "invalid");  // Error
```

## 6. 🤔 文件系统类型？

### 6.1. fs 模块

```ts
import * as fs from 'fs'
import { promises as fsPromises } from 'fs'

// ✅ 同步操作
const content: string = fs.readFileSync('file.txt', 'utf-8')

// ✅ 异步操作
fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data) // data 类型：string
})

// ✅ Promise API
async function readContent() {
  const data = await fsPromises.readFile('file.txt', 'utf-8')
  console.log(data) // data 类型：string
}
```

### 6.2. 文件操作类型

```ts
import { readFile, writeFile, stat } from 'fs/promises'
import { Stats } from 'fs'

// ✅ 读取文件
async function readJSON<T>(filename: string): Promise<T> {
  const content = await readFile(filename, 'utf-8')
  return JSON.parse(content) as T
}

// ✅ 写入文件
async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  await writeFile(filename, content, 'utf-8')
}

// ✅ 文件信息
async function getFileInfo(filename: string): Promise<Stats> {
  return await stat(filename)
}

// 使用
interface Config {
  port: number
  host: string
}

const config = await readJSON<Config>('config.json')
```

### 6.3. Stream 类型

```ts
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'

// ✅ 读取流
const readStream = createReadStream('input.txt', 'utf-8')

readStream.on('data', (chunk: string) => {
  console.log(chunk)
})

// ✅ 转换流
class UpperCaseTransform extends Transform {
  _transform(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error | null, data?: Buffer) => void
  ): void {
    const upperChunk = Buffer.from(chunk.toString().toUpperCase())
    callback(null, upperChunk)
  }
}

// 使用
createReadStream('input.txt')
  .pipe(new UpperCaseTransform())
  .pipe(createWriteStream('output.txt'))
```

## 7. 🤔 HTTP 服务类型？

### 7.1. 原生 http 模块

```ts
import * as http from 'http'

// ✅ 创建服务器
const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World')
  }
)

server.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

### 7.2. Express 类型

```ts
import express, { Request, Response, NextFunction } from 'express'

const app = express()

// ✅ 基本路由
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

// ✅ 路由参数
app.get('/users/:id', (req: Request<{ id: string }>, res: Response) => {
  const userId = req.params.id // 类型：string
  res.json({ userId })
})

// ✅ 查询参数
interface UserQuery {
  name?: string
  age?: string
}

app.get('/search', (req: Request<{}, {}, {}, UserQuery>, res: Response) => {
  const { name, age } = req.query
  res.json({ name, age })
})

// ✅ 请求体
interface CreateUserBody {
  name: string
  email: string
}

app.post('/users', (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { name, email } = req.body
  res.json({ name, email })
})

// ✅ 中间件
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

app.use(authMiddleware)
```

### 7.3. 自定义类型扩展

```ts
// ✅ 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        name: string
      }
    }
  }
}

// 中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { id: 1, name: 'Tom' }
  next()
})

// 路由
app.get('/profile', (req: Request, res: Response) => {
  // req.user 有类型
  console.log(req.user?.name)
})
```

### 7.4. 错误处理

```ts
// ✅ 错误处理中间件
interface ApiError extends Error {
  statusCode?: number
}

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message,
  })
})
```

## 8. 🔗 引用

- [Node.js TypeScript][1]
- [@types/node][2]
- [DefinitelyTyped][3]

[1]: https://nodejs.org/en/learn/getting-started/nodejs-with-typescript
[2]: https://www.npmjs.com/package/@types/node
[3]: https://github.com/DefinitelyTyped/DefinitelyTyped
