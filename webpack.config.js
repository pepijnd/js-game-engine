const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const path = require('path');

module.exports = (env) => {
    const dev = env.NODE_ENV !== 'production';
    return {
        entry: {
            app: './src',
            vendor: ['jquery'],
        },
        output: {
            filename: 'assets/js/' + (dev ? '[name].js' : '[name].[hash].js')
        },
        optimization: {
            minimizer: [new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: dev
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
                        name: 'assets/img/' + (dev ? '[name].[ext]' : '[hash].[ext]'),
                    }
                },
                {
                    test: /\.(woff|eot|ttf|svg)/,
                    loader: 'file-loader',
                    include: [path.resolve('src/font')],
                    options: {
                        name: 'assets/font/' + (dev ? '[name].[ext]' : '[hash].[ext]'),
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
                        dev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
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
        ],
    };
}
