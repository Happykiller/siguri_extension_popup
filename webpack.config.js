// webpack.config.js
const path = require("path");
const WebpackBar = require('webpackbar');
const { version } = require('./package.json');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dotenv = require('dotenv').config().parsed;
const dotenvlocal = require('dotenv').config({
  path: '.env.local'
  , override: true
}).parsed;
const config = Object.assign({}, dotenv, dotenvlocal);
config.VERSION = version;

module.exports = {
  entry: "./src/index.tsx",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  devServer: {
    host: '0.0.0.0',
    allowedHosts: "all",
    port: config.APP_PORT,
    historyApiFallback: true,
  },
  devtool: "source-map",
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve("vm-browserify"),
    },
    extensions: ['.tsx', '.ts', '.js', '.json', '.scss', '.svg', '.woff', '.woff2', '.ttf', '.eot'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@stores': path.resolve(__dirname, 'src/stores/'),
      '@usecase': path.resolve(__dirname, 'src/usecase/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@vues': path.resolve(__dirname, 'src/components/vues/'),
      '@components': path.resolve(__dirname, 'src/components/'),
    }
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js",
    publicPath: 'auto'
  },
  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2017'
        }
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      }
    ]
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({      // Instancie le plugin
      template: "./public/index.html"  // Spécifie notre template
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(config)
    }),
    new ProvidePlugin({
      process: require.resolve('process/browser.js'),
      Buffer: ['buffer', 'Buffer'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })
  ],
  optimization: {
    concatenateModules: false,
  },
  cache: {
    type: 'filesystem',
  },
}