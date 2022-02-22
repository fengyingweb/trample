const path = require('path')
const fs = require('fs')

class CopyCubeBridgeConfig {
    constructor (appConfig) {
        this.appConfig = appConfig
    }

    apply (compiler) {
        // eslint-disable-next-line no-unused-vars
        compiler.plugin('emit', (compilation, callback) => {
            const cubeBridgeFilePath = path.resolve(
                __dirname,
                `../../../../modules/${this.appConfig.appName}/CubeBridge.json`
            )
            
            if (fs.existsSync(cubeBridgeFilePath)) {
                let fileContent = fs.readFileSync(cubeBridgeFilePath).toString()
                
                fileContent = JSON.parse(fileContent)
                fileContent.build += 1
                const versionArr = fileContent.version.split('.')
                if (versionArr.length > 0) {
                    versionArr[versionArr.length - 1] = parseFloat(versionArr[versionArr.length - 1]) + 1
                    fileContent.version = versionArr.join('.')
                }
               
                fs.writeFileSync(cubeBridgeFilePath, JSON.stringify(fileContent, 4))
                console.log(`${this.appConfig.appName}的cubeBridge.json, 完成更新, 版本号: ${fileContent.version}`)
            }
            callback()
        })
    }
}

// 导出插件
module.exports = CopyCubeBridgeConfig
