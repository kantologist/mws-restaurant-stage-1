const HtmlWebpacklugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const merge = require('webpack-merge');
const CompressionPlugin = require('brotli-gzip-webpack-plugin');

const commonConfig =merge([

    {
        entry: {
            "main":__dirname + '/js/main.js',
            "restaurant_info": __dirname + '/js/restaurant_info.js',
            "dbhelper": __dirname + '/js/dbhelper.js'
        },
        output: {
            path: __dirname + '/dist',
            filename: '[name].js',
            publicPath: '/mws-restaurant-stage-1'
        },
        devServer: {
            port: 8000
        },

        module : {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: [
                        /node_modules/
                    ],
                }

            ]
        },

        plugins: [
            new HtmlWebpacklugin({
                template: __dirname + '/index.html',
                inject: 'body',
                chunks:['main', 'dbhelper']
            }),
            new HtmlWebpacklugin({
                template: __dirname + '/restaurant.html',
                inject: 'body',
                chunks:['restaurant_info', 'dbhelper'],
                filename: 'restaurant.html'
            }),
            new DashboardPlugin(),
            new ExtractTextPlugin(__dirname + "/css/style.css"),
            new CopyWebpackPlugin([
                {from:__dirname + "/js/sw.js", to: './'},
                {from:__dirname + "/css/*", to: './'},
                {from:__dirname + "/img/*", to: './'},
                {from:__dirname + "/data/*", to: './'},
                {from:__dirname + "/manifest.json", to: './'}

            ]),
            new WriteFilePlugin(),
            // new CompressionPlugin({
            //     asset: '[path].br[query]',
            //     algorithm: 'brotli',
            //     test: /\.(js|css|html|svg)$/,
            //     threshold: 10240,
            //     minRatio: 0.8,
            //     quality: 11,
            //     exclude: /sw.js/
            // })
        ]
    }
]);

const productionConfig = merge([
    {
        output: {
            path: __dirname + '/dist',
            filename: '[name].js',
            publicPath: '/mws-restaurant-stage-1'
        },

        mode: 'production',
        plugins : [
            new HtmlWebpacklugin({
                template: __dirname + '/index.html',
                inject: 'body',
                chunks:['main', 'dbhelper']
            }),
            new HtmlWebpacklugin({
                template: __dirname + '/restaurant.html',
                inject: 'body',
                chunks:['restaurant_info', 'dbhelper'],
                filename: 'restaurant.html'
            }),
            new DashboardPlugin(),
            new ExtractTextPlugin(__dirname + "/css/style.css"),
            new CopyWebpackPlugin([
                {from:__dirname + "/js/sw.js", to: './mws-restaurant-stage-1/'},
                {from:__dirname + "/css/*", to: './mws-restaurant-stage-1/'},
                {from:__dirname + "/img/*", to: './mws-restaurant-stage-1/'},
                {from:__dirname + "/data/*", to: "./mws-restaurant-stage-1/"},
                {from:__dirname + "/manifest.json", to: "./mws-restaurant-stage-1/"}

            ]),
            new WriteFilePlugin(),
            new CompressionPlugin({
                asset: '[path].br[query]',
                algorithm: 'brotli',
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8,
                quality: 11,
                exclude: /sw.js/
            })
        ]
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