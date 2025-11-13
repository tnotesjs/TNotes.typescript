// @ts-check
/** @type { import("webpack").Configuration } */
const config1 = {
  // 1. mode: 设置构建模式
  mode: 'development',

  // 2. entry: 入口文件
  entry: './src/index.js',

  // 3. output: 输出配置
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },

  // 4. module: 模块规则配置(loaders)
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // 5. plugins: 插件配置
  plugins: [],
}
