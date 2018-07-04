
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

const babelConfig = require("./babel.json")

let env = process.env.ENV || "dist"
let type = process.env.TYPE || "avalon"
let port = process.env.PORT
const RootStr = "./src/"+type
const Root = path.resolve(RootStr, "")
const swigConfig = {
    
}

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
    output: {
        path: path.resolve("./", "_dist/"+type),
        filename: "[name].js",
        chunkFilename: "[name].js?[chunkhash]",
        publicPath: ""
    },
    resolve: {
        modules: ["node_modules", path.resolve("./src/", ""+type)],
        extensions: [".js", ".json", ".css"],
        alias: {}
    },
    externals: {},
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loaders: path.resolve(__dirname, 'build/swig-loader'),
                query: { config: swigConfig }
            },
            {
                test: /\.tpl$/,
                exclude: /node_modules/,
                loader: "html-loader"
            },
            {
                test: /\.js$/,
                loader: 'es3ify-loader'
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
                    plugins: babelConfig.plugins.map(item => {
                        if (item instanceof Array) {
                            item[0] = require.resolve(item[0])
                            return item
                        } else {
                            var a = require.resolve(item)
                            return a
                        }
                    })
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|eot|ttf|pkg|exe)$/,
                exclude: /node_modules/,
                loader: "file-loader",
                options: {
                    outputPath: `../${type}/files/`,
                    name: "[path][name].[ext]?v=[hash:8]"
                }
            }
        ]
    }
}

const devServer = {
  contentBase: [path.resolve("./", "_dist/"+type), path.resolve("./", "public")],
  publicPath: "",
  compress: true,
  stats: {
    colors: true,
    chunks: false
  },
  port: 3005
}

if (env == "dev") {
  config.mode = "development"
  config.devtool = "source-map"
  config.devServer = devServer
  if (port) {
    config.devServer["port"] = port
  }
} else {
  config.mode = "production"
  config.plugins.push()
}

module.exports = config
