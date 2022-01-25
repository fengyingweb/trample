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

// console.log(unique8(arr));

const _toString = Object.prototype.toString;

const getType = (val)=> {
  return _toString.call(val);
}

// forEach
Array.prototype.myForEach = function(callback) {
  if (getType(callback) !== '[object Function]') return new TypeError('callback is not a function');
  let _arr = this;
  let thisArg = arguments[1] || global || window;
  for (let i = 0; i < _arr.length; i++) {
    callback.call(thisArg, _arr[i], i, _arr);
  }
}

// arr.myForEach((item, ind)=> {
//   console.log(ind, item);
// })

// reduce
Array.prototype.myReduce = function(fn) {
  let _arr = this, initVal = arguments[1];
  let i = 0;
  if (!initVal) {
    if (_arr.length === 0) {
      return new Error('initVal or arr.length must need one');
    }
    initVal = _arr[i];
    i++;
  }
  for (; i < _arr.length; i++) {
    initVal = fn(initVal, _arr[i], i, _arr);
  }
  return initVal;
}

// console.log(arr.myReduce((init, cur)=> {
//   return init + cur;
// }))

// map
Array.prototype.myMap = function(fn) {
  let _arr = this, thisArg = arguments[1] || global || window, result = []
  for (let i = 0; i < _arr.length; i++) {
    result.push(fn.call(thisArg, _arr[i], i, _arr));
  }
  return result;
}

// filter
Array.prototype.myFilter = function(fn) {
  let _arr = this, thisArg = arguments[1] || global || window, result = [];
  for (let i = 0; i < _arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      result.push(_arr[i]);
    }
  }
  return result;
}

// every
Array.prototype.myEvery = function(fn) {
  let _arr = this, thisArg = arguments[1] || global || window;
  let flag = true;
  for (let i = 0; i < _arr.length; i++) {
    if (!fn.call(thisArg, _arr[i], i, _arr)) {
      return false;
    }
  }
  return flag;
}

// some
Array.prototype.mySome = function(fn) {
  let _arr = this, thisArg = arguments[1] || global || window;
  let flag = false;
  for (let i = 0; i < _arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      return true;
    }
  }
  return flag;
}

// find
Array.prototype.myFind = function(fn) {
  let _arr = this, thisArg = arguments[1] || global || window;
  for (let i = 0; i < _arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      return _arr[i];
    }
  }

  return undefined;
}

// findIndex
Array.prototype.myFindIndex = function(fn) {
  let _arr = this, thisArg = arguments[1] || global || window;
  for (let i = 0; i < _arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      return i;
    }
  }

  return -1;
}

// indexOf
Array.prototype.myIndexOf = function(findVal, beginIndex = 0) {
  let _arr = this;
  if (!_arr.length || beginIndex >= _arr.length) {
    return -1;
  }
  if (!findVal) {
    return 0;
  }

  for (let i = beginIndex; i < _arr.length; i++) {
    if (_arr[i] === findVal) {
      return i;
    }
  }

  return -1;
}

// new
function createObj(constr) {
  let obj = Object.create(null);
  Object.setPrototypeOf(obj, constr.prototype);

  let res = constr.apply(obj, [].slice.call(arguments, 1));
  return typeof res === 'object' ? res : obj;
}

// call
Function.prototype.myCall = function(ctx, ...args) {
  ctx = ctx || global || window;
  ctx = Object(ctx);
  let fnName = Symbol();
  ctx[fnName] = this;
  let result = ctx[fnName](...args);
  delete ctx[fnName];
  return result;
}

// apply
Function.prototype.myApply = function(ctx, args) {
  ctx = ctx || global || window;
  ctx = Object(ctx);
  let fnName = Symbol();
  ctx[fnName] = this;
  let result = ctx[fnName](...args);
  delete ctx[fnName];
  return result;
}

// bind
Function.prototype.myFind = function(ctx) {
  ctx = ctx || global || window;
  ctx = Object(ctx);
  let fnName = Symbol();
  let args = [].slice.call(arguments, 1);
  ctx[fnName] = this;
  return function() {
    let fnArgs = [].slice.call(arguments);
    let result = ctx[fnName](...args.concat(fnArgs));
    delete ctx[fnName];
    return result;
  }
}

// setTimeout 实现 setInterval
function mySetInterval(fn, time) {
  let timer = null;
  const interval = ()=> {
    timer = setTimeout(()=> {
      fn();
      interval();
    }, time)
  };
  interval();

  return ()=> clearTimeout(timer);
}

// setInterval 实现 setTimeout
function mySetTimeout (fn, time) {
  let timer = null;
  timer = setInterval(()=> {
    clearInterval(timer);
    fn();
  }, time)

  return () => clearInterval(timer);
}