/**
 * ./.vitepress/config.mts
 *
 * vitepress 配置文件
 */
import { defineConfig } from 'vitepress'
import { author, ignore_dirs, repoName } from '../.tnotes.json'
import TN_HMR_Plugin from './plugins/hmr'
import { head } from './config/head.config'
import { markdown } from './config/markdown.config'
import { themeConfig } from './config/theme.config'

const IGNORE_LIST = [
  './README.md',
  './MERGED_README.md',
  ...ignore_dirs.map((dir) => `**/${dir}/**`),
]
const github_page_url =
  'https://' + author.toLowerCase() + '.github.io/' + repoName + '/'

// doc: https://vitepress.dev/reference/site-config
export default defineConfig({
  appearance: 'dark',
  base: '/' + repoName + '/',
  cleanUrls: true,
  description: repoName,
  head: head(),
  ignoreDeadLinks: true,
  lang: 'zh-Hans',
  /*
   * 笔记的创建时间和最后更新时间直接写入 ./notes/xxx/.tnotes.json 配置文件中
   * created_at: ...,
   * updated_at: ...,
   *
   * 备注：
   * 直接使用内置的 lastUpdated 来计算，在笔记数量较多（比如 leetcode 3k+）的情况下，经常会在 build 的时候遇到 vitepress 的报错：[vitepress] spawn EBADF。
   * 经过排查是因为 vitepress 内部使用的 git-log 命令在处理大量文件时会失败（怀疑是命令行参数过长导致），所以只能放弃内置的 lastUpdated 功能，改为手动维护。
   * */
  lastUpdated: false,
  markdown: markdown(),
  router: {
    prefetchLinks: false,
  },
  sitemap: {
    hostname: github_page_url,
    lastmodDateOnly: false,
  },
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: themeConfig(),
  title: repoName,
  srcExclude: IGNORE_LIST,
  vite: {
    server: {
      watch: {
        ignored: IGNORE_LIST,
        // awaitWriteFinish: {
        //   stabilityThreshold: 5000, // 文件大小稳定 1000ms 后触发
        //   pollInterval: 1000, // 每 100ms 检查一次文件大小
        // },
        // usePolling: true, // 启用轮询机制（更稳定但稍耗资源） 解决 WSL/macOS 常见监听问题
      },
      // 避免内存溢出（大型文档库必备）
      // warmup: {
      //   clientFiles: ['./**/*.md'],
      // },
    },
    plugins: [TN_HMR_Plugin()],
  },
})
