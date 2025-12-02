# [0273. React 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0273.%20React%20%E4%B8%AD%E7%9A%84%20TypeScript)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 如何定义组件 Props？](#3--如何定义组件-props)
  - [3.1. 函数组件基本 Props](#31-函数组件基本-props)
  - [3.2. children 属性](#32-children-属性)
  - [3.3. 可选 Props 和默认值](#33-可选-props-和默认值)
  - [3.4. 扩展 HTML 属性](#34-扩展-html-属性)
  - [3.5. 泛型组件](#35-泛型组件)
- [4. 🤔 如何使用 React Hooks？](#4--如何使用-react-hooks)
  - [4.1. useState](#41-usestate)
  - [4.2. useEffect](#42-useeffect)
  - [4.3. useRef](#43-useref)
  - [4.4. useCallback](#44-usecallback)
  - [4.5. useMemo](#45-usememo)
  - [4.6. 自定义 Hook](#46-自定义-hook)
- [5. 🤔 如何处理事件？](#5--如何处理事件)
  - [5.1. 常见事件类型](#51-常见事件类型)
  - [5.2. 事件处理器类型](#52-事件处理器类型)
  - [5.3. 自定义事件处理](#53-自定义事件处理)
- [6. 🤔 如何使用 refs？](#6--如何使用-refs)
  - [6.1. 基本 ref 使用](#61-基本-ref-使用)
  - [6.2. forwardRef](#62-forwardref)
  - [6.3. useImperativeHandle](#63-useimperativehandle)
- [7. 🤔 高级组件模式？](#7--高级组件模式)
  - [7.1. 高阶组件（HOC）](#71-高阶组件hoc)
  - [7.2. Render Props](#72-render-props)
  - [7.3. Context](#73-context)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- 组件 Props 类型
- React Hooks 类型
- 事件处理类型
- Refs 类型
- 高级组件模式

## 2. 🫧 评价

TypeScript 与 React 的结合能够显著提升开发体验和代码质量。

- 提供组件 API 提示
- 捕获 props 错误
- 增强重构能力
- 提升代码可维护性
- React 官方推荐

## 3. 🤔 如何定义组件 Props？

### 3.1. 函数组件基本 Props

```ts
// ✅ 基本类型定义
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// 使用
;<Button label="点击我" onClick={() => console.log('clicked')} />
```

### 3.2. children 属性

```ts
// ✅ 使用 React.ReactNode
interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

// 使用
;<Card title="标题">
  <p>内容</p>
</Card>
```

### 3.3. 可选 Props 和默认值

```ts
interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

// ✅ 使用解构默认值
function Button({ label, variant = 'primary', size = 'medium' }: ButtonProps) {
  return <button className={`btn-${variant} btn-${size}`}>{label}</button>
}
```

### 3.4. 扩展 HTML 属性

```ts
// ✅ 扩展原生元素属性
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'primary' | 'secondary'
}

function Button({ label, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} {...rest}>
      {label}
    </button>
  )
}

// 使用：支持所有原生 button 属性
;<Button label="点击" onClick={() => {}} disabled type="submit" />
```

### 3.5. 泛型组件

```ts
// ✅ 泛型 Props
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// 使用
interface User {
  id: number
  name: string
}

;<List<User> items={users} renderItem={(user) => <span>{user.name}</span>} />
```

## 4. 🤔 如何使用 React Hooks？

### 4.1. useState

```ts
// ✅ 类型推断
const [count, setCount] = useState(0) // number
const [name, setName] = useState('') // string

// ✅ 显式类型
const [user, setUser] = useState<User | null>(null)

// ✅ 初始值为 undefined
const [data, setData] = useState<string>() // string | undefined
```

### 4.2. useEffect

```ts
// ✅ 基本使用
useEffect(() => {
  console.log('组件挂载')

  return () => {
    console.log('组件卸载')
  }
}, [])

// ✅ 依赖项类型检查
const [count, setCount] = useState(0)

useEffect(() => {
  console.log(count)
}, [count]) // TypeScript 会检查依赖项
```

### 4.3. useRef

```ts
// ✅ DOM 引用
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

return <input ref={inputRef} />

// ✅ 可变值引用
const countRef = useRef<number>(0)

useEffect(() => {
  countRef.current += 1
})
```

### 4.4. useCallback

```ts
// ✅ 类型推断
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])

// ✅ 显式类型
const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
  (event) => {
    event.preventDefault()
    // 处理提交
  },
  []
)
```

### 4.5. useMemo

```ts
// ✅ 类型推断
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// ✅ 显式类型
const filteredList = useMemo<User[]>(() => {
  return users.filter((user) => user.active)
}, [users])
```

### 4.6. 自定义 Hook

```ts
// ✅ 自定义 Hook 类型
interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
}

function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  const decrement = useCallback(() => {
    setCount((c) => c - 1)
  }, [])

  return { count, increment, decrement }
}

// 使用
const { count, increment, decrement } = useCounter(10)
```

## 5. 🤔 如何处理事件？

### 5.1. 常见事件类型

```ts
// ✅ 点击事件
function Button() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.name)
  }

  return <button onClick={handleClick}>点击</button>
}

// ✅ 输入事件
function Input() {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  }

  return <input onChange={handleChange} />
}

// ✅ 表单提交
function Form() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // 处理提交
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 5.2. 事件处理器类型

```ts
// ✅ 使用 React 事件处理器类型
interface InputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

function Input({ onChange, onFocus, onBlur }: InputProps) {
  return <input onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
}
```

### 5.3. 自定义事件处理

```ts
// ✅ 自定义事件类型
interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  onChange: (value: string) => void
}

function Select({ options, onChange }: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    <select onChange={handleChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
```

## 6. 🤔 如何使用 refs？

### 6.1. 基本 ref 使用

```ts
// ✅ DOM 元素 ref
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>聚焦</button>
    </>
  )
}
```

### 6.2. forwardRef

```ts
// ✅ 转发 ref
interface InputProps {
  placeholder?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder }, ref) => {
    return <input ref={ref} placeholder={placeholder} />
  }
)

// 使用
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)

  return <Input ref={inputRef} placeholder="输入..." />
}
```

### 6.3. useImperativeHandle

```ts
// ✅ 自定义 ref 方法
interface InputHandle {
  focus: () => void
  clear: () => void
}

interface InputProps {
  defaultValue?: string
}

const Input = forwardRef<InputHandle, InputProps>(({ defaultValue }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
  }))

  return <input ref={inputRef} defaultValue={defaultValue} />
})

// 使用
function Parent() {
  const inputRef = useRef<InputHandle>(null)

  const handleClear = () => {
    inputRef.current?.clear()
  }

  return (
    <>
      <Input ref={inputRef} />
      <button onClick={handleClear}>清空</button>
    </>
  )
}
```

## 7. 🤔 高级组件模式？

### 7.1. 高阶组件（HOC）

```ts
// ✅ 泛型 HOC
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return function WithLoadingComponent(props: P & { loading: boolean }) {
    const { loading, ...rest } = props

    if (loading) {
      return <div>加载中...</div>
    }

    return <Component {...(rest as P)} />
  }
}

// 使用
interface UserProps {
  name: string
  age: number
}

function User({ name, age }: UserProps) {
  return (
    <div>
      {name} - {age}
    </div>
  )
}

const UserWithLoading = withLoading(User)

// 使用
;<UserWithLoading name="Tom" age={25} loading={false} />
```

### 7.2. Render Props

```ts
// ✅ Render Props 类型
interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  render: (position: MousePosition) => React.ReactNode
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <>{render(position)}</>
}

// 使用
;<MouseTracker
  render={({ x, y }) => (
    <div>
      鼠标位置：{x}, {y}
    </div>
  )}
/>
```

### 7.3. Context

```ts
// ✅ 类型安全的 Context
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 使用
function ThemedButton() {
  const { theme, toggleTheme } = useTheme()

  return <button onClick={toggleTheme}>当前主题：{theme}</button>
}
```

## 8. 🔗 引用

- [React TypeScript Cheatsheet][1]
- [React TypeScript][2]
- [TypeScript Handbook - React][3]

[1]: https://react-typescript-cheatsheet.netlify.app/
[2]: https://react.dev/learn/typescript
[3]: https://www.typescriptlang.org/docs/handbook/react.html
