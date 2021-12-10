## 深拷贝demo

```js
let sourceObj = {
  a: 1,
  b: 2,
  name: '熊小美',
  age: 18,
  prizes: [
      {name: '眼罩', prizeVal: 20},
      {name: '京东卡', prizeVal: 10},
      {name: '优惠券', prizeVal: 50, info: {desc: '50元无门槛优惠券', coupon: '1234477444'}},
      {name: '爱奇艺卡', prizeVal: 30, useMethods: ['开通vip', '会员', '复制']},
      ['12-08', '12-09', '12-10']
  ],
  lists: ['追梦', '阿飞', '梓晨', '玄武'],
  members: [['a', 'b'], ['c', 'd']],
}

function deepClone(val) {
  if(Array.isArray(val)) {
    return val.map(item=> deepClone(item))
  }
  if(typeof val === 'object') {
    return _deepAssign({}, val);
  }
  return val;
}

function _deepAssign(to, from) {
  Object.keys(from).forEach(key=> {
     assignObj(to, from, key)
  })
  return to;
}

function assignObj(to, from, key) {
  let value = from[key]
  console.log(value)
  if (typeof value === 'undefined') return;
  if (Object.prototype.hasOwnProperty.call(to, key) && typeof to[key] !== 'undefined') return;
  if (!Object.prototype.hasOwnProperty.call(to, key) && typeof to[key] === 'undefined' && typeof value !=='object') {
    to[key] = value;
  } else if (!Object.prototype.hasOwnProperty.call(to, key) &&
             typeof to[key] === 'undefined' &&
             typeof value === 'object') {
     if (Array.isArray(value)) {
       to[key] = []
       to[key] = value.map((item, ind)=> {
         if (typeof item === 'object') {
           return _deepAssign(Array.isArray(item) ? (to[key][ind] = []) : Object(to[key][ind]), item)
         } else {
           return item;
         }
       })
     } else {
       _deepAssign(Object(to[key]), value)
     }
  }
}
let copyObj = deepClone(sourceObj)
copyObj.name = '黄小鸭'
copyObj.prizes[4][0] = '12-07'
copyObj.lists[2] = '王朝'
copyObj.members[1][1]= 'e'
console.log(copyObj)
console.log(sourceObj)
```
