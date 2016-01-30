var path = require("path");
var WebpackConfig = require("webpack-config");
var webpackShared = require("./webpack.shared");

var mainConfig = new WebpackConfig().extend("webpack.config");

webpackShared.removeObjectProperties(mainConfig.resolve.alias, ['react']);

mainConfig.resolve.alias["RoboCoachConfig"] = path.join(__dirname, 'js', 'RoboCoachConfig.test.json');

var config = {
  resolve: {
    extensions: mainConfig.resolve.extensions,
    alias: mainConfig.resolve.alias
  },
  resolveLoader: mainConfig.resolveLoader,
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader?instance=jsx' },
      { test: /\.less$/, loader: 'null-loader' },
      { test: /\.json/, loader: "json-loader" },
    ]
  }
}

module.exports = config;

/*
var WebpackConfig = require('webpack-config');
var mainConfig = new WebpackConfig().extend("webpack.config");
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var testConfigExtension = {
    plugins: [
        new ExtractTextPlugin('[name].css', { allChunks: true }),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        new HtmlWebpackPlugin({
            template: "index.html",
            hash: true
        })
    ]
};

mainConfig.plugins = [];

module.exports = mainConfig.merge(testConfigExtension);
*/
