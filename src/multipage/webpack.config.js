const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = function(options) {
  let compiler = null
  let sslKey = null
  let sslCert = null
  let env = options.env || process.env.ENV || "dist"
  let port = options.port || process.env.PORT
  let config = require("./webpack." + env)
  if (port) {
    config.devServer["port"] = port
  }
  const RootStr = "./src/multipage"
  const Root = path.resolve(RootStr, "")

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
          if (entry) {
            entries[entry] = `${pageRoot}/${entry}.js`
            // entries.push(`${pageRoot}/${entry}.js`)
            plugins.push(
              new HtmlWebpackPlugin({
                templateParameters: {
                  title: `${entry}`,
                  entryName: `${entry}`
                },
                filename: `${entry}.html`,
                template: `${Root}/templates/index.html`,
                chunks: [`${entry}`]
              })
            )
          }
        })
      } else {
        entry = checkEntry("", e)
        if (entry) {
          entries[entry] = `${pageRoot}/${entry}.js`
          // entries.push(`${pageRoot}/${entry}.js`)
          plugins.push(
            new HtmlWebpackPlugin({
              templateParameters: {
                title: `${entry}`,
                entryName: `${entry}`
              },
              filename: `${entry}.html`,
              template: `${Root}/templates/index.html`,
              chunks: [`${entry}`]
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

  return config
}
