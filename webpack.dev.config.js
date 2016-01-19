// This config is extented from webpack.config.js. We use it for development with webpack-dev-server and autoreload/refresh

var webpackShared = require("./webpack.shared");
var webpack = require('webpack');
var WebpackConfig = require('webpack-config');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var mainConfig = new WebpackConfig().extend("webpack.config");

// To work with webpack-dev-server
webpackShared.removeObjectProperties(mainConfig.resolve.alias, ['react']);

var devConfigExtension = {
  entry: {
      app: [
        // We are using next two entries for hot-reload
        'webpack-dev-server/client?http://localhost:3333',
        'webpack/hot/only-dev-server',
      ].concat(mainConfig.entry.app)
  },

  output: {
    filename: '[name].js',
    publicPath: "http://localhost:3333/html"
  },

  resolve: {
    alias: mainConfig.resolve.alias
  },

  // more options here: http://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval-source-map',

  watch: true,

  module: {
    loaders: [
      { test: /\.ts(x?)$/, loaders: ['react-hot', 'ts-loader?instance=jsx'], include: path.resolve(__dirname, "js") },
      { test: /\.rt\.html/, loader: "react-templates-loader?targetVersion=0.14.0" /*path.join(__dirname, "rt-loader!ts-loader")*/ },
      { test: /\.css$/, exclude: /\.import\.css$/,  loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      { test: /\.import\.css$/,  loader: "style!css", include: path.resolve(__dirname, "js") },
      { test: /\.less$/, exclude: /\.module\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
      { test: /\.module\.less$/, loader: ExtractTextPlugin.extract("style-loader","css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader"), include: path.resolve(__dirname, "js") },
      { test: /\.(jpg|png|jpg|png|woff|eot|ttf|svg|gif)$/, loader: "file-loader?name=[name].[ext]" },

      //    for bootstrap-webpack
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },

   plugins: [
    new ExtractTextPlugin('[name].css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    // Used for hot-reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
  ]
};

mainConfig.module.loaders = [];
mainConfig.resolve.alias = {};
mainConfig.plugins = [];

module.exports = mainConfig.merge(devConfigExtension);
