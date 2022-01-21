// const MyPromise = require('./myPromise');

// const promise = new MyPromise((resolve, reject)=> {
//   resolve('success')
// })

// promise.then(res=> {
//   console.log(1);
//   console.log('resolve1:', res);
//   return MyPromise.resolve('success2')
// }, err=> {
//   console.log(err);
// }).then(res=> {
//   console.log(2);
//   console.log('resolve2:', res)
// });

// let template = '{{name}} is {{age}} very young';
// let content = {name: 'afei', age: 18};
// let regTemp = /\{\{(.*?)\}\}/g; // 采用正则惰性匹配
// let newStr = template.replace(regTemp, function(match, key) {
//   console.log(key);
//   return content[key.trim()];
// });
// console.log(newStr);

// Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject)=> {
    if (!Array.isArray(promises)) throw new TypeError('promises must is array');
    const _promises = promises.map(
      item=> item instanceof Promise ? item : Promise.resolve(item)
    );
    let result = [];
    let count = 0;
    _promises.forEach((promise, ind)=> {
      promise.then(res=> {
        result[ind] = res;
        count++;
        count === _promises.length && resolve(result);
      }).catch(err=> {
        reject(err);
      })
    })
  })
}

const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]

// promiseAll(promises).then(res=> {
//   console.log(res);
// }).catch(err=> {
//   console.log(err.message);
// })

// Promise finally
Promise.prototype.myFinally = function(callback) {
  return this.then((res)=> {
    return Promise.resolve(callback()).then(()=> {
      return res;
    })
  }, err=> {
    return Promise.resolve(callback()).then(()=> {
      throw err;
    })
  })
}

// const p1 = new Promise((resolve, reject)=> {
  // resolve('success')
  // reject('fail')
// })

// p1.myFinally(()=> {
//   console.log('finally')
// }).then(res=> {
//   console.log(res);
// }).catch(err=> {
//   console.log(err);
// })

// Promise.allSettled
function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([]);
  return new Promise((resolve, reject)=> {
    const _promises = promises.map(
      item => item instanceof Promise ? item : Promise.resolve(item)
    );
    const result = [];
    let count = 0;
    _promises.forEach((promise, ind)=> {
      promise.then(res=> {
        result[ind] = {
          status: 'fulfilled',
          value: res
        };
        count++;
        count === _promises.length && resolve(result);
      }).catch(err=> {
        result[ind] = {
          status: 'rejected',
          value: err
        };
        count++;
        count === _promises.length && resolve(result);
      })
    })
  })
}

// const promises2 = [
//   Promise.resolve(1),
//   Promise.resolve(2),
//   Promise.resolve(3),
//   Promise.reject('fail1'),
//   Promise.reject('fail2'),
//   Promise.reject('fail3')
// ]

// allSettled(promises2).then(res=> {
//   console.log(res);
// })

// 数组去重
// 双重for splice
let arr = [1, 2, 3, 4, 1, 4, 3, 5, 2, 6];
function unique1(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === arr[i]) {
        arr.splice(j, 1)
        j--;
      }
    }
  }
  return arr;
}

// console.log(unique1(arr));

// indexOf, includes
function unique2(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }
  return result;
}

// console.log(unique2(arr));

function unique3(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

// console.log(unique3(arr))

// sort排序后，采用快慢指针
function unique4(arr) {
  arr.sort((a, b)=> a - b);
  let slow = 1;
  let fast = 1;
  while(fast < arr.length) {
    if (arr[fast] !== arr[fast - 1]) {
      arr[slow++] = arr[fast];
    }
    fast++
  }
  arr.length = slow;
  return arr;
}

// console.log(unique4(arr));

// Set
function unique5(arr) {
  let result = new Set(arr);
  return [...result];
}

// console.log(unique5(arr));

// Map
function unique6(arr) {
  let map = new Map();
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (map.has(arr[i])) {
      map.set(arr[i], true);
    } else {
      map.set(arr[i], false);
      result.push(arr[i]);
    }
  }
  return result;
}

// console.log(unique6(arr));

// filter indexOf
function unique7(arr) {
  return arr.filter((val, i, _arr)=> {
    return _arr.indexOf(val) === i;
  })
}

// console.log(unique7(arr));

// reduce
function unique8(arr) {
  return arr.reduce((_arr, cur)=> {
    if (!_arr.includes(cur)) {
      _arr.push(cur);
    }
    return _arr;
  }, [])
}

console.log(unique8(arr));