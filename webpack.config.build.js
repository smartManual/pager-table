const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }, {
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.(c|le)ss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
    }]
  },
  externals: {
    'ant-design-vue': 'ant-design-vue'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'PagerTable',
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'lib/src/styles/index.less'),
        }
      ]
    }),
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize:true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        // 可省略，默认开启并行
        parallel: true,
        terserOptions: {
          // 最高级别，删除无用代码
          toplevel: true,
          ie8: true,
          safari10: true,
        }
      })
    ]
  }
}