const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const config = {
  entry: './src/main.ts',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    library: {
      name: 'childVue',
      type: 'umd',
    },
    chunkLoadingGlobal: 'webpackJsonp_childVue',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      typescript: {
        extensions: { vue: true },
      },
    }),
    new DefinePlugin({
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
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
          'css-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime', '@vue/babel-plugin-jsx'],
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
                [
                  '@babel/preset-typescript',
                  {
                    isTSX: true,
                    allExtensions: true,
                  },
                ],
              ],
              plugins: ['@babel/plugin-transform-runtime', '@vue/babel-plugin-jsx'],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: [
      '.js', '.ts', '.jsx', '.tsx', '.vue',
    ],
  },
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: { overlay: false },
    // 不配置上这个字段，history 模式路由跳转后刷新页面会返回 404
    historyApiFallback: true,
  },
}

module.exports = config