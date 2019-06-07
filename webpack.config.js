const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const webpack = require("webpack");
const path = require('path');

module.exports = (env, argv) => {
    const production = argv.mode === 'production';
    return {
        entry: {
            app: './src/index.js',
            vendor: ['jquery'],
        },
        output: {
            filename: production ? '[name].[hash].js' : '[name].js'
        },
        optimization: {
            minimize: production,
            minimizer: [new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: true,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: !production
            }),
                new OptimizeCSSAssetsPlugin({})
            ],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        enforce: true
                    },
                    engine: {
                        test: /[\\/]src[\\/]js[\\/]/,
                        name: 'engine',
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
                gameSettings$: path.resolve('gameSettings.json'),
                keycodes$: path.resolve('keycodes.json')
            },
            modules: [
                'node_modules',
                path.resolve('src'),
                path.resolve('src/js')
            ]
        },
        recordsOutputPath: path.resolve('records.json'),
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: 'file-loader',
                    include: [path.resolve('src/img')],
                    options: {
                        name: 'assets/img/' + (production ? '[hash].[ext]' : '[name].[ext]'),
                    }
                },
                {
                    test: /\.(woff|eot|ttf|svg)/,
                    loader: 'file-loader',
                    include: [path.resolve('src/font')],
                    options: {
                        name: 'assets/font/' + (production ? '[hash].[ext]' : '[name].[ext]'),
                    }
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    query: {}
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        production ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: "> 0.25%, not dead"
                                }]],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                'dynamic-import-webpack'
                            ]
                        }
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'assets/css/[name].[hash].css',
                chunkFilename: 'assets/[id].[hash].css',
            }),
            new HtmlWebpackPlugin({
                inject: false,
                template: 'src/html/index.pug',
                title: 'Game Engine'
            }),
            new WasmPackPlugin({
                crateDirectory: path.resolve(__dirname, "."),
                extraArgs: "--no-typescript",
                forceMode: "production"
            })
        ],
    }
};


