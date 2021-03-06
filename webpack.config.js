/// <reference path="typings/node/node.d.ts"/>

var path = require("path");
var webpackShared = require("./webpack.shared");
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var nodeModulesPath = path.join(__dirname, 'node_modules');


var config = {
  // entry points - each will produce one bundled js file and one css file if there is any css in dependency tree
  entry: {
    vendors: [
      'flux',
      'react',
      'react-dom',
      'bluebird',
      'jquery',
      'bootstrap-js',
      'bootstrap-css'
    ],
    app: [
      path.join(__dirname, 'js', 'Index.tsx')
    ]
  },

  // This is path to loaders
  resolveLoader: {
    root: nodeModulesPath
  },

  resolve: {
    extensions: ['', '.tsx', '.ts', '.js', '.less', '.css'],
    modulesDirectories: ["node_modules", "resources"],
    alias: {
      'react': path.join(nodeModulesPath, 'react', 'react.js'),
      'react-dom': path.join(nodeModulesPath, 'react-dom', 'dist', 'react-dom.js'),
      'bluebird': path.join(nodeModulesPath, 'bluebird', 'js', 'browser', 'bluebird.min.js'),
      'flux': path.join(nodeModulesPath, 'flux', 'index.js'),
      'jquery': path.join(nodeModulesPath, 'jquery', 'dist', 'jquery.js'),
      'bootstrap-js': path.join(nodeModulesPath, 'bootstrap', 'dist', 'js', 'bootstrap.min.js'),
      'bootstrap-css': path.join(nodeModulesPath, 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
      'RoboCoachConfig': path.join(__dirname, 'js', 'RoboCoachConfig.prod.json')
    }
  },

  output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js'
  },

  module: {
    preLoaders: [
      { test: /\.ts(x?)$/, loader: "tslint", include: path.resolve(__dirname, "js") },
    ],
    noParse: [],
    loaders: [
      { test: /\.ts(x?)$/, loader: path.join(__dirname, 'ts-loader?instance=jsx'), include: path.resolve(__dirname, "js") },
      { test: /\.rt\.html/, loader: "react-templates-loader?targetVersion=0.14.0" /*path.join(__dirname, "rt-loader!ts-loader")*/ },
      { test: /\.css$/,  loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize") },
      { test: /\.less$/, exclude: /\.module\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize!less-loader?compress"), include: path.resolve(__dirname, "js") },
      { test: /\.module\.less$/,
        loader: ExtractTextPlugin.extract("style-loader","css-loader?minimize&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader?-compress"),
        include: path.resolve(__dirname, "js") },
      { test: /\.(jpg|png|woff|eot|ttf|svg|gif|mp3|mp4|ogv)$/, loader: "file-loader?name=[name]_[hash].[ext]", include: path.resolve(__dirname, "js") },
      { test: /\.json/, loader: "json-loader" },

      //    for bootstrap-webpack
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('[name].css', { allChunks: true }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new HtmlWebpackPlugin({
        template: "index.html",
        hash: true
    }),
    function() {
        this.plugin("done", function(stats) {
            if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                console.log("================> Errors count: ", stats.compilation.errors.length);
                console.log("================> Errors: ", stats.compilation.errors);
                process.exit(1);
            }
        });
    }
  ],

  tslint: {
    // Rules are in tslint.json
    emitErrors: true, // false = WARNING for webpack, true = ERROR for webpack
    formattersDirectory: path.join(nodeModulesPath, 'tslint-loader', 'formatters')
  },
};

if (webpackShared.isProduction) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
     compress: {
        warnings: false
    }
  }));
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {NODE_ENV: '"production"'}
  }));
}

module.exports = config;
