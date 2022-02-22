/**
 * 测试环境的配置参数
 */
const testEnvConfig = {
    // orgId: '',
    // orgName: '',
    // userName: '',
    // userDisplayName: '',
    language: 'zh', // 默认语言
    workcenterCode: 'xxxxxx',
    workcenterName: 'xxxxxx',
    cubeBridge: {
        serverURL: 'http://localhost.sit.com/api/app/restful/srmMicroLoSit',
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

module.exports = testEnvConfig
