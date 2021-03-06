const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = env => {
  console.log(env.production ? 'production mode' : 'development mode');

  return {
    mode: env.production ? 'production' : 'development',
    name: 'ImgProc',
    context: path.resolve(__dirname, 'src'),
    target: 'web',
    entry: './index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          use: ['awesome-typescript-loader'],
        },
        {
          test: /\.svg$/,
          use: 'svg-inline-loader',
        },
        {
          test: /\.(png|gif|jpg)$/,
          exclude: [/(node_modules)/],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 50000,
                name: './images/[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsConfigPathsPlugin({
          tsconfig: __dirname + '/tsconfig.json',
          compiler: 'typescript',
        }),
      ],
    },
    devtool: env.production ? false : 'cheap-module-source-map',
    devServer: {
      historyApiFallback: true,
    },
    optimization: {
      minimize: env.production,
    },
    plugins: [
      new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['dist'] }),
      new HtmlWebpackPlugin({
        template: './assets/template.html',
      }),
      new WebpackPwaManifest({
        name: 'WebGL Shader Image Processing POC',
        short_name: 'ImageProc',
        description: 'My awesome Progressive Web App!',
        background_color: '#fff',
        display: 'standalone',
        icons: [
          {
            src: path.resolve('src/assets/icon.svg'),
            type: 'image/svg+xml',
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
          },
        ],
      }),
      /*
      new ESLintPlugin({
        extensions: ['.js', '.tsx', '.ts', '.tsx'],
      }),
      */
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
  };
};
