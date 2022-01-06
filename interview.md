# 面试汇总

##1 下面代码输出什么？

````js
let a = {name: '1'};
let b = a;
a.x = a = {name: '2'}
console.log(a.x) // undefined
console.log(b.x) // {name: '2'}
````

````js
var name = 'Hello';
(function(){
  if (typeof name === 'undefined') {
    var name = 'goole';
    console.log(`${name} .com`)
  } else {
    console.log(`${name} world`)
  }
})()
// 执行上面代码输出
// goole .com
// 如果函数自执行里边改成 let name = 'goole' 此时就是输出Hello world
````

````js
Promise.resolve().then(()=> {
  console.log(1)
  setTimeout(()=> {
    console.log(2)
  }, 0)
})

setTimeout(()=> {
  console.log(3)
  Promise.resolve().then(()=> {
    console.log(4)
  })
}, 0)

Promise.resolve().then(()=> {
  console.log(5)
  setTimeout(()=> {
    console.log(6)
  }, 0)
  return 7
}).then((val)=> {
   console.log(val)
})

setTimeout(()=>{
  console.log(8)
  Promise.resolve().then(()=> {
    console.log(9)
    return 10
  }).then((val)=> {
    console.log(val)
  })
}, 0)

console.log(11)
// 执行上面代码输出
// 11 1 5 7 3 4 8 9 10 2 6

// js事件轮询机制 主线程->微任务(promise、process.nextTick（node环境）、Object.observe, MutationObserver等)->宏任务(script(整体代码)，setTimeout、setInterval、XMLHttprequest、setImmediate、I/O、UI rendering等)

// 这里记住一句话：所有异步任务在执行过程，都是从异步任务队列中将回调函数拿到了任务栈中来执行，此时执行完任务栈里面的代码后，还是会继续按照之前的方式，先从微任务中拿，再从宏任务拿

````

````js
const fn = ()=> {
  console.log(this.name)
}
fn.call({name: 'afei'})
// undefined
````

## 2防抖
一定时间内只能执行一次事件，这段时间内多次触发时，清除定时器，重新开始
````js
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    let ctx = this;
    if (timer) clearTimeout(timer)
    timer = setTimeout(()=> {
      fn.applay(ctx, args)
    }, delay)
  }
}
````

## 3节流

````js
function trrole(fn, delay) {
  let timer = null;
  return function(...args) {
    let ctx = this;
    if (!timer) {
      timer = setTimeout(()=> {
        fn.applay(ctx, args);
        timer = null;
      }, delay)
    }
  }
}

function trrole2(fn, delay) {
  let last = 0;
  return function(...args) {
    let ctx = this;
    let now = Date.now();
    if (now - last < delay) return;
    last = now;
    fn.applay(ctx, args);
  }
}
````

## 4递归实现深拷贝

````js
function deepClone(val) {
  if (Array.isArray(val)) {
    return val.map(item=> deepClone(item))
  }

  if (typeof val === 'object') {
    return _deepAssign({}, val)
  }
  return val;
}

function _deepAssign(to, from) {
  Object.keys(from).forEach(key=> {
    assignObj(to, from, key)
  })
  return to
}

function assignObj(to, from, key) {
  let value = from[key];
  if (typeof value === 'undefined') return;
  if (Object.prototype.hasOwnProperty.call(to, key) ||
     typeof to[key] !== 'undefined') return;
  
  if (!Object.prototype.hasOwnProperty.call(to, key) &&
    typeof to[key] === 'undefined' &&
    typeof value !== 'object') {
    to[key] = value;
  } else if (!Object.prototype.hasOwnProperty.call(to, key) &&
    typeof to[key] === 'undefined' &&
    typeof value === 'object') {
    if (Array.isArray(value)) {
      to[key] = []
      to[key] = value.map((item, ind)=> {
        if (typeof item === 'object') {
          return _deepAssign(
            Array.isArray(item) ? (to[key][ind] = []) : Object(to[key][ind]),
            item
          );
        } else {
          return item;
        }
      })
    } else {
      _deepAssign(Object(to[key]), value)
    }
  }
}
````

## 5手写实现EventBus
````js
// 简易版
class EventBus {
  constructor() {
    this.eventObj = {}
  }
  on(eventName, cb) {
    if (this.eventObj[eventName]) {
      this.eventObj[eventName].push(cb)
    } else  {
      this.eventObj[eventName] = [cb]
    }
  }
  emit(eventName, ...args) {
    if (this.eventObj[eventName]) {
      this.eventObj[eventName].forEach(cb=> {
        cb(...args)
      })
    }
  }
  off(eventName) {
    if (this.eventObj[eventName]) {
      delete this.eventObj[eventName]
    }
  }
  once(eventName, cb) {
    this.off(eventName)
    this.eventObj[eventName] = [cb]
  }
}
````

## 6虚拟滚动

参考[前端进阶，高性能渲染十万条数据（虚拟列表）](https://juejin.cn/post/6844903982742110216)

## 7 vue中diff算法
参考[vue的diff算法](https://juejin.cn/post/6994959998283907102)
````js
// 源码
// isUndef 判断是否为undefined 
// oldCh 旧节点列表
// newCh 新节点列表
// sameVnode 判断是否是相同的节点，判断key值，标签，data等等东西 
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
        
      }
  // 从这里开始 进行新旧开始结束节点的两两判断
  else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 兜底逻辑 对当前的新节点进行一个特定查询
        // 获取oldStartIdx和oldEndIdx之间的所有key的map
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
				// 判断新开始节点的key存不存在 
        // 若是存在，则在oldKeyToIdx中找到这个节点
        // 若是不存在，则会在旧的节点中 查找这个节点，复用它
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
		// 进行列表的最后清理
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}
````


## 8 vue-router原理
参考[7张图，从零实现一个简易版Vue-Router，太通俗易懂了！](https://juejin.cn/post/7012272146907037732)

## 9 vuex原理

## 10 lodash.js中set实现方法

## 11 css实现垂直水平居中

````css
// 宽高固定
.parent {
  position: relative;
}
// position: absolute; margin: auto;
.child {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  margin: auto;
}
// position: absolute; 负margin;
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin-top: -100px;
  margin-left: -100px;
}
// position: absolute; calc
.child {
  position: absolute;
  width: 200px;
  height: 200px;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}

// 宽高未知
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
// 表格样式
.parent {
  display: table-cell;
  line-height: 500px;
  text-align: center;
  vertical-align: middle;
}
.child {
  display: inline-block;
  line-height: inital;
}
// flex布局
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
// 父flex, 子margin自动
.parent {
  display: flex;
}
.child {
  margin: auto;
}
````

# Promise 篇

## 12实现Promise

````js
// 三种状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"
function MyPromise(callback) {
    var _this = this
    _this.currentState = PENDING // Promise当前的状态
    _this.value = void 0 // Promise的值
    // 用于保存 then 的回调， 只有当 promise
    // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
    _this.onResolvedCallbacks = [] // Promise resolve时的回调函数集
    _this.onRejectedCallbacks = [] // Promise reject时的回调函数集
    _this.resolve = function (value) {
        if (value instanceof MyPromise) {
            // 如果 value 是个 Promise， 递归执行
            return value.then(_this.resolve, _this.reject)
        }
        setTimeout(() => { // 异步执行，保证顺序执行
            if (_this.currentState === PENDING) {
                _this.currentState = FULFILLED // 状态管理
                _this.value = value
                _this.onResolvedCallbacks.forEach(cb => cb())
            }
        })
    } // resolve 处理函数
    _this.reject = function (value) {
        setTimeout(() => { // 异步执行，保证顺序执行
            if (_this.currentState === PENDING) {
                _this.currentState = REJECTED // 状态管理
                _this.value = value
                _this.onRejectedCallbacks.forEach(cb => cb())
            }
        })
    } // reject 处理函数

    // 异常处理
    // new Promise(() => throw Error('error'))
    try {
        callback(_this.resolve, _this.reject) // 执行callback并传入相应的参数
    } catch(e) {
        _this.reject(e)
    }
}
// then 方法接受两个参数，onFulfilled，onRejected，分别为Promise成功或失败的回调
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    var _this = this
    // 规范 2.2.7，then 必须返回一个新的 promise
    var promise2
    // 根据规范 2.2.1 ，onFulfilled、onRejected 都是可选参数
    // onFulfilled、onRejected不是函数需要忽略，同时也实现了值穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : error => {throw error}

    if (_this.currentState === FULFILLED) {
        // 如果promise1（此处为self/this）的状态已经确定并且为fulfilled，我们调用onFulfilled
        // 如果考虑到有可能throw，所以我们将其包在try/catch块中
        return promise2 = new MyPromise(function(resolve, reject) {
            try {
                var x = onFulfilled(_this.value)
                // 如果 onFulfilled 的返回值是一个 Promise 对象，直接取它的结果作为 promise2 的结果
                resolutionProcedure(promise2, x, resolve, reject)
            } catch (err) {
                reject(err) // 如果出错，以捕获到的错误作为promise2的结果
            }
        })
    }
    // 此处实现与FULFILLED相似，区别在使用的是onRejected而不是onFulfilled
    if (_this.currentState === REJECTED) {
        return promise2 = new MyPromise(function(resolve, reject) {
            try {
                var x = onRejected(_this.value)
                resolutionProcedure(promise2, x, resolve, reject)
            } catch(err) {
                reject(err)
            }
        })
    }
    if (_this.currentState === PENDING) {
        // 如果当前的Promise还处于PENDING状态，我们并不能确定调用onFulfilled还是onRejected
        // 只有等待Promise的状态确定后，再做处理
        // 所以我们需要把我们的两种情况的处理逻辑做成callback放入promise1（此处即_this/this）的回调数组内
        // 处理逻辑和以上相似
        return promise2 = new MyPromise(function(resolve, reject) {
            _this.onResolvedCallbacks.push(function() {
                try {
                    var x = onFulfilled(_this.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch(err) {
                    reject(err)
                }
            })
            _this.onRejectedCallbacks.push(function() {
                try {
                    var x = onRejected(_this.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    // 规范 2.3
    /*
    resolutionProcedure函数即为根据x的值来决定promise2的状态的函数
    也即标准中的[Promise Resolution Procedure](https://promisesaplus.com/#point-47)
    x 为 promise2 = promise1.then(onFulfilled, onRejected)里onFulfilled/onRejected的返回值
    resolve 和 reject 实际上是 promise2 的executor的两个实参，因为很难挂在其他地方，所以一并传过来。
    相信各位一定可以对照标准转换成代码，这里就只标出代码在标准中对应的位置，只在必要的地方做一些解释。
    */
    function resolutionProcedure(promise2, x, resolve, reject) {
        // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
        if (promise2 === x) {
            return reject(new TypeError("Chaining cycle detected for promise!"))
        }
        // 规范 2.3.2
        // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
        if (x instanceof MyPromise) {
            // 2.3.2.1 如果x为pending状态，promise必须保持pending状态，直到x为fulfilled/rejected
            if (x.currentState === PENDING) {
                x.then(function(value) {
                    // 再次调用该函数是为了确认 x resolve 的
                    // 参数是什么类型，如果是基本类型就再次 resolve
                    // 把值传给下个 then
                    resolutionProcedure(promise2, value, resolve, reject)
                }, reject)
            } else { // 但如果这个promise的状态已经确定了，那么它肯定有一个正常的值，而不是一个thenable，所以这里可以取它的状态
                x.then(resolve, reject)
            }
            return
        }

        let called = false
        // 规范 2.3.3，判断 x 是否为对象或函数
        if (x !== null && (typeof x === "object" || typeof x === "function")) {
            // 规范 2.3.3.2，如果不能取出 then，就 reject
            try {
                // 规范2.3.3.1 因为x.then可能是一个getter，这种情况下多次读取就有可能产生副作用
                // 既要判断它的类型，又要调用它，这就是两次读取
                let then = x.then
                // 规范2.3.3.3，如果 then 是函数，调用 x.then
                if (typeof then === "function") {
                    // 规范 2.3.3.3
                    // reject 或 reject 其中一个执行过的话，忽略其他的
                    then.call(
                        x,
                        y => { // 规范 2.3.3.3.1
                            if (called) return // 规范 2.3.3.3.3，即这三处谁先执行就以谁的结果为准
                            called = true
                            // 规范 2.3.3.3.1
                            return resolutionProcedure(promise2, y, resolve, reject)
                        },
                        r => {
                            if (called) return // 规范 2.3.3.3.3，即这三处谁先执行就以谁的结果为准
                            called = true
                            return reject(r)
                        }
                    )
                } else {
                    // 规范 2.3.3.4
                    resolve(x)
                }
            } catch (e) { // 规范 2.3.3.2
                if (called) return // 规范 2.3.3.3.3，即这三处谁先执行就以谁的结果为准
                called = true
                return reject(e)
            }
        } else {
            // 规范 2.3.4，x 为基本类型
            resolve(x)
        }
    }
}
// catch 的实现
MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}
// finally 的实现
MyPromise.prototype.finally = function (callback) {
  return this.then(function (value) {
    return MyPromise.resolve(callback()).then(function () {
      return value
    })
  }, function (err) {
    return MyPromise.resolve(callback()).then(function () {
      throw err
    })
  })
}
````

## 13 实现Promise.all

````js
function promiseAll(promises) {
  return new Promise((resolve, reject)=> {
    if (!Array.isArray(promises)) {
      throw new TypeError("promises must be an array")
    }
    let result = [];
    let count = 0;
    promises.forEach((promise, ind)=> {
      promise.then(res=> {
        result[ind] = res;
        count++;
        count === promises.length && resolve(result);
      }, err=> {
        reject(err)
      })
    })
  })
}
````

## 14 实现 promise.finally

````js
Promise.prototype.finally = function(cb) {
  return this.then(function(res) {
    return Promise.resolve(cb()).then(()=> {
      return res;
    })
  }, function(err) {
    return Promise.resolve(cb()).then(()=> {
      throw err;
    })
  })
}
````

## 15 实现promise.allSettled

````js
function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([]);
  let _promises = promises.map(
    item=> item instanceof Promise ? item : Promise.resolve(item);
  );
  return new Promise(resolve=> {
    let result = [];
    let count = 0;
    _promises.forEach((item, ind)=> {
      item.then(res=> {
        result[ind] = {
          status: 'fulfilled',
          value: res
        };
        count++
        count === _promises.length && resolve(result)
      }, (err)=> {
        result[ind] = {
          status: 'reject',
          value: err
        };
        count++
        count === _promise.length && resolve(result)
      })
    })
  })
}
````

## 16 实现promise.race

````js
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject)=> {
    promiseArr.forEach(item=> {
      Promise.resolve(item).then(res=> {
        resolve(res)
      }, (err)=> {
        reject(err)
      })
    })
  })
}
````

## 17 实现 promise.any

````js
Promise.any = function(promiseArr) {
  return new Promise((resolve, reject)=> {
    if (promiseArr.length === 0) return;
    let count = 0;
    promiseArr.forEach((item, ind)=> {
      Promise.resolve(item).then(res=> {
        resolve(res);
      }, (err)=> {
        count++
        if (count === promiseArr.length) {
          reject(new AggregateError('All promises were rejected'))
        }
      })
    })
  })
}
````

## 18 实现Promise.resolve

````js
Promise.resolve = function(value) {
  return new Promise((resolve, reject)=> resolve(value));
}
````

## 19 实现Promise.reject

````js
Promise.reject = function(value) {
  return new Promise((resolve, reject)=> reject(value))
}
````

# 数组篇

## 20 数组去重

### 使用双重 for 和 splice

````js
function unique(arr) {
  for (var i=0; i<arr.length; i++) {
    for(var j=i+1; j<arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr
}
````

### 使用 indexOf 或 includes 加新数组

````js
function unique(arr) {
  let newArr = []
  for (var i=0; i<arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i])
    }
  }
  return newArr;
}

function unique(arr) {
  let newArr = []
  for(var i=0; i<arr.length; i++) {
    if (!newArr.includes(arr[i])) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
````

### sort 排序后，使用快慢指针的思想

````js
function unique(arr) {
  arr.sort((a, b)=> a-b)
  var slow = 1,
      fast = 1;
  while (fast < arr.length) {
    if (arr[fast] !== arr[fast - 1]) {
      arr[slow++] = arr[falst];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
````

### Es6的set

````js
function unique(arr) {
  let setArr = new Set(arr);
  return [...setArr];
}
````

### Es6的map

````js
function unique(arr) {
  let map = new Map();
  let result = new Array();
  for (let i=0; i<arr.length; i++) {
    if (map.has(arr[i])) {
      map.set(arr[i], true);
    } else {
      map.set(arr[i], false);
      result.push(arr[i]);
    }
  }
  return result;
}
````

### 使用filter和indexOf

````js
function unique(arr) {
  return arr.filter((item, index, arr)=> {
    return arr.indexOf(item) === index;
  })
}
````

### reduce 配合 includes

````js
function unique(arr) {
  return arr.reduce((arc, cur)=> {
    if (!arc.includes(cur)) {
      arc.push(cur);
    }
    return arc;
  }, []);
}
````

## 实现forEach

````js
Array.prototype.myForEach = function(fn) {
  if (this === null || this === undefined) {
    throw new TypeError(`Cannot read property 'myForEach' of null`);
  }
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    throw new TypeError(`${fn} s not a function`)
  }
  var _arr = this, thisArg = arguments[1] || window
  for (var i = 0; i<_arr.length; i++) {
    fn.call(thisArg, _arr[i], i, _arr);
  }
}
````

## 实现reduce

````js
Array.prototype.myReduce = function(fn) {
  let _arr = this, initVal = arguments[1]
  let i = 0;
  if (initVal === undefined) {
    if (_arr.length === 0) {
      throw new Error('initVal and Array.length>0 need one')
    }
    initVal = _arr[i];
    i++;
  }
  for(; i<_arr.length; i++) {
    initVal = fn(initVal, _arr[i], i, _arr);
  }
  return initVal;
}
````

## 实现map

````js
Array.prototype.myMap = function(fn) {
  let _arr = this, thisArg = arguments[1] || window, result = [];
  for(let i=0; i<_arr.length; i++) {
    result.push(fn.call(thisArg, _arr[i], i, _arr));
  }
  return result;
}
````

## 实现filter

````js
Array.prototype.myFilter = function(fn) {
  let _arr = this, thisArg = arguments[1] || window, result = [];
  for(let i=0; i<_arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      result.push(_arr[i]);
    }
  }
  return result;
}
````

## 实现every

````js
Array.prototype.myEvery = function(fn) {
  var _arr = this, thisArg = arguments[1] || window;
  var flag = true;
  for(var i=0; i<_arr.length; i++) {
    if (!fn.call(thisArg, _arr[i], i, _arr)) {
      return false;
    }
  }
  return flag;
}
````

## 实现some

````js
Array.prototype.mySome = function(fn) {
  var _arr = this, thisArg = arguments[1] ?? window;
  var flag = false;
  for(var i=0; i<_arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      return true;
    }
  }
  return flag;
}
````

## 实现 find/findIndex

````js
Array.prototype.myFind = function(fn) {
  var _arr = this, thisArg = arguments[1] ?? window;
  for(var i=0; i<_arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      return _arr[i];
    }
  }
  return undefined;
}

Array.prototype.myFindIndex = function(fn) {
  var _arr = this, thisArg = arguments[1] ?? window;
  for(var i=0; i<_arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      return i;
    }
  }
  return -1;
}
````

## 实现indexOf

````js
Array.prototype.myIndexOf = function(findVal, begin = 0) {
  var _arr = this;
  if (!_arr.length || begin > _arr.length) {
    return -1;
  }

  if (!findVal) {
    return 0;
  }

  for(var i=0; i<_arr.length; i++) {
    if (_arr[i] === findVal) {
      return i;
    }
  }
  return -1;
}
````

# 函数篇

## 实现new

````js
function createObj(Con) {
  var obj = Object.create(null);
  Object.setPrototypeOf(obj, Con.prototype)

  var ret = Con.applay(obj, [].slice.call(arguments, 1));
  return typeof ret === 'object' ? ret : obj;
}
````

## 实现call

````js
/**
 * 
 * @param {*} ctx 函数执行上下文this
 * @param  {...any} args 参数列表
 * @returns 函数执行的结果
 */
Function.prototype.myCall = function(ctx, ...args) {
  // 简单处理未传ctx上下文，或者传的是null和undefined等场景
  if (!ctx) {
    ctx = typeof window !== 'undefined' ? window : global;
  }
  // 暴力处理 ctx有可能传非对象
  ctx = Object(ctx);
  // 用Symbol生成唯一的key
  const fnName = Symbol();
  // 这里的this，即要调用的函数
  ctx[fnName] = this;
  // 将args展开，并且调用fnName函数，此时fnName函数内部的this也就是ctx了
  const result = ctx[fnName](...args);
  // 用完之后，将fnName从上下文ctx中删除
  delete ctx[fnName];
  return result;
}
````

## 实现apply

````js
/**
 * 
 * @param {*} ctx 函数执行上下文this
 * @param  {args} args 参数列表
 * @returns 函数执行的结果
 */
Function.prototype.myApply = function(ctx, args) {
  if (!ctx) {
    ctx = typeof window !== 'undefined' ? window : global;
  }
  ctx = Object(ctx);
  const fnName = Symbol();
  ctx[fnName] = this;
  // 将args展开，并且调用fnName函数，此时fnName函数内部的this也就是ctx了
  const result = ctx[fnName](...args);
  // 用完之后，将fnName从上下文ctx中删除
  delete ctx[fnName];
  return result;
}
````

## 实现bind

````js
/**
* @param {*} ctx 函数执行上下文this
* @returns 函数
*/
Function.prototype.myBind = function(ctx) {
  if (!ctx) {
    ctx = typeof window !== 'undefined' ? window : global;
  }
  ctx = Object(ctx);
  const self = this;
  const args = [].slice.call(arguments, 1);
  function fn() {
    fnArgs = [].slice.call(arguments);
    return self.apply(ctx, args.concat(fnArgs));
  }
  return fn;
}
````

## setTimeout模拟setInterval

````js
const mySetInterval = function(func, time) {
  let timer = null;
  const interval = ()=> {
    timer = setTimeout(()=> {
      func();
      interval();
    }, time)
  }

  interval();
  return ()=> clearTimeout(timer);
}
````

## setInterval模拟setTimeout

````js
const mySetTimeout = function(func, time) {
  let timer = null;
  timer = setInterval(()=> {
    clearInterval(timer);
    func();
  }, time);

  return ()=> clearInterval(timer);
}
````

## 手机号3-3-4分割

````js

// 适合纯11位手机
const splitMobile = (mobile, format = '-') => {
  return String(mobile).replace(/(?=(\d{4})+$)/g, format)
}
// 适合11位以内的分割
const splitMobile2 = (mobile, format = '-') => {
  return String(mobile).replace(/(?<=(\d{3}))/, format).replace(/(?<=([\d\-]{8}))/, format)
}

console.log(splitMobile(18379802267)) // 183-7980-2267
console.log(splitMobile2(18379876545)) // 183-7987-6545

````

## 解析 url 参数

> 根据name获取url上的search参数值

````js
const getQueryByName = (name) => {
  const queryNameRegex = new RegExp(`[?&]${name}=([^&]*)(&|$)`)
  const queryNameMatch = window.location.search.match(queryNameRegex)
  // 一般都会通过decodeURIComponent解码处理
  return queryNameMatch ? decodeURIComponent(queryNameMatch[1]) : ''
}

// https://www.baidu.com/?name=%E5%89%8D%E7%AB%AF%E8%83%96%E5%A4%B4%E9%B1%BC&sex=boy

console.log(getQueryByName('name'), getQueryByName('sex')) // 前端胖头鱼 boy
````

## 实现获取js数据类型的通用函数

````js
const getType = (s) => {
  const r = Object.prototype.toString.call(s)

  return r.replace(/\[object (.*?)\]/, '$1').toLowerCase()
}

// 测试
console.log(getType()) // undefined
console.log(getType(null)) // null
console.log(getType(1)) // number
console.log(getType('前端胖头鱼')) // string
console.log(getType(true)) // boolean
console.log(getType(Symbol('前端胖头鱼'))) // symbol
console.log(getType({})) // object
console.log(getType([])) // array
````
