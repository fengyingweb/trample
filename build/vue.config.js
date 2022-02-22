const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const appPublish = require('./plugins/appPublish')
const updateCubeBridgeConfig = require('./plugins/updateCubeBridgeConfig')
// const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin') // 编译进度插件
const CopyPlugin = require('copy-webpack-plugin')

let appName = ''
try {
    console.log('process.env.npm_config_argv = ', process.env.npm_config_argv)
    // process.env.npm_config_argv =  {"remain":[],"cooked":["run","build-and-pub:sit","-[ExitCardRecordCubeBridge]"],"original":["run","build-and-pub:sit","-[ExitCardRecordCubeBridge]"]}
    if (JSON.parse(process.env.npm_config_argv).original.length >= 3) {
        appName = JSON.parse(process.env.npm_config_argv).original.splice(2)[0]
        // appName e.g. "-[ExitCardRecordCubeBridge]"
        const matchApp = appName.match(/\[(\S*)\]/)
        if (matchApp.length >= 2) {
            appName = matchApp[1]
        }
    }
} catch (err) {
    console.log('parse appName has error:', err)
}
const appConfig = {
    appName
}
console.log('appConfig = ', appConfig)

let unExistModules = []
let entries = []
try {
    let enterModules = JSON.parse(process.env.npm_config_argv).original.splice(2)[0] // 用户输入要打包的模块
    enterModules = enterModules && enterModules.substr(2, enterModules.length - 3)
    const allModules = fs.readdirSync('./src/modules') // 所有模块
    const existModules = enterModules ? allModules.filter(item => enterModules.split(',').indexOf(item) > -1) : [] // 用户输入的有效模块
    unExistModules = enterModules ? enterModules.split(',').filter(item => existModules.indexOf(item) < 0) : [] // 用户输入的不存在的模块
    entries = enterModules ? existModules : allModules // 实际打包的模块
} catch (err) {
    console.log('parse enterModules has error: ', err)
}

// 提示用户所输入的不存在的模块
if (unExistModules.length) {
    console.log(
        chalk.yellow(`—————————————— 模块 ${unExistModules.join(',')} 不存在，有效模块将会继续打包 ——————————————`)
    )
}

// console.log('process.env.npm_config_argv =', JSON.parse(process.env.npm_config_argv))
const pluginsArr = []
const isCubeBridge = process.env.BUILD_ENV.indexOf('cubeBridge') > -1
try {
    const cmdName = JSON.parse(process.env.npm_config_argv).original.splice(1)[0]
    console.log('cmdName = ', cmdName)
    if (cmdName.indexOf('build-and-pub') > -1) {
        // 是发布命令的话，使用appPublish插件
        pluginsArr.push(new appPublish(appConfig))
    }
    if (isCubeBridge && cmdName.indexOf('build') > -1) {
        // 只在打包命令中运行以下插件
        // pluginsArr.push(new updateCubeBridgeConfig(appConfig))
        pluginsArr.push(new CopyPlugin([{ from: `**/${entries[0]}/CubeBridge.json`, to: 'CubeBridge.json' }])) // 把CubeBridge.json复制到打包文件的根目录)
    }
} catch (err) {
    console.log('parse cmdName has error: ', err)
}
console.log('plugins = ', pluginsArr)

const envConfig = require('./config/buildIndex.js')
// console.log('envConfig = ', envConfig)
const pages = {}
entries.forEach(entry => {
    if (entry.indexOf('.') !== 0) {
        pages[entry] = {
            entry: `src/modules/${entry}/main.js`,
            template: `public/index.html`,
            filename: isCubeBridge ? 'index.html' : `${entry}.html`,
            mainLogSrc: envConfig.ceam ? envConfig.ceam.mainLogSrc : '',
            detailLogSrc: envConfig.ceam ? envConfig.ceam.detailLogSrc : '',
            cordovaSrc: isCubeBridge ? './cordova.js?ver=md5' : '',
            cordovaPluginsSrc: isCubeBridge ? './cordova_plugins.js?ver=md5' : ''
        }
    }
})
console.log('pages = ', pages)

const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

const envList = [
    'http://localhost.sitapi.com',
    'http://localhost.uatapi.com',
    'http://localhost.api.com',
    'http://localhost.verapi.com',
    'http://localhost:3000'
]
const buildEnv = process.env.BUILD_ENV
console.log('buildEnv = ', buildEnv)
let target = envList[0]
switch (buildEnv) {
    case 'sit-test':
        target = envList[0]
        break
    case 'uat-test':
        target = envList[1]
        break
    case 'production-test':
        target = envList[2]
        break
    case 'ver-test':
        target = envList[3]
        break
    case 'backend':
        target = envList[4]
        break
    default:
        break
}
console.log('target = ', target)
const proxyConfig = {
    '/api/': {
        target,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/api/': 'app/'
        }
    }
}

// console.log('----------------------------------------------------------------')
if (envList.slice(0, envList.length - 1).indexOf(proxyConfig['/api/'].target) > -1) {
    proxyConfig['/api/'].pathRewrite = {}
}
module.exports = {
    outputDir: 'dist',
    // 打包文件要在本地运行，所以公共路径要改为./
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    devServer: {
        /**
         * sit环境： http://localhost.sitapi.com
         * uat环境： http://localhost.uatapi.com
         * 生产环境: http://localhost.api.com
         */
        proxy: {
            '/api-getAll': {
                target: 'http://localhost.sitapi.com',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api-getAll': ''
                }
            },
            ...proxyConfig
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*'],
                        // 该项仅在使用 Circle 组件时需要
                        // 原因参见 https://github.com/youzan/vant/issues/1948
                        selectorBlackList: ['van-circle__layer']
                    })
                ]
            },
            less: {
                modifyVars: {
                    red: '#F56C6C',
                    blue: '#409EFF',
                    orange: '#E6A23C',
                    'text-color': '#333',
                    mediaPurple: '#67C23A'
                }
            }
        }
    },
    pages,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src')
            }
        },
        // externals: {
        //     vue: 'vue',
        //     'vue-router': 'vue-router',
        //     vuex: 'vuex',
        //     'vue-i18n': 'vue-i18n',
        //     axios: 'axios'
        // },
        module: {
            rules: [
                {
                    test: /main.js$/,
                    use: [
                        {
                            loader: require.resolve('./loaders/pointLoader.js')
                        } // 把各个module中的的main.js文件中的import app转换为引用公共的app组件，可实现埋点功能
                    ],
                    exclude: /node_modules/
                },
                {
                    test: require.resolve('./src/config/common.js'),
                    use: [
                        {
                            loader: require.resolve('./loaders/envLoader.js')
                        } // 把BUILD_ENV环境参数放入common.js中
                    ]
                }
            ]
        },
        // output: {
        //     library: `testModule`,
        //     libraryTarget: 'umd',
        //     jsonpFunction: `webpackJsonp_${packageName}`
        // }, // 用于编译qiankun微服务框架的子项目
        devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
        plugins: [
            // new SimpleProgressWebpackPlugin(),
            ...pluginsArr
        ]
    }
}
