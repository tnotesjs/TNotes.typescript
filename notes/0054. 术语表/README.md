# [0054. 术语表](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0054.%20%E6%9C%AF%E8%AF%AD%E8%A1%A8)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🔍 TS 术语速查](#3--ts-术语速查)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- TypeScript 术语表

## 2. 🫧 评价

这篇笔记用于汇总在整理知识库 TNotes.typescript 过程中遇到的一些 TS 术语，以便快速查找。

表格内容包括 3 个部分：

1. 英文术语，尽可能跟官方文档中用到的术语保持一致；
2. 中文含义，如果翻译过来有多种常见的含义，尽可能都列出来；
3. 一句话备注，极简的介绍说明；

如果有哪个术语不清楚，可在当前知识库中找找看对应的笔记，查看更详细的说明。

## 3. 🔍 TS 术语速查

| 英文术语 | 中文含义 | 一句话备注 |
| --- | --- | --- |
| access modifiers | 访问修饰符 | 用于控制类成员（属性/方法）的可见性（`public`/`protected`/`private`）。 |
| Any Type | 任意类型 | 表示任何类型，关闭类型检查，使用时会丧失类型安全。 |
| Contravariance | 逆变、反变 | 参数位置类型兼容性方向，与协变相反，常见于函数参数兼容规则。 |
| Covariance | 协变 | 返回值或可读位置的类型兼容性方向，允许更具体的子类型替代父类型。 |
| Declare、Declaration | 声明 | `declare` 用于告诉编译器某个符号在运行时存在（声明但不输出代码）。 |
| Duck Typing | 鸭子类型 | 基于对象结构判断类型是否匹配，TypeScript 使用结构子类型系统实现。 |
| Enum Type | 枚举类型 | 用于定义一组具名常量，支持数字与字符串枚举。 |
| Extends | 继承 | 在接口或类型条件中表示约束或子类继承父类/接口。 |
| Generic | 泛型 | 使类型或函数可参数化，从而在不同类型间复用相同逻辑。 |
| hard private | 硬私有 | ES 提供的 private fields `#私有成员` 不仅可以在 TS 层面提供检查约束，且无法通过方括号表示法 `obj["prop"]` 逃生，同时在编译产物 JS 的运行时依旧有效。 |
| Implements | 实现 | 类用于声明它实现了某个接口（结构必须满足接口定义）。 |
| Interface | 接口 | 定义结构化类型的契约，可描述对象、函数、类的形状。 |
| Intersection Type | 交叉类型 | 使用 `&` 合并多个类型，结果包含所有成员（类型的“并集”的交集语义）。 |
| Literal Type | 字面量类型 | 限定为具体值的类型（如字符串字面量 `"foo"` 或数字 `42`）。 |
| Module | 模块 | 单文件或命名空间，支持 `import`/`export`，用于组织代码与作用域。 |
| Mutable Type | 可变类型 | 表示属性可被修改的类型（与 `readonly` 相对）。 |
| Namespace | 命名空间 | TS 中的另一种组织代码的机制（`namespace`），用于将符号分组并避免全局污染。 |
| Never Type | 永远不存在的类型 | 表示不可能出现的值（如 `throw` 或无限循环的函数返回类型）。 |
| Nominal Subtyping | 名词子类型、名义子类型 | 基于显式名称或品牌判断子类型，而不是结构匹配（TS 默认不是名义的）。 |
| Nullable Type | 可空类型 | 允许为 `null` 或 `undefined` 的类型（受 `--strictNullChecks` 配置影响）。 |
| Optional Type | 可选类型 | 使用 `?` 标记属性或参数可以省略或未定义。 |
| private | 私有的 | 类的 3 个访问修饰符之一，成员只能在类内部访问。 |
| private constructor | 私有的构造函数 | 防止外部用 `new` 实例化，常用于单例或静态工厂。 |
| protected | 受保护的 | 类的 3 个访问修饰符之一，子类可访问但外部不可访问。 |
| protected constructor | 受保护的构造函数 | 子类可调用但外部不能实例化，常用于基类设计。 |
| public | 公开的 | 类的 3 个访问修饰符之一，默认可从任意地方访问。 |
| Readonly Type | 只读类型 | 标记属性不可被赋值修改（`readonly` 或 `Readonly<T>`）。 |
| soft private | 软私有 | class 中的 private 修饰符仅在 TS 层面提供检查约束，最终产物 JS 在运行时依旧可以访问 private 修饰的成员，并且 TS 的 private 修饰符约束的成员可以通过方括号表示法 `obj["prop"]` 来逃生。 |
| Structural Typing | 结构子类型 | TypeScript 的类型系统依据结构（属性/签名）判断兼容性。 |
| Tuple Type | 元组类型 | 定长、按位置有不同类型的数组类型（可包含可选与可变元件）。 |
| Type | 类型 | 描述值的形态与行为的静态抽象。 |
| Type Alias | 类型别名 | 使用 `type` 给类型起别名，便于复用复杂类型表达式。 |
| Type Annotation | 类型注解 | 在代码中显式写出变量/参数/返回值的类型（如 `: string`）。 |
| Type Assertion | 类型断言 | 告诉编译器把某值当作某类型处理（`as` 或角括号语法），不做运行时检查。 |
| Type Casting | 类型转换 | 在编程中将值从一种类型转换为另一种（在 TS 中通常用断言或转换函数）。 |
| Type Coercion | 类型转换 | 运行时自动或隐式的类型转换（JS 层面的行为，TS 只是静态检查）。 |
| Type Compatibility | 类型兼容性 | 编译器决定一个类型能否赋值给另一个类型的规则（基于结构/位置/可选性等）。 |
| Type Declaration | 类型声明 | `.d.ts` 文件或 `declare` 声明，向编译器提供类型信息而不输出实现。 |
| Type Guard | 类型守卫 | 在运行时检查并缩小类型范围的表达式或函数（例如 `typeof`、用户自定义守卫）。 |
| Type Inference | 类型推断 | 编译器根据上下文自动推断出表达式或变量的类型。 |
| Type Mapping | 类型映射 | 使用索引映射（`[K in keyof T]`）生成新类型，常用于构造工具类型。 |
| Type Narrowing | 类型缩小、类型收窄 | 根据控制流或检查把广泛类型缩小为更具体类型的过程。 |
| Type Scope | 类型作用域 | 类型声明的可见范围（模块、命名空间或全局）。 |
| Type Widening | 类型放大、类型泛化 | 初始更窄的类型被推断/提升为更宽泛类型的过程（如字面量到基本类型）。 |
| Union Type | 联合类型 | 使用 `\|` 表示值可以是多种类型之一。 |
| Void Type | 空类型 | 表示没有有意义返回值（如函数返回 `void`），不同于 `undefined`。 |
| type predicate | 类型谓词 | 函数返回值是一个类型谓词，用于缩小参数类型。 |
| …… | …… |

123
