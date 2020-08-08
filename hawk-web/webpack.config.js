const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
    mode: 'none',
    entry: './src/index.tsx', // Point to main file
    output: {
        path: __dirname + '/dist',
        filename: 'static/bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    performance: {
        hints: false,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                loaders: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        contentBase: 'src/',
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
        new CleanWebpackPlugin({
            verbose: true,
        }),
    ],
    mode: 'production',
    entry: {
        index: './src/index.tsx',
    },
    output: {
        path: dist,
        filename: '[name].js',
    },
    devServer: {
        contentBase: dist,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
    ],
};
