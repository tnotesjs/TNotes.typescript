/**
 * ./.vitepress/config/head.config.ts
 *
 * HTML <head> 相关配置
 * - meta 标签（关键词、作者）
 * - 图标链接
 * - 外部资源预连接
 */
import { HeadConfig } from 'vitepress'
import { author, keywords, repoName } from '../../.tnotes.json'

const github_page_url =
  'https://' + author.toLowerCase() + '.github.io/' + repoName + '/'

export function head() {
  const headConfig: HeadConfig[] = [
    [
      'meta',
      {
        name: 'keywords',
        content: keywords.join(', '),
      },
    ],
    ['meta', { name: 'author', content: author }],
    ['link', { rel: 'canonical', href: github_page_url }],
    ['link', { rel: 'icon', href: github_page_url + 'favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ]

  return headConfig
}
