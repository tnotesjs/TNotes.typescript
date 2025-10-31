# [0224. @ts-nocheck](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0224.%20%40ts-nocheck)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 @ts-nocheck 的作用是什么？](#3--ts-nocheck-的作用是什么)
- [4. 🤔 何时应该使用 @ts-nocheck？](#4--何时应该使用-ts-nocheck)
- [5. 🆚 @ts-nocheck vs. @ts-ignore](#5--ts-nocheck-vs-ts-ignore)
- [6. 🤔 使用 @ts-nocheck 时需要注意哪些问题？](#6--使用-ts-nocheck-时需要注意哪些问题)
- [7. 🔗 引用](#7--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- `@ts-nocheck` 注释的基本用法
- 跳过整个文件的类型检查
- 在迁移项目中的应用
- 与其他类型检查指令的对比

## 2. 🫧 评价

`@ts-nocheck` 是文件级别的类型检查跳过指令,用于完全禁用某个文件的 TypeScript 类型检查。

- 必须放在文件的第一行（注释之前）
- 适合处理遗留代码或生成的代码
- 在 JavaScript 迁移到 TypeScript 的过程中非常有用
- 应该作为临时方案，最终目标是移除它
- 过度使用会失去 TypeScript 的类型安全优势

## 3. 🤔 @ts-nocheck 的作用是什么？

`@ts-nocheck` 跳过整个文件的类型检查：

```typescript
// @ts-nocheck
// ⚠️ 必须是文件的第一行

// 文件中所有代码都不会进行类型检查
function add(a, b) {
  return a + b
}

// ✅ 不会报错，即使类型不匹配
const result: number = add('hello', 'world')

// ✅ 不会报错，即使属性不存在
interface User {
  name: string
}

const user: User = {
  name: 'Alice',
  age: 30, // 额外属性不会报错
}

// ✅ 不会报错，即使调用不存在的方法
const value: string = 'hello'
value.nonExistentMethod()
```

**位置要求：**

```typescript
// ❌ 错误：不是第一行
// 文件说明
// @ts-nocheck

// ❌ 错误：前面有其他注释
/**
 * 文件文档注释
 */
// @ts-nocheck

// ✅ 正确：第一行
// @ts-nocheck
/**
 * 文件文档注释
 */

// ✅ 正确：可以跟其他注释在同一行
// @ts-nocheck - 遗留代码，待重构

// ✅ 正确：可以是块注释
/* @ts-nocheck */
```

**作用范围：**

```typescript
// file1.ts
// @ts-nocheck

// 此文件中所有代码都不检查
function badFunction() {
  return 'hello' + 123
}

export { badFunction }

// file2.ts
// 此文件正常检查类型
import { badFunction } from './file1'

// ❌ 这里会报错，因为 file2.ts 没有 @ts-nocheck
const result: string = badFunction()
```

**与 checkJs 配合使用：**

```typescript
// JavaScript 文件：myScript.js
// @ts-nocheck

// 即使 tsconfig.json 中 checkJs: true
// 这个文件也不会被检查

function calculate(x, y) {
  return x + y;
}

module.exports = { calculate };

// tsconfig.json
{
  "compilerOptions": {
    "checkJs": true, // 检查 JS 文件
    "allowJs": true
  }
}
```

## 4. 🤔 何时应该使用 @ts-nocheck？

合理使用 `@ts-nocheck` 的场景：

```typescript
// 场景 1：迁移遗留代码
// legacy-utils.js
// @ts-nocheck
// TODO: 逐步迁移到 TypeScript - TASK-123

// 大量复杂的遗留 JavaScript 代码
function complexLegacyLogic(data) {
  // 几百行复杂逻辑
  return processData(data)
}

module.exports = { complexLegacyLogic }

// 场景 2：第三方代码或生成的代码
// generated/api-client.ts
// @ts-nocheck
// 此文件由 swagger-codegen 自动生成
// 不要手动编辑

export class ApiClient {
  // 自动生成的代码
}

// 场景 3：临时禁用检查以专注于其他问题
// problematic-file.ts
// @ts-nocheck
// FIXME: 修复类型错误后移除此注释

// 当前有紧急 bug 需要修复
// 类型错误会稍后处理
function urgentFix() {
  // 临时方案
}

// 场景 4：处理类型定义缺失的外部模块
// external-wrapper.ts
// @ts-nocheck
// 包装没有类型定义的外部库

import * as oldLibrary from 'very-old-library'

export function wrapper() {
  return oldLibrary.someFunction()
}

// 场景 5：测试文件中的特殊情况
// integration-tests/legacy.test.js
// @ts-nocheck
// 集成测试遗留代码，使用旧的测试框架

describe('Legacy feature', () => {
  it('should work', () => {
    // 旧的测试代码
  })
})

// ❌ 不应该使用的场景

// 场景 1：偷懒不想修复类型错误
// @ts-nocheck - ❌ 不要这样做
function add(a, b) {
  return a + b
}

// ✅ 应该正确定义类型
function add(a: number, b: number): number {
  return a + b
}

// 场景 2：新编写的代码
// @ts-nocheck - ❌ 新代码不应该跳过检查
class NewFeature {
  constructor(data) {
    this.data = data
  }
}

// ✅ 新代码应该使用类型
class NewFeature {
  constructor(private data: string) {}
}

// 场景 3：核心业务逻辑
// @ts-nocheck - ❌ 核心逻辑需要类型保护
function calculatePrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ 核心逻辑必须有类型
interface Item {
  price: number
}

function calculatePrice(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

**渐进式迁移策略：**

```typescript
// 步骤 1：识别需要跳过检查的文件
// scripts/add-nocheck.js
const fs = require('fs');
const path = require('path');

function addNoCheck(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.startsWith('// @ts-nocheck')) {
    const newContent = '// @ts-nocheck\n' + content;
    fs.writeFileSync(filePath, newContent);
  }
}

// 为所有遗留 JS 文件添加 @ts-nocheck
const legacyFiles = [
  './src/legacy/utils.js',
  './src/legacy/helpers.js'
];

legacyFiles.forEach(addNoCheck);

// 步骤 2：跟踪迁移进度
// scripts/track-nocheck.js
function countNoCheckFiles(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += countNoCheckFiles(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('@ts-nocheck')) {
        count++;
      }
    }
  });

  return count;
}

const total = countNoCheckFiles('./src');
console.log(`Files with @ts-nocheck: ${total}`);

// 步骤 3：定期审查和移除
// 在 package.json 中添加脚本
{
  "scripts": {
    "check:nocheck": "node scripts/track-nocheck.js",
    "migrate:file": "node scripts/migrate-file.js"
  }
}
```

## 5. 🆚 @ts-nocheck vs. @ts-ignore

两个指令的对比：

| 特性     | @ts-nocheck          | @ts-ignore                |
| -------- | -------------------- | ------------------------- |
| 作用范围 | 整个文件             | 下一行代码                |
| 位置要求 | 必须是文件第一行     | 在目标代码上一行          |
| 使用场景 | 遗留代码、生成的代码 | 个别已知问题              |
| 粒度     | 粗粒度               | 细粒度                    |
| 维护性   | 难以定位问题         | 容易定位问题              |
| 推荐度   | 仅用于迁移           | 优先使用 @ts-expect-error |

**具体对比示例：**

```typescript
// 示例 1：文件级 vs. 行级

// 文件 A：使用 @ts-nocheck
// @ts-nocheck

function func1() {
  return 'hello' + 123 // 不检查
}

function func2() {
  return 'world' + 456 // 不检查
}

function func3() {
  return 'test' + 789 // 不检查
}

// 文件 B：使用 @ts-ignore
function func1() {
  // @ts-ignore
  return 'hello' + 123 // 仅此行不检查
}

function func2() {
  return 'world' + 456 // ❌ 会检查并报错
}

function func3() {
  return 'test' + 789 // ❌ 会检查并报错
}

// ✅ 最好：修复类型错误
function func1(): string {
  return 'hello' + String(123)
}

function func2(): string {
  return 'world' + String(456)
}

function func3(): string {
  return 'test' + String(789)
}

// 示例 2：迁移策略对比

// 策略 A：一次性添加 @ts-nocheck
// @ts-nocheck
// 整个文件暂时跳过，慢慢迁移
// ⚠️ 问题：失去所有类型检查

// 策略 B：逐个使用 @ts-ignore
// 保留大部分类型检查
function goodFunction(x: number): number {
  return x * 2 // ✅ 有类型检查
}

// @ts-ignore
function problematicFunction(x) {
  return x + 'hello' // 仅此函数跳过
}

// ✅ 保持了部分类型安全
goodFunction(10) // 类型检查生效

// 示例 3：团队协作

// 方案 A：使用 @ts-nocheck
// @ts-nocheck
// ⚠️ 团队成员可能在此文件中添加新的类型错误

// 方案 B：具体标记问题
function existingFunction() {
  // @ts-expect-error - 遗留问题 ISSUE-123
  return problematicCode()
}

// ✅ 新代码仍受类型检查保护
function newFunction(x: number): number {
  return x * 2 // 类型正确
}
```

## 6. 🤔 使用 @ts-nocheck 时需要注意哪些问题？

使用 `@ts-nocheck` 的注意事项：

```typescript
// 注意 1：必须在第一行
// ❌ 错误示例
/**
 * 文件说明
 */
// @ts-nocheck

// ✅ 正确示例
// @ts-nocheck
/**
 * 文件说明
 */

// 注意 2：影响整个文件，包括好的代码
// @ts-nocheck

// ⚠️ 这些原本类型正确的代码也失去了检查
interface User {
  id: number;
  name: string;
}

function getUser(): User {
  // 即使返回类型错误也不会报错
  return { id: '1', name: 'Alice' };
}

// 注意 3：不影响其他文件的类型检查
// file-a.ts
// @ts-nocheck
export function badFunction() {
  return 123 + 'hello';
}

// file-b.ts
import { badFunction } from './file-a';

// ❌ 这里会报错，因为 file-b 没有 @ts-nocheck
const result: number = badFunction();

// 注意 4：与 @ts-check 冲突
// script.js
// @ts-nocheck
// @ts-check // ⚠️ 被 @ts-nocheck 覆盖

// 注意 5：监控和度量
// 在 CI/CD 中添加检查
// .github/workflows/ci.yml
# - name: Check for @ts-nocheck
#   run: |
#     count=$(grep -r "@ts-nocheck" src/ | wc -l)
#     echo "Files with @ts-nocheck: $count"
#     if [ $count -gt 10 ]; then
#       echo "Too many files with @ts-nocheck"
#       exit 1
#     fi

// 注意 6：添加说明和追踪
// ❌ 不好：没有说明
// @ts-nocheck

// ✅ 好：清楚说明原因和计划
// @ts-nocheck
// 遗留代码，计划在 Q2 2024 迁移
// 追踪: JIRA-1234

// 注意 7：定期审查
// 创建脚本生成报告
// scripts/nocheck-report.js
const fs = require('fs');
const path = require('path');

function generateReport(dir, output = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      generateReport(filePath, output);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const firstLine = content.split('\n')[0];

      if (firstLine.includes('@ts-nocheck')) {
        output.push({
          file: filePath,
          reason: firstLine.replace('// @ts-nocheck', '').trim(),
          size: stat.size,
          modified: stat.mtime
        });
      }
    }
  });

  return output;
}

const report = generateReport('./src');
console.log('Files with @ts-nocheck:');
console.table(report);

// 注意 8：迁移策略
// 步骤 1：添加 @ts-nocheck 到所有遗留文件
// 步骤 2：逐个文件移除 @ts-nocheck
// 步骤 3：修复类型错误
// 步骤 4：添加完整的类型注解

// 示例：移除 @ts-nocheck 的流程
// 1. 移除文件开头的 @ts-nocheck
// 2. 运行 tsc --noEmit 查看错误
// 3. 逐个修复类型错误
// 4. 确保所有测试通过
// 5. 提交代码

// 注意 9：ESLint 配置
// .eslintrc.js
module.exports = {
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-nocheck': false, // 允许使用，但要有说明
        'minimumDescriptionLength': 20
      }
    ]
  }
};

// 注意 10：文档化使用规范
// 在团队文档中明确规定
/**
 * @ts-nocheck 使用规范
 *
 * 1. 仅用于遗留代码或生成的代码
 * 2. 必须添加原因说明和追踪编号
 * 3. 必须设定移除时间表
 * 4. 定期审查，每季度减少 20%
 * 5. 新代码严禁使用
 *
 * 示例：
 * // @ts-nocheck
 * // 遗留支付模块，计划 Q2 2024 重构
 * // 追踪: TECH-DEBT-456
 */
```

## 7. 🔗 引用

- [TypeScript Handbook - Intro to JS-TS][1]
- [TypeScript Compiler Options - checkJs][2]
- [Migrating from JavaScript][3]

[1]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html
[2]: https://www.typescriptlang.org/tsconfig#checkJs
[3]: https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
