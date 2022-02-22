/**
 * 使用 module.exports 方式导出的配置对象
 */
const common = require('./common')
const testEnvConfig = require('./testEnv')
const productionConfig = require('./productionEnv')
const sitConfig = require('./sitEnv')
const uatConfig = require('./uatEnv')

const config = {
    ...common
}

// console.log('BUILD_ENV = ', process.env.BUILD_ENV)
if (process.env.BUILD_ENV === 'test') {
    Object.assign(config, {
        ...testEnvConfig,
        ...sitConfig
    })
} else if (process.env.BUILD_ENV === 'production') {
    Object.assign(config, {
        ...productionConfig
    })
} else if (process.env.BUILD_ENV === 'sit') {
    Object.assign(config, {
        ...sitConfig
    })
} else if (process.env.BUILD_ENV === 'uat') {
    Object.assign(config, {
        ...uatConfig
    })
} else if (process.env.BUILD_ENV === 'cubeBridge-test') {
    Object.assign(config, {
        ...testEnvConfig
    })
} else if (process.env.BUILD_ENV === 'cubeBridge-debug-sit') {
    Object.assign(config, {
        ...sitConfig,
        cubeBridge: {
            serverURL: sitConfig.cubeBridge.serverURL,
            userInfo: testEnvConfig.cubeBridge.userInfo
        }
    })
} else if (process.env.BUILD_ENV === 'cubeBridge-debug-uat') {
    Object.assign(config, {
        ...uatConfig,
        cubeBridge: {
            serverURL: uatConfig.cubeBridge.serverURL,
            userInfo: testEnvConfig.cubeBridge.userInfo
        }
    })
} else if (common.BUILD_ENV === 'cubeBridge-prod') {
    Object.assign(config, {
        ...productionConfig,
        cubeBridge: {
            serverURL: productionConfig.cubeBridge.serverURL
            // userInfo: testEnvConfig.cubeBridge.userInfo // TODO 测试用
        }
    })
} else {
    Object.assign(config, {
        ...testEnvConfig,
        ...sitConfig
    })
}

module.exports = config
