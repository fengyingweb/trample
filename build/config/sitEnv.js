/**
 * sit环境的配置参数
 */

const sitEnvConfig = {
    // 埋点的相关配置，没有配置则不引入埋点功能
    // point: {
    //     appSecrect: 'xxxxxx',
    //     appName: 'App',
    //     moduleName: 'G-App',
    //     tokenApi: 'http://localhost:3000/api/1.0.0/getToken',
    //     mainLogSrc: 'http://localhost:3000/js/mainLog.js',
    //     detailLogSrc: 'http://localhost:3000/js/detailLog.js'
    // },
    // sit环境服务器的相关配置
    server: {
        hostName: 'localhost.sit.com',
        port: 80,
        baseUrl: 'http://localhost.sit.com',
        cookie: ''
    },
    
    cubeBridge: {
        serverURL: 'http://localhost.sit.com/api/app/restful/srmMicroLoSit/'
    }
}

module.exports = sitEnvConfig
