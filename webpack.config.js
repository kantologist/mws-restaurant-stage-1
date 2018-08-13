const HtmlWebpacklugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const merge = require('webpack-merge');

const commonConfig =merge([

    {
        entry: [],
        output: {
            path: __dirname + '/dist',
            filename: 'bundle.js',
            publicPath: '/'
        },
        devServer: {
            port: 8000
        },

        module : {
            rules: [

            ]
        },

        plugins: [
            new HtmlWebpacklugin({
                template: __dirname + '/index.html',
                inject: 'false'
            }),
            new HtmlWebpacklugin({
                template: __dirname + '/restaurant.html',
                inject: 'false',
                filename: 'restaurant.html'
            }),
            new DashboardPlugin(),
            new ExtractTextPlugin(__dirname + "/css/style.css"),
            new CopyWebpackPlugin([
                {from:__dirname + "/js/sw.js", to: './'},
                {from:__dirname + "/js/*", to: './'},
                {from:__dirname + "/css/*", to: './'},
                {from:__dirname + "/img/*", to: './'},
                {from:__dirname + "/data/*", to: "./"}
            ]),
            new WriteFilePlugin()
        ]
    }
]);

const productionConfig = merge([
    {
        output: {
            path: __dirname + '/dist',
            filename: 'bundle.js',
            publicPath: '/restaurant'
        },

        mode: 'production'
    }
]);

const developmentConfig = merge([
    {
        mode: 'development'
    }

]);

module.exports = (env) => {

    if (env == 'production'){
        return merge(commonConfig, productionConfig);
    }

    return merge(commonConfig, developmentConfig);
};