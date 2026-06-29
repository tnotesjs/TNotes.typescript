# [0058. 类中的存取器](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0058.%20%E7%B1%BB%E4%B8%AD%E7%9A%84%E5%AD%98%E5%8F%96%E5%99%A8)

<!-- region:toc -->

- [1. 本节内容](#1-本节内容)
- [2. 评价](#2-评价)
- [3. “存取器 accessor”是什么？](#3-存取器-accessor是什么)
  - [3.1. Getter（取值器）](#31-getter取值器)
  - [3.2. Setter（存值器）](#32-setter存值器)
  - [3.3. 主要特点](#33-主要特点)
- [4. accessor 是 TS 中特有的吗？](#4-accessor-是-ts-中特有的吗)
  - [4.1. JavaScript 中的 accessor](#41-javascript-中的-accessor)
  - [4.2. JavaScript 示例](#42-javascript-示例)
  - [4.3. TypeScript 的增强](#43-typescript-的增强)
- [5. accessor 本质上定义的是类的属性还是类的方法？](#5-accessor-本质上定义的是类的属性还是类的方法)
- [6. accessor 对应的属性命名建议是？](#6-accessor-对应的属性命名建议是)
  - [6.1. 命名建议](#61-命名建议)
  - [6.2. 常见的因命名冲突导致的错误](#62-常见的因命名冲突导致的错误)
  - [6.3. 留意 IDE 提示](#63-留意-ide-提示)
  - [6.4. 正确做法](#64-正确做法)
- [7. 如何使用 accessor 定义只读属性？](#7-如何使用-accessor-定义只读属性)
- [8. getter 和 setter 的实际应用场景都有哪些？](#8-getter-和-setter-的实际应用场景都有哪些)

<!-- endregion:toc -->

## 1. 本节内容

- accessor
- getter
- setter

## 2. 评价

- 使用的 accessor 的时候需要注意名称不要跟属性名重叠，导致递归错误。
- accessor 是一种特殊的属性定义方式，提供了对属性访问和设置的控制能力。

## 3. “存取器 accessor”是什么？

存取器（accessor）是类中的一种特殊语法，用于控制对对象属性的访问，它提供了一种优雅的方式来控制类属性的访问和修改，增强了代码的封装性和安全性。

它包括两种类型的方法：

### 3.1. Getter（取值器）

- 使用 `get` 关键字定义
- 当读取属性值时自动调用
- 用于定义如何获取属性值的逻辑

### 3.2. Setter（存值器）

- 使用 `set` 关键字定义
- 当设置属性值时自动调用
- 用于定义如何设置属性值的逻辑

```ts
class C {
  _name = ''

  // Getter - 定义如何获取 name 属性的值
  get name() {
    return this._name
  }

  // Setter - 定义如何设置 name 属性的值
  set name(value) {
    this._name = value
  }
}

const c = new C()
c.name = 'Tom' // 调用 setter
console.log(c.name) // 调用 getter，输出 'Tom'
```

### 3.3. 主要特点

- 封装性：可以隐藏内部实现细节，通过存取器暴露受控的接口
- 计算属性：getter 可以返回基于其他属性计算得出的值
- 数据验证：setter 可以在设置值时进行验证和处理
- 只读属性：只有 getter 没有 setter 的属性自动成为只读属性

## 4. accessor 是 TS 中特有的吗？

不是的，accessor（存取器）并不是 TypeScript 特有的特性。

### 4.1. JavaScript 中的 accessor

存取器（getter/setter）实际上是 ECMAScript 5 (ES5) 中就引入的标准特性，这意味着：

1. JavaScript 原生支持：从 ES5 开始，JavaScript 就支持 getter 和 setter 语法
2. 浏览器兼容性：现代浏览器都支持这一特性
3. TypeScript 只是类型增强：TypeScript 在 JavaScript 基础上增加了类型检查和更好的开发体验

### 4.2. JavaScript 示例

```js
// 纯 JavaScript 中也可以使用 accessor
class C {
  _name = ''

  get name() {
    return this._name
  }

  set name(value) {
    this._name = value
  }
}

const c = new C()
c.name = 'Tom'
console.log(c.name) // 'Tom'
```

### 4.3. TypeScript 的增强

TypeScript 在原生 accessor 基础上提供了：

- 类型检查：可以为 getter 和 setter 指定明确的类型
- 编译时错误检测：如属性名冲突等错误可以在编译时发现
- 更好的 IDE 支持：提供更智能的代码提示和错误提示

```ts
class C {
  _name: string = ''

  get name(): string {
    // TypeScript 添加了返回值类型
    return this._name
  }

  set name(value: string) {
    // TypeScript 添加了参数类型
    this._name = value
  }
}
```

所以 accessor 是 JavaScript 的标准特性，TypeScript 只是在此基础上提供了更强的类型安全和开发工具支持。

## 5. accessor 本质上定义的是类的属性还是类的方法？

accessor（存取器）本质上定义的是类的属性，而不是方法。

虽然 accessor 使用了 `get` 和 `set` 关键字，看起来像是方法定义，但它们实际上创建的是属性访问器：

```ts
class C {
  _name = ''

  // 这些是属性访问器，不是方法
  get name() {
    return this._name
  }

  set name(value) {
    this._name = value
  }
}

const c = new C()

// 像属性一样使用，不需要括号
console.log(c.name) // 读取属性
c.name = 'Tom' // 设置属性

// 不像方法那样调用
// c.name()            // ❌ 错误！name 不是方法
// c.name('Tom')       // ❌ 错误！name 不是方法
```

与普通方法的区别：

```ts
class Example {
  // accessor 属性
  get computedValue() {
    return 'computed'
  }

  // 普通方法
  getValue() {
    return 'method result'
  }
}

const ex = new Example()

// accessor 像属性一样使用
console.log(ex.computedValue) // 'computed'

// 普通方法需要调用
console.log(ex.getValue()) // 'method result'
```

综上，accessor 是一种特殊的属性定义方式，提供了对属性访问和设置的控制能力，但本质上仍然是属性而非方法。

## 6. accessor 对应的属性命名建议是？

### 6.1. 命名建议

比如我们定义的 accessor 的名称是 `name`，通常在类的内部，还需要一个与之对应的属性来维护 `name` 的值。

可以用下划线前缀（如 `_name`）表示内部私有字段，目的是为了避免与 accessor getter/setter 名称 `name` 冲突。

```ts
class C {
  _name = ''

  get name() {
    return this._name
  }
  set name(value) {
    this._name = value
  }
}
```

### 6.2. 常见的因命名冲突导致的错误

如果将 `_name` 写成 `name` 会导致无限递归调用，最终导致栈溢出错误。

```ts
class C {
  name = '' // ❌ 错误：与 getter/setter 同名

  get name() {
    return this.name // 这里会调用 get name() 自身
  }

  set name(value) {
    this.name = value // 这里会调用 set name() 自身
  }
}

const c = new C()
console.log(c.name)
// [ERR]: Maximum call stack size exceeded
```

1. Getter 无限递归：
   - 当访问 `this.name` 时，会调用 `get name()`
   - 在 `get name()` 内部访问 `this.name`，又会再次调用 `get name()`
   - 形成无限递归循环
2. Setter 无限递归：
   - 当给 `this.name` 赋值时，会调用 `set name(value)`
   - 在 `set name()` 内部给 `this.name` 赋值，又会再次调用 `set name()`
   - 形成无限递归循环

运行时表现：当发生这种递归调用时，程序会抛出错误 `RangeError: Maximum call stack size exceeded`。

### 6.3. 留意 IDE 提示

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-10-26-08-38-05.png)

对于上述错误使用的情况，IDE 中的 TS 语言服务其实是会及时提示的。

因为 accessor 定义的也是属性，如果有属性名冲突，被 TS 语言服务检测出来后就会立刻报错。

因此，在实际开发中也无需过分担心会误写属性名导致递归错误的问题，只需留意 IDE 的错误提示即可。

### 6.4. 正确做法

```ts
// ✅ 正确做法：使用下划线前缀区分
class C {
  _name = '' // 私有字段

  get name() {
    return this._name // 正确：访问私有字段
  }

  set name(value) {
    this._name = value // 正确：设置私有字段
  }
}
```

## 7. 如何使用 accessor 定义只读属性？

如果某个属性只有 `get` 方法，没有 `set` 方法，那么该属性自动成为只读属性。

```ts
// 下面的 _name 属性被声明为只读属性，不能修改：
class C2 {
  _name = 'foo'

  get name() {
    return this._name
  }
}

const c = new C2()
c.name = 'bar' // ❌ 报错
// Cannot assign to 'name' because it is a read-only property.(2540)
```

## 8. getter 和 setter 的实际应用场景都有哪些？

- Getter（取值器）
  - 定义当读取某个属性时执行的逻辑。
  - 常用于暴露基于内部状态计算得出的值。
- Setter（存值器）
  - 定义当给某个属性赋值时执行的逻辑。
  - 可以在赋值时进行验证、日志记录、触发事件等。

::: code-group

```ts [getter]
// 暴露内部计算得出的结果：
class Rectangle {
  constructor(private width: number, private height: number) {}

  get area() {
    return this.width * this.height
  }
}

const rect = new Rectangle(4, 5)
console.log(rect.area) // 20
```

```ts [setter]
// 在赋值时进行验证、日志记录、触发事件等：
class User {
  private _email = ''

  get email() {
    return this._email
  }

  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('无效的邮箱格式')
    }
    this._email = value
    console.log(`邮箱已更新为: ${value}`)
  }
}
```

:::
