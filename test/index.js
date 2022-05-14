const path = require('path');
const webpack = require('webpack');
const VersionWebpackPlugin = require('../src');

const compiler = webpack({
    entry: path.resolve(__dirname, 'main.js'),
    output: {
        path: path.resolve(__dirname, '../dist')
    },
    mode: 'production',
    plugins: [
        new VersionWebpackPlugin({
            mode: 'production'
        })
    ]
})

compiler.run();