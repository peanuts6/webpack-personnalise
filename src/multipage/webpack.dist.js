const baseConfig = require("./webpack.base.js")
let config = {
  mode: "production"
}
let cons = Object.assign({}, baseConfig, config)
module.exports = cons
