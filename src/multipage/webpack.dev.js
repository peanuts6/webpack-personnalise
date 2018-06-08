const path = require("path")
const baseConfig = require("./webpack.base.js")

let config = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: [
      path.resolve("./", "_dist/multipage"),
      path.resolve("./", "public")
    ],
    publicPath: "",
    compress: true,
    stats: {
      colors: true,
      chunks: false
    },
    port: 3001
  }
}
let cons = Object.assign({}, baseConfig, config)
module.exports = cons
