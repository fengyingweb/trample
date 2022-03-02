import Mock from 'mockjs';

const allDatas = [
  {
    path: '/Agreement/getLuaDocList',
    type: 'post',
    data: {
      code: '0',
      success: true,
      message: 'success',
      'list|1-10': [
        {
          'id|+1': 1,
          applianceType: '空调',
          modelNumber: 'X7-321B',
          childType: '12334',
          docSize: '12.5KB',
          name: 'X&-321B电控协议',
          version: 'V1.2',
          mdate: '@datetime(2018-06-30 12:30:30)',
          cuid: '邓贺剑'
        }
      ],
      'count': function () {
        return this.list.length;
      }
    }
  }
];

const productDatas = (datas) => {
  datas.forEach(item => {
    Mock.mock(new RegExp(item.path), item.type, item.data);
  });
};
console.log(Mock);
productDatas(allDatas);