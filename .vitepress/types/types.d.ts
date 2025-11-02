/**
 * ./.vitepress/types/markdown-it-plugins.d.ts
 *
 * 为缺少官方类型定义的 markdown-it 插件提供类型声明
 */

declare module 'markdown-it-task-lists' {
  import MarkdownIt from 'markdown-it'

  interface TaskListsOptions {
    enabled?: boolean
    label?: boolean
    labelAfter?: boolean
    [key: string]: any
  }

  function markdownItTaskLists(md: MarkdownIt, options?: TaskListsOptions): void

  export = markdownItTaskLists
}
