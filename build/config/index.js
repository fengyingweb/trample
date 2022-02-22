/**
 * 使用 export default 方式导出的配置对象
 */
const common = require('./common')
const testEnvConfig = require('./testEnv')
const productionConfig = require('./productionEnv')
const sitConfig = require('./sitEnv')
const uatConfig = require('./uatEnv')

const config = {
    ...common
}

if (common.BUILD_ENV === 'test') {
    Object.assign(config, {
        ...testEnvConfig,
        ...sitConfig
    })
} else if (common.BUILD_ENV === 'production') {
    Object.assign(config, {
        ...productionConfig
    })
} else if (common.BUILD_ENV === 'sit') {
    Object.assign(config, {
        ...sitConfig
    })
} else if (common.BUILD_ENV === 'uat') {
    Object.assign(config, {
        ...uatConfig
    })
} else if (common.BUILD_ENV === 'cubeBridge-test') {
    Object.assign(config, {
        ...testEnvConfig
    })
} else if (common.BUILD_ENV === 'cubeBridge-debug-sit') {
    Object.assign(config, {
        ...sitConfig,
        cubeBridge: {
            serverURL: sitConfig.cubeBridge.serverURL,
            userInfo: testEnvConfig.cubeBridge.userInfo
        }
    })
} else if (common.BUILD_ENV === 'cubeBridge-debug-uat') {
    Object.assign(config, {
        ...uatConfig,
        cubeBridge: {
            serverURL: uatConfig.cubeBridge.serverURL,
            userInfo: testEnvConfig.cubeBridge.userInfo
        }
    })
} else if (common.BUILD_ENV === 'cubeBridge-debug-prod') {
    Object.assign(config, {
        ...uatConfig,
        cubeBridge: {
            serverURL: productionConfig.cubeBridge.serverURL,
            userInfo: productionConfig.cubeBridge.userInfo
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

export default config
