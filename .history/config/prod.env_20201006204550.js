// 'use strict'
// module.exports = {
//   NODE_ENV: '"production"'
// }


'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  // OPEN_PROXY: false // 是否开启代理, 重置后需重启vue-cli
  OPEN_PROXY: true // 是否开启代理, 重置后需重启vue-cli
})

