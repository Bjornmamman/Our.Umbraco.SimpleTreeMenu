const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    watch: true,
    context: path.resolve(__dirname, './'),
    entry: path.resolve(__dirname, './', 'index.js'),
    output: { path: path.resolve(__dirname, './') },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'TreeMenu/App_Plugins/SimpleTreeMenu/', to: 'WebsiteV8/App_Plugins/SimpleTreeMenu/' },
                { from: 'TreeMenu/App_Plugins/SimpleTreeMenu/', to: 'WebsiteV9/App_Plugins/SimpleTreeMenu/' },
                { from: 'TreeMenu/App_Plugins/SimpleTreeMenu/', to: 'WebsiteV10/App_Plugins/SimpleTreeMenu/' },
            ],
        }),
    ],
};