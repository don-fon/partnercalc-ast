/* eslint-disable */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

dotenv.config()

const repo = process.env.REPO_NAME
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/components/index.tsx',
  target: 'web',
  mode: isProd ? 'production' : 'development',

  module: {
    rules: [
      { test: /\.(ts|tsx)$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: '@teamsupercell/typings-for-css-modules-loader',
            options: { banner: '// Automatically generated. Do not edit.\n/* eslint-disable */' },
          },
          { loader: 'css-loader', options: { modules: true } },
        ],
      },
      { test: /\.svg$/i, use: 'svg-inline-loader' },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.svg'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[fullhash:8].js',
    sourceMapFilename: '[name].[fullhash:8].map',
    chunkFilename: '[id].[fullhash:8].js',
    publicPath: isProd ? `/${repo}/` : '/',
    clean: true,
  },

  devServer: {
    host: 'localhost',
    port: 7000,
    historyApiFallback: true,
    liveReload: false,
  },

  optimization: {
    minimize: isProd,
    splitChunks: { chunks: 'all', maxInitialRequests: 5 },
    runtimeChunk: 'single',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'components', 'index.html'),
      favicon: 'public/favicon.png',
    }),

    // 只注入用到的变量：本地来自 .env，CI 来自 Actions env
    new webpack.DefinePlugin({
      'process.env.FFLOGS_API_KEY': JSON.stringify(process.env.FFLOGS_API_KEY || ''),
      'process.env.FFLOGS_API_URL': JSON.stringify(process.env.FFLOGS_API_URL || ''),
      'process.env.ETRO_API_URL': JSON.stringify(process.env.ETRO_API_URL || ''),
    }),

    new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }),
  ],
}
