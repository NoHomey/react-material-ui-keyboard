const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./example/index.tsx",

    output: {
        path: "./demo",
        filename: "[name].js",
    },

    plugins: [
        new HtmlWebpackPlugin({ title: "React Material-Ui Keyboard" })
    ],

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
    }
};
