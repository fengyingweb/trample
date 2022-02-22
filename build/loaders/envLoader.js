
var commonConfig = require('../config/common.js')

module.exports = function (content) {
    this.cacheable(false);      // 关闭该 Loader 的缓存功能
    this.addDependency('../config/common.js');     // 这个loader依赖config配置文件

    commonConfig.BUILD_ENV = process.env.BUILD_ENV
    return 'module.exports = ' + JSON.stringify(commonConfig)
};
