/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const isProd = process.env.NODE_ENV === 'production';
const babelOptions = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: 'last 2 versions, ie 11',
                modules: false,
            },
        ],
    ],
};
const config = {
    mode: isProd ? 'production' : 'development',
    context: path.resolve(__dirname, './src'),
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions,
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            url: require.resolve('url'),
            assert: require.resolve('assert'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            buffer: require.resolve('buffer'),
            stream: require.resolve('stream-browserify'),
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: true,
            title: 'Phaser Webpack Template',
            appMountId: 'app',
            filename: 'index.html',
            inlineSource: '.(js|css)$',
            minify: false,
        }),
        new CopyPlugin({
            patterns: [{from: "assets", to: "assets"}]
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    devServer: {
        port: 5000,
        liveReload: true,
        hot: true
    },
};
module.exports = config;