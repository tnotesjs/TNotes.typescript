import { runCommand } from './run_command.js'
import { TNOTES_BASE_DIR, ROOT_DIR_PATH, EN_WORDS_DIR } from '../constants.js'
import { getTargetDirs } from './get_target_dirs.js'

/**
 * 确保目录是一个有效的 Git 仓库
 * @param {string} dir - 目录路径
 * @returns {Promise<boolean>} 是否为有效的 Git 仓库
 */
async function ensureGitRepo(dir) {
  try {
    const isGitRepo = await runCommand(
      'git rev-parse --is-inside-work-tree',
      dir
    ).catch(() => false)
    if (!isGitRepo) {
      throw new Error(`${dir} 不是一个有效的 Git 仓库。`)
    }
    return true
  } catch (error) {
    console.error(error.message)
    return false
  }
}

/**
 * 拉取远程仓库的更新
 * - 该函数尝试拉取远程仓库的更新，并在必要时处理未提交的更改。
 * - 它使用 stash 策略来保存未提交的更改，在拉取完成后恢复这些更改。
 * - 优化了错误处理、分支检查和冲突解决逻辑
 * @param {string} dir - 本地仓库目录路径
 */
export async function pullRepo(dir = ROOT_DIR_PATH) {
  let stashCreated = false

  try {
    // 确保是 Git 仓库
    if (!(await ensureGitRepo(dir))) return

    console.log(`\n📥 开始拉取 ${dir}`)

    // 获取当前分支
    const currentBranch = await runCommand(
      'git rev-parse --abbrev-ref HEAD',
      dir
    )
    console.log(`📌 当前分支: ${currentBranch.trim()}`)

    // 检查是否有上游分支
    const hasUpstream = await runCommand(
      `git rev-parse --abbrev-ref ${currentBranch.trim()}@{upstream}`,
      dir
    ).catch(() => null)

    if (!hasUpstream) {
      console.log(`⚠️  分支 ${currentBranch.trim()} 没有设置上游分支，跳过拉取`)
      console.log(
        `💡 提示: 运行 git push -u origin ${currentBranch.trim()} 设置上游分支`
      )
      return
    }

    // 获取远程更新信息（不拉取）
    console.log(`🔍 检查远程更新...`)
    await runCommand('git fetch', dir)

    // 检查是否有远程更新
    const localCommit = await runCommand('git rev-parse HEAD', dir)
    const remoteCommit = await runCommand(
      `git rev-parse ${currentBranch.trim()}@{upstream}`,
      dir
    )

    if (localCommit.trim() === remoteCommit.trim()) {
      console.log(`✅ 已是最新，无需拉取`)
      return
    }

    // 显示远程有多少新提交
    const behindCount = await runCommand(
      `git rev-list HEAD..${currentBranch.trim()}@{upstream} --count`,
      dir
    )
    console.log(`📊 远程领先 ${behindCount.trim()} 个提交`)

    // 处理未暂存更改
    const statusOutput = await runCommand('git status --porcelain', dir)
    if (statusOutput) {
      console.log(`💾 检测到未提交的更改，创建 stash...`)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      await runCommand(`git stash push -m "auto-stash-${timestamp}"`, dir)
      stashCreated = true
      console.log(`✅ Stash 已创建`)
    }

    // 拉取远程更新（使用 rebase 保持提交历史整洁）
    console.log(`⬇️  正在拉取远程更新...`)
    try {
      await runCommand('git pull --rebase', dir)
      console.log(`✅ 拉取成功`)
    } catch (pullError) {
      // 检查是否是 rebase 冲突
      const rebaseStatus = await runCommand('git status', dir)
      if (rebaseStatus.includes('rebase in progress')) {
        console.error(`\n❌ 拉取时发生冲突，需要手动解决`)
        console.log(`📝 解决步骤：`)
        console.log(`   1. cd ${dir}`)
        console.log(`   2. 解决冲突文件`)
        console.log(`   3. git add <已解决的文件>`)
        console.log(`   4. git rebase --continue`)
        console.log(`   或者放弃 rebase: git rebase --abort`)
        throw new Error('Rebase 冲突需要手动解决')
      }
      throw pullError
    }

    // 恢复 stash 的更改
    if (stashCreated) {
      console.log(`♻️  正在恢复本地更改...`)
      try {
        await runCommand('git stash pop', dir)
        console.log(`✅ 本地更改已恢复`)
      } catch (popError) {
        console.error(`\n⚠️  恢复 stash 时发生冲突`)
        console.log(`📝 解决步骤：`)
        console.log(`   1. cd ${dir}`)
        console.log(`   2. 手动解决冲突文件`)
        console.log(`   3. git add <已解决的文件>`)
        console.log(`   4. git stash drop  (清除已处理的 stash)`)
        console.log(`\n💡 或查看 stash 列表: git stash list`)
        throw new Error('Stash pop 冲突需要手动解决')
      }
    }

    console.log(`\n✅ ${dir} 拉取完成\n`)
  } catch (error) {
    console.error(`\n❌ 拉取 ${dir} 时出错：${error.message}`)

    // 如果创建了 stash 但拉取失败，提示用户
    if (stashCreated) {
      console.log(`\n💡 提示: 你的本地更改已保存在 stash 中`)
      console.log(`   查看: git stash list`)
      console.log(`   恢复: git stash pop`)
    }

    throw error
  }
}

/**
 * 推送本地更改到远程仓库
 * - 该函数检查是否有未提交的更改，如果有，则提交并推送到远程仓库。
 * @param {string} dir - 本地仓库目录路径
 */
export async function pushRepo(dir = ROOT_DIR_PATH) {
  try {
    // 确保是 Git 仓库
    if (!(await ensureGitRepo(dir))) return

    // 检查是否有未提交的更改
    const statusOutput = await runCommand('git status --porcelain', dir)
    if (!statusOutput) {
      console.log(`${dir} 没有新的更改，跳过提交`)
      return
    }

    // 提交并推送
    console.log(`${dir} 正在提交并推送更改...`)
    await runCommand('git add .', dir)
    const changedFiles = statusOutput.split('\n').length
    await runCommand(
      `git commit -m "update: ${changedFiles} files modified"`,
      dir
    )
    await runCommand('git push', dir)

    // 获取远程 URL
    const url = await runCommand('git remote -v', dir)
    const remoteMatch = url.match(/https:\/\/[^\s]+|git@[^:\s]+:[^\s]+/)
    console.log(
      `✅ 笔记同步完成 ${remoteMatch ? remoteMatch[0] : '（无法解析远程 URL）'}`
    )
  } catch (error) {
    console.error(
      `推送 ${dir} 时出错：${error.message}\n请检查网络环境，可尝试手动执行 git push 推送`
    )
  }
}

/**
 * 同步本地和远程 Git 仓库
 * - 该函数调用 pullRepo 和 pushRepo 方法，分别完成拉取和推送操作。
 * @param {string} dir - 本地仓库目录路径
 */
export async function syncRepo(dir = ROOT_DIR_PATH) {
  try {
    await pullRepo(dir)
    await pushRepo(dir)
  } catch (error) {
    console.error(`同步 ${dir} 时出错：${error.message}`)
  }
}

/**
 * 在所有 TNotes.* 中执行 npm run tn:push 命令
 */
export async function pushAllRepos() {
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [EN_WORDS_DIR])
  console.log('开始推送所有仓库...')
  for (const dir of targetDirs) {
    try {
      console.log(`正在推送 ${dir}...`)
      await runCommand('npm run tn:push', dir)
      console.log(`✅ 完成推送 ${dir}`)
    } catch (error) {
      console.error(`推送 ${dir} 时出错：${error.message}`)
    }
  }
}

/**
 * 在所有 TNotes.* 中执行拉取操作（优化版本）
 * - 支持并发拉取（可配置）
 * - 提供详细的进度反馈
 * - 统计成功和失败数量
 * @param {Object} options - 配置选项
 * @param {boolean} options.concurrent - 是否并发执行（默认 false，安全起见）
 * @param {number} options.concurrency - 并发数量（默认 3）
 */
export async function pullAllRepos(options = {}) {
  const { concurrent = false, concurrency = 3 } = options

  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [EN_WORDS_DIR])

  console.log(`\n${'='.repeat(60)}`)
  console.log(`📥 开始拉取所有仓库 (共 ${targetDirs.length} 个)`)
  console.log(`⚙️  模式: ${concurrent ? `并发 (${concurrency} 个)` : '顺序'}`)
  console.log(`${'='.repeat(60)}\n`)

  const results = {
    success: [],
    failed: [],
    skipped: [],
  }

  if (concurrent) {
    // 并发拉取（分批处理）
    for (let i = 0; i < targetDirs.length; i += concurrency) {
      const batch = targetDirs.slice(i, i + concurrency)
      console.log(
        `\n🔄 批次 ${Math.floor(i / concurrency) + 1}/${Math.ceil(
          targetDirs.length / concurrency
        )}`
      )

      await Promise.allSettled(
        batch.map(async (dir) => {
          try {
            await pullRepo(dir)
            results.success.push(dir)
          } catch (error) {
            if (error.message.includes('跳过')) {
              results.skipped.push(dir)
            } else {
              results.failed.push({ dir, error: error.message })
            }
          }
        })
      )
    }
  } else {
    // 顺序拉取（更安全）
    for (let i = 0; i < targetDirs.length; i++) {
      const dir = targetDirs[i]
      console.log(`\n[${i + 1}/${targetDirs.length}] 📦 ${dir}`)
      console.log(`${'-'.repeat(60)}`)

      try {
        await pullRepo(dir)
        results.success.push(dir)
      } catch (error) {
        if (error.message.includes('跳过')) {
          results.skipped.push(dir)
        } else {
          results.failed.push({ dir, error: error.message })
        }
      }
    }
  }

  // 打印汇总报告
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 拉取汇总报告`)
  console.log(`${'='.repeat(60)}`)
  console.log(`✅ 成功: ${results.success.length} 个`)
  console.log(`⏭️  跳过: ${results.skipped.length} 个`)
  console.log(`❌ 失败: ${results.failed.length} 个`)

  if (results.failed.length > 0) {
    console.log(`\n❌ 失败详情:`)
    results.failed.forEach(({ dir, error }) => {
      console.log(`   - ${dir}`)
      console.log(`     错误: ${error}`)
    })
  }

  console.log(`\n${'='.repeat(60)}\n`)

  // 如果有失败，抛出错误
  if (results.failed.length > 0) {
    throw new Error(`${results.failed.length} 个仓库拉取失败，请检查错误信息`)
  }
}

/**
 * 在所有 TNotes.* 中执行 npm run tn:sync 命令
 */
export async function syncAllRepos() {
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.')
  console.log('开始同步所有仓库...')
  for (const dir of targetDirs) {
    try {
      console.log(`正在同步 ${dir}...`)
      await runCommand('npm run tn:sync', dir)
      console.log(`✅ 完成同步 ${dir}`)
    } catch (error) {
      console.error(`同步 ${dir} 时出错：${error.message}`)
    }
  }
}
