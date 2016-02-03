/// <reference path="typings/node/node.d.ts"/>

var path = require("path");
var WebpackConfig = require('webpack-config');

// Karma configuration here
module.exports = function(config) {
    config.set({
        logLevel: config.LOG_DEBUG,
        port: 3334,
        browsers: ['Firefox', /*'PhantomJS'*/],
        singleRun: true, //just run once by default
        frameworks: ['jasmine'], //use jasmine as framework
        files: [
            path.join(__dirname, 'node_modules', 'phantomjs-polyfill', 'bind-polyfill.js'), // To enable PhantomJS to render React components
            "js/**/*-test.ts*",
            //'karma.tests.js' //test files
        ],
        preprocessors: {
            'js/**/*-test.ts*': ['webpack', 'sourcemap'], //preprocess with webpack and sourcemap loader
        },
        reporters: ["spec"], //report results in this format
        webpack: new WebpackConfig().extend("webpack.test.config"),
        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        },
    });
};
