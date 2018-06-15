
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

const babelConfig = require("./babel.json")

let compiler = null
let sslKey = null
let sslCert = null
let env = process.env.ENV || "dist"
let type = process.env.TYPE
let port = process.env.PORT
const RootStr = "./src/vue"
const Root = path.resolve(RootStr, "")

if (!env) {
  console.log(`Need a enviroment variable`)
  return
}
if (!type) {
  console.log(`Which project type do you run?`)
  return
}
console.log(`env:${env} type:${type} port:${port}`)

let config = {
    entry:'./src/vue/index.js',
    output: {
        path: path.resolve("./", "_dist/vue"),
        filename: "[name].js",
        chunkFilename: "[name].js?[chunkhash]",
        publicPath: ""
    },
    resolve: {
        modules: ["node_modules", path.resolve("./src/", "vue")],
        extensions: [".js",".vue", ".json", ".css"],
        alias: {
        }
    },
    externals: {},
    module: {
        rules: [
            // {
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre',
            //     include: [
            //         path.resolve('./src/vue/')
            //     ]
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: babelConfig.presets.map(item => {
                    if (item instanceof Array) {
                        item[0] = require.resolve(item[0])
                        return item
                    } else {
                        var a = require.resolve(item)
                        return a
                    }
                    }),
                    plugins: babelConfig.plugins.map(require.resolve)
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "html-loader"
            },
            // {
            //     test: /\.html$/,
            //     exclude: /node_modules/,
            //     use: [
            //         // apply multiple loaders and options
            //         "htmllint-loader",
            //         {
            //             loader: "html-loader",
            //             options: {
            //                 /* ... */
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(png|jpe?g|gif|svg|woff|eot|ttf|pkg|exe)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    outputPath: `../assets/files/`,
                    name: '[path][name].[ext]?v=[hash:8]'
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve('./src/vue','index.html'),
        })
    ]
}

const devServer = {
        contentBase: [
            path.resolve("./", "_dist/vue"),
            path.resolve("./", "public")
        ],
        publicPath: "",
        compress: true,
        stats: {
            colors: true,
            chunks: false
        },
        port: 3003
}


if (env=="dev") {
    config.mode = "development"
    config.devtool = "source-map"
    config.devServer = devServer
    if(port){
        config.devServer["port"] = port
    }
}else{
    config.mode = "production"
    config.plugins.push()
}

module.exports = config



