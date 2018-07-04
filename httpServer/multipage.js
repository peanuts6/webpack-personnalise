const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const Webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const env = process.env.ENV
const type = process.env.TYPE
const port = process.env.PORT
const ssl = process.env.SSL
if (!env) {
  console.log(`Need a enviroment variable`)
  return
}
if (!type) {
  console.log(`Which project type do you run?`)
  return
}
const webpackConfig = require("../src/" + type + "/webpack.config.js")
// const webpackConfig = require("../src/" + type + "/webpack.config.js")({env:env,port:port,ssl:ssl})
const RootStr = "./src/"+type
const Root = path.resolve(RootStr, "")

console.log("env:" + env + " type:" + type)


compiler = Webpack(webpackConfig)
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
    stats: {
        colors: true
    },
    before(app) {
        app.use((req, res, next) => {
            console.log(`Using middleware for ${req.url}`)
            next()
        })
    }
})

const server = new WebpackDevServer(compiler, devServerOptions)

server.listen(devServerOptions.port, "127.0.0.1", () => {
    console.log("Starting server on http://localhost:" + devServerOptions.port)
})
