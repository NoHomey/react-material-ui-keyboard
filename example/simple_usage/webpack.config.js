const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        "./index.tsx"
    ],

    output: {
        path: path.join(__dirname, "demo"),
        filename: "[name].js",
        publicPath: ''
    },

    plugins: [
        new HtmlWebpackPlugin({ title: "React Material-Ui Keyboard" })
    ],

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ["ts-loader"]
            }
        ],
    }
};
