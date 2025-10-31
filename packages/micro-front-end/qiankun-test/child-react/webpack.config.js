const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const config = {
  entry: './src/main.tsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    library: {
      name: 'childReact',
      type: 'umd',
    },
    chunkLoadingGlobal: 'webpackJsonp_childReact',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 5 * 1024, // 小于 5kb 的图片，会被转换为 base64 编码，否则使用文件路径
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.\w+$/,
                localIdentName: '[name]__[local]--[hash:base64:5]',
                // 由于我们开启了 esModule，所以如果不设置的话，namedExport 默认为 true，但是这里希望使用对象的方式访问类名，所以需要设置为 false
                namedExport: false,
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: [
            '@babel/preset-env',
            // 当配置上 runtime: 'automatic' 时，不需要再手动引入 React
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                [
                  '@babel/preset-typescript',
                  {
                    isTSX: true,
                    allExtensions: true,
                  },
                ],
              ],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: [
      '.js', '.ts', '.jsx', '.tsx',
    ],
  },
  devServer: {
    port: 3002,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: { overlay: false },
    // 不配置上这个字段，history 模式路由跳转后刷新页面会返回 404
    historyApiFallback: true,
  },
}

module.exports = config