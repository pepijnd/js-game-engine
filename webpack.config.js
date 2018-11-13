const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context: __dirname,
    entry: {
        app: './src',
        vendor: ['jquery'],
    },
    output: {
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    enforce: true
                },
                styles: {
                    test: /\.css$/,
                    name: 'styles',
                    chunks: 'all',
                    enforce: true
                }
            }
        }
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
    recordsOutputPath: path.join(__dirname, 'records.json'),
    module: {
        rules: [
            {test: /\.png$/, loader: 'file-loader?outputPath=img'},
            {test: /\.jpg$/, loader: 'file-loader?outputPath=img'},
            {test: /\.gif$/, loader: 'file-loader?outputPath=img'},
            {test: /\.woff$/, loader: 'file-loader?outputPath=font'},
            {test: /\.eot$/, loader: 'file-loader?outputPath=font/'},
            {test: /\.ttf$/, loader: 'file-loader?outputPath=font/'},
            {test: /\.svg$/, loader: 'file-loader?outputPath=font/'},
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                query: {}
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    //'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
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
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
};
