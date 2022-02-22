/**
 * 生产环境的配置参数
 */
const productionEnvConfig = {
    // 埋点的相关配置，没有配置则不引入埋点功能
    // point: {
    //     appSecrect: 'xxxxxx',
    //     appName: 'App',
    //     moduleName: 'G-App',
    //     mainLogSrc: 'http://localhost:3000/js/mainLog.js',
    //     detailLogSrc: 'http://localhost:3000/js/detailLog.js'
    // },
    // 生产环境服务器的相关配置
    server: {
        hostName: 'localhost',
        port: 80,
        baseUrl: 'http://localhost',
        cookie: ''
    },
    
    cubeBridge: {
        serverURL: 'http://localhost:8080/api/app/restful/srmMicroLo',
        userInfo: {
            uid: 'SJ13600009003',
            email: 'xxx@163.com',
            avatar: '',
            cn: 'sb',
            gender: '男',
            mobile: '13600009003',
            fullDeptName: 'xxx_xxx_xxx',
            departmentName: 'xxx',
            address: 'xxx',
            vendorId: '',
            extra: '{"xxa":"xx"}',
            employeenumber: '000000',
            positionName: '开发工程师',
            // ssoToken: 'token'
            ssoToken: 'xxxxxxxxxxx'
        }
    }
}

module.exports = productionEnvConfig
