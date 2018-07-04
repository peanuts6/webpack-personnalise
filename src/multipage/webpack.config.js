const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const babelConfig = require("./babel.json")


let env = process.env.ENV || "dist"
let type = process.env.TYPE
let port = process.env.PORT
const RootStr = "./src/"+type
const Root = path.resolve(RootStr, "")
const swigConfig = {
  origins:{

  }
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
    publicPath: "/"
  },
  resolve: {
    modules: ["node_modules", path.resolve("./src/", ""+type)],
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
          test: /\.html$/,
          exclude: /node_modules/,
          loaders: path.resolve(__dirname, '../../build/swig-loader'),
          query: { config: swigConfig }
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
  },
  plugins: [
    new CopyWebpackPlugin([
        {
            from: 'public/vendor/',
            to: 'vendor/',
            ignore: [  ],
            force: true,
            cache: true
        },
        {
            from: 'public/styles/',
            to: 'styles/',
            ignore: [  ],
            force: true,
            cache: true
        }
    ])
  ]
};


  getEntries()

  function getEntries() {
    let entries = {},
      plugins = []
    console.log("========== start ===========")
    let pageRoot = path.join(Root, "pages")
    let entry
    walkpages(pageRoot, "", e => {
      // console.log("first dir:",e);
      let p1 = path.resolve(pageRoot, e)
      // console.log("first path:",p1)
      if (fs.statSync(p1).isDirectory()) {
        walkpages(p1, e, e2 => {
          // console.log("second dir: ",e2)
          let p2 = path.resolve(p1, e2)
          // console.log("second path:",p2)
          if (fs.statSync(p2).isDirectory()) {
            console.log("Limit two dir")
            return
          }
          entry = checkEntry(e + "/", e2)
          let chunks;
          if (entry) {
            entries[entry] = `${pageRoot}/${entry}.js`
            entrys=entry.split('/')
            chunks = [].concat(entrys[1] || entrys[0])
            // entries.push(`${pageRoot}/${entry}.js`)
            console.log("endty1:", Root, `${entry}`,chunks)
            plugins.push(
              new HtmlWebpackPlugin({
                filename: `${entry}.html`,
                template: `./src/${type}/pages/${entry}.html`,
                chunks: [entry]
              })
            )
          }
        })
      } else {
        entry = checkEntry("", e)
        if (entry) {
          entries[entry] = `${pageRoot}/${entry}.js`
          entrys = entry.split("/")
          chunks = [].concat(entrys[1] || entrys[0])
          // entries.push(`${pageRoot}/${entry}.js`)
          console.log("endty2:", Root, `${entry}`,chunks)
          plugins.push(
            new HtmlWebpackPlugin({
              filename: `${entry}.html`,
              template: `./src/${type}/pages/${entry}.html`,
              chunks: [entry]
            })
          )
        }
      }
    })
    console.log("entries:", entries)
    // console.log("plugins:",plugins);

    config.entry = entries
    config.plugins = config.plugins.concat(plugins)
    console.log("========== end ===========")
  }

  function walkpages(dir, startPath, next) {
    let candidateEntries = fs.readdirSync(dir)
    candidateEntries.forEach(e => {
      next(e)
    })
  }

  function checkEntry(startPath, filename) {
    let files = filename.split(".")
    let file,
      chunks = []
    if (files.length > 1 && files[1] == "html") {
      file = startPath + files[0]
    }
    return file
  }

  const devServer = {
        contentBase: [
            path.resolve("./", "_dist/"+type),
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


  if (env=="dev") {
      config.mode = "development"
      config.devtool = "source-map"
      config.devServer = devServer
      if(port){
          config.devServer["port"] = port
      }
  }else{
      config.mode = "production"
      config.optimization = {
        minimizer:[
            new UglifyJsPlugin({
                uglifyOptions:{
                    warning: 'verbose',
                    ecma: 5,
                    ie8: true,
                    beautify: false,
                    compress: false,
                    comments: false,
                    mangle: false,
                    toplevel: false,
                    keep_classnames: true,
                    keep_frames: true
                }
            })
          ]
      }
  }
  
module.exports = config
