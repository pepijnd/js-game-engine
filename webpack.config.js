let webpack = require("webpack");
let path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        app: './src',
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js",
        chunkFilename: "[hash]/js/[id].js",
        hotUpdateMainFilename: "[hash]/update.json",
        hotUpdateChunkFilename: "[hash]/js/[id].update.js"
    },
    resolve: {
        alias: {
            gameSettings$: path.resolve(__dirname, 'gameSettings.json'),
            keycodes$: path.resolve(__dirname, 'keycodes.json')
        },
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'src/js')
        ]
    },
    recordsOutputPath: path.join(__dirname, "records.json"),
    module: {
        rules: [
            {test: /\.css$/,  loader: "style-loader!css-loader"},
            {test: /\.scss/,  loader: "style-loader!css-loader!sass-loader"},
            {test: /\.png$/,  loader: "file-loader?outputPath=img"},
            {test: /\.jpg$/,  loader: "file-loader?outputPath=img"},
            {test: /\.gif$/,  loader: "file-loader?outputPath=img"},
            {test: /\.woff$/, loader: "file-loader?outputPath=font"},
            {test: /\.eot$/,  loader: "file-loader?outputPath=font/"},
            {test: /\.ttf$/,  loader: "file-loader?outputPath=font/"},
            {test: /\.svg$/,  loader: "file-loader?outputPath=font/"},
            {test: /\.pug$/,  loader: "pug-loader", query: {}},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env'],
                        plugins: ['babel-plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: 'src/pug/index.pug',
            title: 'Game Engine'
        }),
    ],
};
