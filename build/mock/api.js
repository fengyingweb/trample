import request from '@/utils/http';
import './mock.js'; // 模拟数据,联调和生成是需注释掉
const {
  APPLICATION_NAME
} = window.environment.iotserver;

export const getLuaDocList = (params) => {
  return request({
    url: `${APPLICATION_NAME}/Agreement/getLuaDocList`,
    method: 'post',
    data: params
  }).then(res => res);
};