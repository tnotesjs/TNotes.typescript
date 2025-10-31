# [0274. Vue 中的 TypeScript](https://github.com/tnotesjs/TNotes.typescript/tree/main/notes/0274.%20Vue%20%E4%B8%AD%E7%9A%84%20TypeScript)

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)
- [3. 🤔 Vue 3 组合式 API？](#3--vue-3-组合式-api)
  - [3.1. 基本组件结构](#31-基本组件结构)
  - [3.2. 响应式数据类型](#32-响应式数据类型)
- [4. 🤔 defineComponent 的使用？](#4--definecomponent-的使用)
  - [4.1. 基本使用](#41-基本使用)
  - [4.2. 使用 setup 语法糖](#42-使用-setup-语法糖)
  - [4.3. 组件选项类型](#43-组件选项类型)
- [5. 🤔 Props 类型定义？](#5--props-类型定义)
  - [5.1. 使用 script setup](#51-使用-script-setup)
  - [5.2. 运行时 Props 声明](#52-运行时-props-声明)
  - [5.3. Props 验证](#53-props-验证)
- [6. 🤔 响应式 API 类型？](#6--响应式-api-类型)
  - [6.1. ref](#61-ref)
  - [6.2. reactive](#62-reactive)
  - [6.3. computed](#63-computed)
  - [6.4. watch 和 watchEffect](#64-watch-和-watcheffect)
- [7. 🤔 模板引用类型？](#7--模板引用类型)
  - [7.1. DOM 元素引用](#71-dom-元素引用)
  - [7.2. 组件引用](#72-组件引用)
  - [7.3. 暴露组件方法](#73-暴露组件方法)
  - [7.4. 类型安全的引用数组](#74-类型安全的引用数组)
  - [7.5. 组合式函数（Composables）](#75-组合式函数composables)
  - [7.6. 事件类型](#76-事件类型)
  - [7.7. Provide/Inject](#77-provideinject)
- [8. 🔗 引用](#8--引用)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- Vue 3 组合式 API
- defineComponent 使用
- Props 类型定义
- 响应式 API 类型
- 模板引用类型

## 2. 🫧 评价

Vue 3 对 TypeScript 的支持显著改进，组合式 API 提供了更好的类型推断。

- 优秀的类型推断
- 组合式 API 天然支持
- 减少运行时错误
- 提升开发体验
- Vue 3 核心特性

## 3. 🤔 Vue 3 组合式 API？

### 3.1. 基本组件结构

```typescript
// ✅ 使用 script setup
<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const double = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

### 3.2. 响应式数据类型

```typescript
<script setup lang="ts">
import { ref, reactive } from "vue";

// ✅ ref 类型推断
const count = ref(0);  // Ref<number>
const name = ref("");  // Ref<string>

// ✅ ref 显式类型
interface User {
  id: number;
  name: string;
}

const user = ref<User | null>(null);

// ✅ reactive 类型推断
const state = reactive({
  count: 0,
  name: ""
});

// ✅ reactive 显式类型
interface State {
  count: number;
  name: string;
}

const state = reactive<State>({
  count: 0,
  name: ""
});
</script>
```

## 4. 🤔 defineComponent 的使用？

### 4.1. 基本使用

```typescript
// ✅ defineComponent 提供类型推断
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Counter',
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }

    return {
      count,
      increment,
    }
  },
})
```

### 4.2. 使用 setup 语法糖

```typescript
// ✅ script setup 更简洁
<script setup lang="ts">
import { ref } from "vue";

// 不需要 defineComponent
const count = ref(0);

function increment() {
  count.value++;
}
</script>
```

### 4.3. 组件选项类型

```typescript
import { defineComponent, PropType } from 'vue'

interface User {
  id: number
  name: string
}

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    title: {
      type: String,
      default: '默认标题',
    },
  },
  emits: {
    update: (value: number) => true,
    delete: (id: number) => true,
  },
  setup(props, { emit }) {
    // props 有完整的类型
    console.log(props.user.name)

    // emit 有类型检查
    emit('update', 1)
    // emit("update", "invalid");  // Error

    return {}
  },
})
```

## 5. 🤔 Props 类型定义？

### 5.1. 使用 script setup

```typescript
// ✅ defineProps 类型推断
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  disabled?: boolean;
}

const props = defineProps<Props>();

// 使用默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false
});
</script>
```

### 5.2. 运行时 Props 声明

```typescript
<script setup lang="ts">
import { PropType } from "vue";

interface User {
  id: number;
  name: string;
}

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  status: {
    type: String as PropType<"active" | "inactive">,
    default: "active"
  }
});
</script>
```

### 5.3. Props 验证

```typescript
<script setup lang="ts">
interface Props {
  count: number;
  name: string;
}

const props = defineProps<Props>();

// ✅ 自定义验证
const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0
  }
});
</script>
```

## 6. 🤔 响应式 API 类型？

### 6.1. ref

```typescript
import { ref, Ref } from 'vue'

// ✅ 基本类型
const count: Ref<number> = ref(0)
const name: Ref<string> = ref('')

// ✅ 对象类型
interface User {
  id: number
  name: string
}

const user = ref<User>({
  id: 1,
  name: 'Tom',
})

// ✅ 可能为 null
const user = ref<User | null>(null)
```

### 6.2. reactive

```typescript
import { reactive } from 'vue'

// ✅ 对象类型
interface State {
  count: number
  users: User[]
}

const state = reactive<State>({
  count: 0,
  users: [],
})

// ⚠️ reactive 不能用于基本类型
// const count = reactive(0);  // Error
```

### 6.3. computed

```typescript
import { ref, computed, ComputedRef } from 'vue'

const count = ref(0)

// ✅ 类型推断
const double = computed(() => count.value * 2) // ComputedRef<number>

// ✅ 显式类型
const double: ComputedRef<number> = computed(() => count.value * 2)

// ✅ 可写 computed
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value: string) => {
    const [first, last] = value.split(' ')
    firstName.value = first
    lastName.value = last
  },
})
```

### 6.4. watch 和 watchEffect

```typescript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const name = ref('')

// ✅ watch 单个源
watch(count, (newVal, oldVal) => {
  console.log(newVal, oldVal) // 类型：number, number
})

// ✅ watch 多个源
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log(newCount, newName) // 类型正确
})

// ✅ watch getter
watch(
  () => count.value + 1,
  (newVal) => {
    console.log(newVal) // 类型：number
  }
)

// ✅ watchEffect
watchEffect(() => {
  console.log(count.value)
})
```

## 7. 🤔 模板引用类型？

### 7.1. DOM 元素引用

```typescript
<script setup lang="ts">
import { ref, onMounted } from "vue";

// ✅ DOM 元素类型
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 7.2. 组件引用

```typescript
<script setup lang="ts">
import { ref, onMounted } from "vue";
import ChildComponent from "./ChildComponent.vue";

// ✅ 组件实例类型
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null);

onMounted(() => {
  // 访问组件方法
  childRef.value?.someMethod();
});
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

### 7.3. 暴露组件方法

```typescript
// ChildComponent.vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}

// ✅ 暴露方法给父组件
defineExpose({
  increment,
  count
});
</script>

// 父组件
<script setup lang="ts">
import { ref } from "vue";
import ChildComponent from "./ChildComponent.vue";

const childRef = ref<InstanceType<typeof ChildComponent>>();

function handleClick() {
  childRef.value?.increment();
  console.log(childRef.value?.count);
}
</script>
```

### 7.4. 类型安全的引用数组

```typescript
<script setup lang="ts">
import { ref, onMounted } from "vue";

// ✅ 引用数组
const itemRefs = ref<HTMLElement[]>([]);

function setItemRef(el: Element | ComponentPublicInstance | null) {
  if (el) {
    itemRefs.value.push(el as HTMLElement);
  }
}

onMounted(() => {
  itemRefs.value.forEach(el => {
    console.log(el.offsetHeight);
  });
});
</script>

<template>
  <div v-for="item in items" :key="item.id" :ref="setItemRef">
    {{ item.name }}
  </div>
</template>
```

### 7.5. 组合式函数（Composables）

```typescript
// useCounter.ts
import { ref, Ref } from 'vue'

// ✅ 组合式函数类型
interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
}

export function useCounter(initialValue = 0): UseCounterReturn {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    increment,
    decrement,
  }
}

// 使用
;<script setup lang="ts">
  import {useCounter} from "./composables/useCounter"; const{' '}
  {(count, increment, decrement)} = useCounter(10);
</script>
```

### 7.6. 事件类型

```typescript
<script setup lang="ts">
// ✅ 定义 emits
interface Emits {
  (e: "update", value: number): void;
  (e: "delete", id: number): void;
}

const emit = defineEmits<Emits>();

function handleUpdate() {
  emit("update", 1);
  // emit("update", "invalid");  // Error
}
</script>
```

### 7.7. Provide/Inject

```typescript
// 父组件
<script setup lang="ts">
import { provide, ref } from "vue";

interface User {
  id: number;
  name: string;
}

// ✅ 创建注入键
import { InjectionKey } from "vue";

export const userKey: InjectionKey<User> = Symbol("user");

const user = ref<User>({
  id: 1,
  name: "Tom"
});

provide(userKey, user);
</script>

// 子组件
<script setup lang="ts">
import { inject } from "vue";
import { userKey } from "./Parent.vue";

// ✅ 类型安全的注入
const user = inject(userKey);  // Ref<User> | undefined

// ✅ 提供默认值
const user = inject(userKey, ref({ id: 0, name: "Guest" }));
</script>
```

## 8. 🔗 引用

- [Vue 3 TypeScript Guide][1]
- [Vue 3 Composition API][2]
- [Vue 3 TypeScript Support][3]

[1]: https://vuejs.org/guide/typescript/overview.html
[2]: https://vuejs.org/guide/typescript/composition-api.html
[3]: https://vuejs.org/guide/extras/typescript.html
