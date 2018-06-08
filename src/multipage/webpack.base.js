const path = require("path")
const babelConfig = require("./babel.json")

let config = {
  output: {
    path: path.resolve("./", "_dist/multipage"),
    filename: "[name].js",
    chunkFilename: "[name].js?[chunkhash]",
    publicPath: ""
  },
  resolve: {
    modules: ["node_modules", path.resolve("./src/", "multipage")],
    extensions: [".js", ".json", ".css"],
    alias: {
      jQuery: "./public/vendor/jquery/dist/jquery.min.js",
      $: "jQuery"
    }
  },
  externals: {},
  module: {
    rules: [
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
              // console.log('item',item,a);
              return a
            }
          }),
          plugins: babelConfig.plugins.map(require.resolve)
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          // apply multiple loaders and options
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      }
    ]
  },
  plugins: []
}

module.exports = config
