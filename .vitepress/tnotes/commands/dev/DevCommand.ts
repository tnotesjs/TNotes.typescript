/**
 * .vitepress/tnotes/commands/dev/DevCommand.ts
 *
 * 开发服务器命令 - 使用 VitepressService 和 FileWatcherService
 */
import { BaseCommand } from '../BaseCommand'
import { VitepressService, FileWatcherService } from '../../services'

export class DevCommand extends BaseCommand {
  private vitepressService: VitepressService
  private fileWatcherService: FileWatcherService
  private enableWatch: boolean = true

  constructor() {
    super('dev', '启动知识库开发服务')
    this.vitepressService = new VitepressService()
    this.fileWatcherService = new FileWatcherService()
  }

  /**
   * 设置是否启用文件监听
   */
  setEnableWatch(enable: boolean): void {
    this.enableWatch = enable
  }

  protected async run(): Promise<void> {
    this.logger.info('服务启动中...')

    // 记录启动开始时间
    const startTime = Date.now()
    let serverReady = false

    // 启动 VitePress 服务器
    const pid = await this.vitepressService.startServer(() => {
      // VitePress 服务就绪回调
      if (!serverReady) {
        serverReady = true
        const duration = Date.now() - startTime
        this.logger.success(
          `VitePress 服务就绪 (耗时 ${duration}ms = ${(duration / 1000).toFixed(
            1
          )}s)`
        )
      }
    })

    if (pid) {
      const newStatus = this.vitepressService.getServerStatus()
      this.logger.success(`服务器已启动 (PID: ${pid})`)
      if (newStatus.port) {
        this.logger.info(`访问地址: http://localhost:${newStatus.port}`)
      }

      // 启动文件监听（默认启用）
      if (this.enableWatch) {
        this.logger.info('启用自动更新模式...')
        this.fileWatcherService.start()
        this.logger.info(
          '💡 提示: 修改笔记后会自动更新，无需手动执行 pnpm tn:update'
        )
      }
    } else {
      this.logger.error('启动服务器失败')
    }
  }
}
