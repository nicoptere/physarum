const path = require('path');
const webpack = require('webpack');

const index = "index";

module.exports = {
    entry: './'+index+'.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: index + '.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
        },
        {
            test: /\.glsl$/,
            use: 'raw-loader'
        }],
    },
    stats: {
        colors: true
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: "/node_modules/"
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 9000
    },
    mode: 'development'
};
