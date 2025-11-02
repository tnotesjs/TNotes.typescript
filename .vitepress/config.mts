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

// 记录配置文件加载开始时间
const configStartTime = Date.now()
console.log('\n🚀 VitePress 开发服务启动中...')

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
        // 优化文件监听配置，减少不必要的文件监听
        ignored: [
          ...IGNORE_LIST,
          '**/node_modules/**',
          '**/dist/**',
          '**/.git/**',
          '**/.vitepress/.vite/**',
          '**/.vitepress/cache/**',
          '**/.vitepress/.cache/**',
          '**/package-lock.json',
          '**/pnpm-lock.yaml',
          '**/yarn.lock',
          '**/.DS_Store',
          '**/Thumbs.db',
          '**/*.log',
        ],
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
      fs: {
        // 允许访问项目根目录之外的文件
        allow: ['..'],
      },
    },

    // 路由级别代码分割和构建优化
    build: {
      // 代码分割配置
      rollupOptions: {
        output: {
          // 按路由分割代码
          manualChunks(id) {
            // 将 node_modules 中的大型库单独分割
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue-vendor'
              if (id.includes('vitepress')) return 'vitepress-vendor'
              if (id.includes('markdown-it')) return 'markdown-vendor'
              return 'vendor'
            }
            // 将笔记按目录分组（减少单个文件体积）
            if (id.includes('/notes/')) {
              const match = id.match(/notes\/(\d{4})/)
              if (match) {
                const noteNum = parseInt(match[1])
                // 每 20 个笔记打包成一个 chunk
                const chunkGroup = Math.floor(noteNum / 20)
                return `notes-${chunkGroup}`
              }
            }
          },
          // chunk 命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
      // 压缩选项
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // 保留 console（开发时有用）
          drop_debugger: true,
        },
      },
    },

    // 优化依赖预构建
    optimizeDeps: {
      include: [
        'markdown-it',
        'markdown-it-container',
        'markdown-it-link-attributes',
        'markdown-it-task-lists',
      ],
      // 排除不需要预构建的依赖
      exclude: [],
    },

    plugins: [
      TN_HMR_Plugin(),
      // 启动时间监控插件
      {
        name: 'vitepress-startup-timer',
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            const configEndTime = Date.now()
            const configDuration = configEndTime - configStartTime
            console.log(`\n🚀 VitePress 启动完成！`)
            console.log(
              `🚀 总启动时间: ${configDuration}ms (${(
                configDuration / 1000
              ).toFixed(1)}秒)`
            )
          })
        },
      },
    ],
  },
})
