
const envConfig = require('../config/buildIndex')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const http = require('http')
const querystring = require('querystring')
const compressing = require('compressing')

/**
 * 根据环境参数，在打包完成后，
 * 把app包自动发布到对应环境的插件
 */
class AppPublish {

    constructor(appConfig) {
        this.appConfig = appConfig
    }

    apply (compiler) {
        compiler.plugin('done', (stats) => {
            // 在 done 事件中回调 doneCallback
            this.doneCallback(stats, this.appConfig);
        });
        compiler.plugin('failed', (err) => {
            // 在 failed 事件中回调 failCallback
            this.failCallback(err);
        });
    }

    /**
     * 完成后的回调
     */
    doneCallback (stats, appConfig) {
        getExistAppByPageName(appConfig.appName).then(appInfo => {
            if (appInfo) {
                const distDocPath = path.resolve(__dirname, '../../../../dist')
                const distZipPath = path.resolve(__dirname, '../../../../dist.zip')
                // zipper.sync.zip(distDocPath).compress().save(distZipPath)

                compressing.zip.compressDir(distDocPath, distZipPath)
                    .then(() => {
                        console.log('压缩完成!!')
                        uploadFile(distZipPath).then(fileUrl => {
                            return fileUrl
                        }).then(fileUrl => {
                            const update = {
                                ...appInfo,
                                appVersion: appInfo.appVersion + 1,
                                packagePath: fileUrl,
                            }
                            updateApp(update).then(res => {
                                console.log('更新App成功!!', res)
                            })
                        })
                    })
                    .catch(err => {
                        console.log('压缩有异常：', err)
                    });
            } else {
                console.log(`没有找到 appName='${appConfig.appName}' 的app, 不进行发布操作.`)
            }
        })
    }

    failCallback (err) {
        console.error(err)
    }
}

// 导出插件 
module.exports = AppPublish;

/**
 * 根据appName获取已存在的app的详细信息
 * @param {String} appName 包名
 */
function getExistAppByPageName (appName) {
    return new Promise((resolve, reject) => {
        axios.post(`${envConfig.server.baseUrl}/api/sysAppFile/query`, {
            appName,
            pageNo: 1,
            pageSize: 1000
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Cookie: envConfig.server.cookie
            },
        }).then(res => {
            const resData = res.data
            if (resData) {
                const { code, data } = resData
                if (code === '0') {
                    const { list } = data
                    if (Object.prototype.toString.call(list) === '[object Array]' && list.length > 0) {
                        resolve(list.find(item => item.appName === appName))
                    } else {
                        resolve(undefined)
                    }
                }
            }
        }).catch(err => {
            reject('查询现有app有异常：' + err)
        })
    })
}

/**
 * 更新app
 * @param {*} appInfo 
 */
function updateApp (appInfo) {
    return new Promise((resolve, reject) => {
        axios.put(`${envConfig.server.baseUrl}/api/sysAppFile/update`, appInfo, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Cookie: envConfig.server.cookie
            },
        }).then(res => {
            const resData = res.data
            if (resData) {
                const { code, msg } = resData
                if (code === '0') {
                    resolve('update ok')
                } else {
                    reject('更新app有异常：' + msg)
                }
            }
        }).catch(err => {
            reject('更新app有异常：' + err)
        })
    })
}

/**
 * 上传文件的方法
 * @param {*} file 文件对象
 */
function uploadFile (filePath, ContentType = 'application/zip') {
    var post_data = {};//post提交数据
    var content = querystring.stringify(post_data); //#将对象转换成字符串，字符串里多个参数将用 ‘&' 分隔，将用 ‘=' 赋值
    var boundaryKey = Math.random().toString(16);
    var options = {
        hostname: envConfig.server.hostName,
        port: envConfig.server.port,
        path: '/api/sysAppFile/upload/zip',
        method: 'POST',
        headers: {
            // 'Accept': '*/*',
            // 'Accept-Encoding': 'gzip, deflate',
            // 'Connection': 'keep-alive',
            'Content-Type': 'multipart/form-data; boundary=----' + boundaryKey,     //文件上传标识与切割标识
            // 'Host':'127.0.0.1:5000',
            // 'Origin':'http://127.0.0.1:5000',
            // 'Referer':'http://127.0.0.1:5000/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            'Cookie': envConfig.server.cookie,
        }
    };

    const promise = new Promise((resolve, reject) => {
        var req = http.request(options, function (res) {

            res.setEncoding('utf8');
            let result = ''
            res.on('data', function (chunk) {
                result += chunk
            });

            res.on('end', function () {
                result = JSON.parse(result)
                const resData = result
                if (resData) {
                    const { code, data, msg } = resData
                    if (code === '0') {
                        resolve(data)     // data是上传文件的url
                    } else {
                        reject(msg)
                    }
                } else {
                    reject('上传文件有异常')
                }
            });

        });
        const fileName = filePath.split(path.sep).slice(-1)[0]
        var payload = '\r\n------' + boundaryKey + '\r\n' + 'Content-Disposition: form-data; name="file"; filename="' + fileName + '"\r\n' + 'Content-Type: ' + ContentType + '\r\n\r\n';
        var enddata = '\r\n------' + boundaryKey + '--';
        req.setHeader('Content-Length', Buffer.byteLength(payload) + Buffer.byteLength(enddata) + fs.statSync(filePath).size);
        req.write(payload);
        var fileStream = fs.createReadStream(filePath, { bufferSize: 4 * 1024 });
        fileStream.pipe(req, { end: false });
        fileStream.on('end', function () {
            req.end(enddata);
        });
        req.on('error', function (e) {
            reject('上传文件失败: ' + e.message)
        });
        req.write(content);// req.end();
    })

    return promise
}

