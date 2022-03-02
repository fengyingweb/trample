const WxRequest = require('./request.js');
const util = require('./util.js');
let http = new WxRequest();

http = http.create({
  baseUrl: util.baseUrl,
  timeout: 10000
});

// 请求拦截
http.interceptor.request((config) => {
  return config;
});

// 响应拦截
http.interceptor.response(res => {
  return res.data;
})
module.exports = http;