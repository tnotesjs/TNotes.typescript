/**
 * ./.vitepress/config/markdown.config.ts
 *
 * Markdown 解析器配置
 * - Mermaid 图表支持
 * - MarkMap 思维导图支持
 * - Swiper 图片轮播支持
 * - 任务列表
 * - 链接属性
 * - 代码高亮
 * - 图片懒加载
 */
import MarkdownIt from 'markdown-it'
import markdownItContainer from 'markdown-it-container'
import mila from 'markdown-it-link-attributes'
import markdownItTaskLists from 'markdown-it-task-lists'
import { MarkdownOptions } from 'vitepress'
import { generateAnchor } from '../tnotes/utils'
import fs from 'fs'
import path from 'path'

/**
 * 预编译正则表达式（避免重复编译）
 */
const REGEX_CACHE = {
  braceMatch: /\{([^}]*)\}/,
  fencePrefix: /^`+\s*/,
  tokenSplit: /"[^"]*"|'[^']*'|\S+/g,
  pureNumber: /^\d+$/,
  keyValue: /^([^=:\s]+)\s*(=|:)\s*(.+)$/,
  doubleQuoted: /^".*"$/,
  singleQuoted: /^'.*'$/,
  fileRef: /^<<<\s*(.+)$/,
  trimQuotes: /^['"]|['"]$/g,
  htmlEntities: /[&<>"']/g,
  doubleQuoteEntity: /"/g,
}

// 简化的 Mermaid 处理函数
const simpleMermaidMarkdown = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence
    ? md.renderer.rules.fence.bind(md.renderer.rules)
    : () => ''

  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]

    // 检查是否为 mermaid 代码块
    if (token.info.trim() === 'mermaid') {
      try {
        const key = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`
        const content = token.content
        // 使用自定义组件
        // console.log(
        //   'mermaid',
        //   `<Mermaid id="${key}" graph="${encodeURIComponent(content)}" />`
        // )
        return `<Mermaid id="${key}" graph="${encodeURIComponent(content)}" />`
      } catch (err) {
        return `<pre>${err}</pre>`
      }
    }

    // 允许使用 mmd 标记显示 Mermaid 代码本身
    if (token.info.trim() === 'mmd') {
      tokens[index].info = 'mermaid'
    }

    return fence(tokens, index, options, env, slf)
  }
}

export function markdown() {
  const markdownConfig: MarkdownOptions = {
    lineNumbers: true,
    math: true,
    config(md) {
      // 添加前置规则保存原始内容
      md.core.ruler.before('normalize', 'save-source', (state) => {
        state.env.source = state.src
        return true
      })

      // 添加 Mermaid 支持
      simpleMermaidMarkdown(md)

      // 添加 MarkMap 处理
      md.use(markdownItContainer, 'markmap', {
        marker: '`',
        validate(params: string) {
          const p = (params || '').trim()
          return p.startsWith('markmap')
        },
        render() {
          return ''
        },
      })

      // 在 core 阶段把整个 container 区间替换成一个 html_block（MarkMap 组件标签）
      md.core.ruler.after('block', 'tn_replace_markmap_container', (state) => {
        const src = state.env.source || ''
        const lines = src.split('\n')
        const tokens = state.tokens

        for (let i = 0; i < tokens.length; i++) {
          const t = tokens[i]
          if (t.type === 'container_markmap_open') {
            // 找到对应的 close token
            let j = i + 1
            while (
              j < tokens.length &&
              tokens[j].type !== 'container_markmap_close'
            )
              j++
            if (j >= tokens.length) continue // safety

            // 使用 token.map 提取源文件对应行（open.token.map 存着 container 起止行）
            const open = t
            const startLine = open.map ? open.map[0] + 1 : null
            const endLine = open.map ? open.map[1] - 1 : null

            // 1) 从开头 fence 行解析参数（支持 `{a=1 b="x"}`、`a=1 b="x"`，并支持单个数字 shorthand）
            let params: { [key: string]: any; initialExpandLevel?: number } = {}

            if (open.map && typeof open.map[0] === 'number') {
              const openLine = (lines[open.map[0]] || '').trim()
              let paramPart = ''

              // 优先匹配大括号形式 ```markmap{...}
              const braceMatch = openLine.match(REGEX_CACHE.braceMatch)
              if (braceMatch) {
                paramPart = braceMatch[1].trim()
              } else {
                // 否则尝试去掉前缀 ``` 和 markmap，剩下的作为参数部分
                const after = openLine.replace(REGEX_CACHE.fencePrefix, '')
                if (after.startsWith('markmap')) {
                  paramPart = after.slice('markmap'.length).trim()
                }
              }

              if (paramPart) {
                // 使用正则按 token 切分：保持用引号包裹的片段为单个 token（支持包含空格）
                // 例如: tokenArr -> ['2', 'title="我的 树"', 'foo=bar']
                const tokenArr = paramPart.match(REGEX_CACHE.tokenSplit) || []

                // 如果第一个 token 是纯数字，把它当作 initialExpandLevel
                let startIdx = 0
                if (
                  tokenArr.length > 0 &&
                  REGEX_CACHE.pureNumber.test(tokenArr[0] as string)
                ) {
                  params.initialExpandLevel = Number(tokenArr[0])
                  startIdx = 1
                }

                // 解析剩余 token 为 key=value（支持 key=val 或 key:val）
                for (let k = startIdx; k < tokenArr.length; k++) {
                  const pair = tokenArr[k]
                  if (!pair) continue
                  const m = pair.match(REGEX_CACHE.keyValue)
                  if (m) {
                    const key = m[1]
                    let val = m[3]

                    // 去除外层引号（若存在）
                    if (
                      (REGEX_CACHE.doubleQuoted.test(val) && val.length >= 2) ||
                      (REGEX_CACHE.singleQuoted.test(val) && val.length >= 2)
                    ) {
                      val = val.slice(1, -1)
                    } else if (REGEX_CACHE.pureNumber.test(val)) {
                      // 纯数字转字符串
                      val = String(Number(val))
                    }

                    params[key] = val
                  }
                }
              }
            }

            // 2) 提取内容（支持文件引用语法 `<<< ./path/to/file.md`）
            let content = ''
            if (startLine !== null && endLine !== null) {
              for (let k = startLine; k <= endLine && k < lines.length; k++) {
                content += lines[k] + '\n'
              }
            } else {
              // 回退：如果没有 map 信息，尝试用中间 tokens 拼接文本
              for (let k = i + 1; k < j; k++) {
                content += tokens[k].content || ''
              }
            }

            // --- 检查第一非空行是否为引用语法 ---
            const firstNonEmptyLine =
              (content || '').split('\n').find((ln) => ln.trim() !== '') || ''
            const refMatch = firstNonEmptyLine.trim().match(REGEX_CACHE.fileRef)
            if (refMatch) {
              // 提取引用路径，支持引号包裹
              let refRaw = refMatch[1]
                .trim()
                .replace(REGEX_CACHE.trimQuotes, '')

              // 尝试同步读取文件内容（兼容常见 Node 环境）
              try {
                // 尝试根据当前 markdown 文件位置解析相对路径
                const env = state.env || {}
                const possibleRel =
                  env.relativePath || env.path || env.filePath || env.file || ''
                let refFullPath = refRaw

                if (!path.isAbsolute(refRaw)) {
                  if (possibleRel) {
                    // 将 relativePath 视作相对于项目根的路径（例如 'notes/foo/bar.md'），取其目录
                    const currentDir = path.dirname(possibleRel)
                    // 解析到 process.cwd()
                    refFullPath = path.resolve(
                      process.cwd(),
                      currentDir,
                      refRaw
                    )
                  } else {
                    // 没有相对文件信息，则相对于项目根解析
                    refFullPath = path.resolve(process.cwd(), refRaw)
                  }
                } else {
                  // 绝对路径直接使用（按系统路径）
                  refFullPath = refRaw
                }

                // 如果文件扩展名缺失且指定的是目录或无扩展名，允许按原样读取（用户可在引用中指定 .md）
                console.log('refFullPath:', refFullPath)
                const fileContent = fs.readFileSync(refFullPath, 'utf-8')
                content = fileContent
              } catch (err: unknown) {
                // 读取失败：将错误写入 content 以便排查（不会让流程直接崩溃）
                const errorMessage =
                  err instanceof Error ? err.message : String(err)
                content = `Failed to load referenced file: ${esc(
                  String(refRaw)
                )}\n\nError: ${esc(errorMessage)}`
              }
            }

            // 3) 构造组件标签并把参数注入为 props（与原实现一致）
            const encodedContent = encodeURIComponent(content.trim())
            let propsStr = `content="${encodedContent}"`

            for (const [k, v] of Object.entries(params)) {
              if (
                typeof v === 'number' ||
                REGEX_CACHE.pureNumber.test(String(v))
              ) {
                propsStr += ` :${k}="${v}"`
              } else {
                const safe = String(v).replace(
                  REGEX_CACHE.doubleQuoteEntity,
                  '&quot;'
                )
                propsStr += ` ${k}="${safe}"`
              }
            }

            const html = `<MarkMap ${propsStr}></MarkMap>\n`

            // 创建 html_block token（兼容不同运行环境：优先使用 state.Token 如果没有则用 plain object）
            let htmlToken
            if (typeof state.Token === 'function') {
              htmlToken = new state.Token('html_block', '', 0)
              htmlToken.content = html
            } else {
              htmlToken = {
                type: 'html_block',
                tag: '',
                attrs: null,
                map: null,
                nesting: 0,
                level: 0,
                children: null,
                content: html,
                block: true,
              }
            }

            // 用单个 html_token 替换 open..close 区间
            tokens.splice(i, j - i + 1, htmlToken as any)
            // i 位置现在是替换后的 html_token，继续循环即可
          }
        }

        return true
      })

      md.use(markdownItTaskLists)

      md.use(mila, {
        attrs: {
          target: '_self',
          rel: 'noopener',
        },
      })

      /**
       * 使用预定义的转义映射表
       */
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }

      function esc(s = '') {
        return s.replace(REGEX_CACHE.htmlEntities, (ch) => escapeMap[ch]!)
      }

      // Swiper 图片轮播支持
      let __tn_swiper_uid = 0

      interface TN_RULES_STACK_ITEM {
        image: any
        pOpen: any
        pClose: any
      }
      let __tn_rules_stack: Array<TN_RULES_STACK_ITEM> = []

      // 每个文档渲染前重置计数器
      md.core.ruler.before('block', 'tn_swiper_reset_uid', () => {
        __tn_swiper_uid = 0
        __tn_rules_stack = []
        return true
      })

      md.use(markdownItContainer, 'swiper', {
        render: (tokens: any[], idx: number) => {
          if (tokens[idx].nesting === 1) {
            __tn_rules_stack.push({
              image: md.renderer.rules.image,
              pOpen: md.renderer.rules.paragraph_open,
              pClose: md.renderer.rules.paragraph_close,
            })

            md.renderer.rules.paragraph_open = () => ''
            md.renderer.rules.paragraph_close = () => ''
            md.renderer.rules.image = (tokens, i) => {
              const token: any = tokens[i]
              const src = token.attrGet('src') || ''
              const alt = token.content || ''
              const title = alt && alt.trim() ? alt : 'img'
              return `<div class="swiper-slide" data-title="${esc(
                title
              )}"><img src="${esc(src)}" alt="${esc(alt)}"></div>`
            }

            const id = `tn-swiper-${++__tn_swiper_uid}`
            return `
<div class="tn-swiper" data-swiper-id="${id}">
  <div class="tn-swiper-tabs"></div>
  <div class="swiper-container">
    <div class="swiper-wrapper">
`
          } else {
            const prev: TN_RULES_STACK_ITEM = __tn_rules_stack.pop() || {
              image: null,
              pOpen: null,
              pClose: null,
            }
            md.renderer.rules.image = prev.image
            md.renderer.rules.paragraph_open = prev.pOpen
            md.renderer.rules.paragraph_close = prev.pClose

            return `
    </div>
  </div>
</div>
`
          }
        },
      })
    },
    anchor: {
      slugify: generateAnchor,
    },
    image: {
      lazyLoading: true,
    },
  }

  return markdownConfig
}
