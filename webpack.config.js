const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizationCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if(isProd) {
    config.minimizer = [
      new OptimizationCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
}

const filename  = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = () => {
return {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    }

}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    })
  ]

  if(isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}
 
module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'production',
  entry: {
    main: ['@babel/polyfill', './index.js'],
    analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js','.ts', '.json','.jpg','.css'],
    alias: {

    }
  },
  plugins: plugins(),
  optimization: optimization(),
  devtool: isDev ? 'source-map' : '',
  devServer: {
    port: 4200,
    hot: isDev
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [cssLoaders(),'css-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: [cssLoaders(),'css-loader','sass-loader']
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      { 
        test: /\.js$/,
         exclude: /node_modules/, 
         loader: {
           loader: 'babel-loader',
           options: {
             presets: [
               '@babel/preset-env'
             ],
             plugins: [
               '@babel/plugin-proposal-class-properties'
             ]
           }
         }
         },
         { 
          test: /\.ts$/,
           exclude: /node_modules/, 
           loader: {
             loader: 'babel-loader',
             options: {
               presets: [
                 '@babel/preset-env',
                 '@babel/preset-typescript'
               ],
               plugins: [
                 '@babel/plugin-proposal-class-properties'
               ]
             }
           }
           }
    ]
  }
}