# 面试汇总

## 1下面代码输出什么？

```js
let a = {name: '1'};
let b = a;
a.x = a = {name: '2'}
console.log(a.x) // undefined
console.log(b.x) // {name: '2'}
```

```js
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
```

```js
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

```

```js
const fn = ()=> {
  console.log(this.name)
}
fn.call({name: 'afei'})
// undefined
```

## 2防抖
一定时间内只能执行一次事件，这段时间内多次触发时，清除定时器，重新开始
```js
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
```

## 3节流

```js
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
  let last = Date.now();
  return function(...args) {
    let ctx = this;
    let now = Date.now();
    if (now - last < delay) return;
    last = now;
    fn.applay(ctx, args);
  }
}
```

## 4递归实现深拷贝

```js
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

// 简易版
let obj = {
  name: 'afei',
  age: 18,
  likes: ['电影', '美食', '音乐']
}

function deepClones(newObj = {}, oldObj = {}) {
	for (let key in oldObj) {
    let val = oldObj[key]
	  if (val instanceof Array) {
		  newObj[key] = []
		  deepClones(newObj[key], val)
	  } else if (val instanceof Object) {
		  newObj[key] = {}
		  deepClones(newObj[key], val)
	  } else {
		  newObj[key] = val
	  }
	}
	return newObj;
}

let copObj = deepClone({}, obj)
copObj.age = 19;
console.log(copObj);
console.log(obj);
```

## 5手写实现EventBus
```js
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
    // this.eventObj[eventName] = [cb]
    cb();
  }
}
```

## 6虚拟滚动

参考[前端进阶，高性能渲染十万条数据（虚拟列表）](https://juejin.cn/post/6844903982742110216)

## 7 vue中diff算法
参考[vue的diff算法](https://juejin.cn/post/6994959998283907102)
```js
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
```


## 8 vue-router原理
参考[7张图，从零实现一个简易版Vue-Router，太通俗易懂了！](https://juejin.cn/post/7012272146907037732)

## 9 vuex原理

## 10 lodash.js中set实现方法

## 11 css实现垂直水平居中

```css
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
```

# Promise 篇

## 12实现Promise

```js
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
```

## 13 实现Promise.all

```js
function promiseAll(promises) {
  return new Promise((resolve, reject)=> {
    if (!Array.isArray(promises)) {
      throw new TypeError("promises must be an array")
    }
    const _promises = promises.map(
      item => item instanceof Promise ? item : Promise.resolve(item);
    );
    let result = [];
    let count = 0;
    _promises.forEach((promise, ind)=> {
      promise.then(res=> {
        result[ind] = res;
        count++;
        count === _promises.length && resolve(result);
      }, err=> {
        reject(err)
      })
    })
  })
}
```

## 14 实现 promise.finally

```js
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
```

## 15 实现promise.allSettled

```js
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
```

## 16 实现promise.race

```js
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
```

## 17 实现 promise.any

```js
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
```

## 18 实现Promise.resolve

```js
Promise.resolve = function(value) {
  return new Promise((resolve, reject)=> resolve(value));
}
```

## 19 实现Promise.reject

```js
Promise.reject = function(value) {
  return new Promise((resolve, reject)=> reject(value))
}
```

# 数组篇

## 20 数组去重

### 使用双重 for 和 splice

```js
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
```

### 使用 indexOf 或 includes 加新数组

```js
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
```

### sort 排序后，使用快慢指针的思想

```js
function unique(arr) {
  arr.sort((a, b)=> a-b)
  var slow = 1,
      fast = 1;
  while (fast < arr.length) {
    if (arr[fast] !== arr[fast - 1]) {
      arr[slow++] = arr[fast];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
```

### Es6的set

```js
function unique(arr) {
  let setArr = new Set(arr);
  return [...setArr];
}
```

### Es6的map

```js
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
```

### 使用filter和indexOf

```js
function unique(arr) {
  return arr.filter((item, index, arr)=> {
    return arr.indexOf(item) === index;
  })
}
```

### reduce 配合 includes

```js
function unique(arr) {
  return arr.reduce((arc, cur)=> {
    if (!arc.includes(cur)) {
      arc.push(cur);
    }
    return arc;
  }, []);
}
```

## 实现forEach

```js
Array.prototype.myForEach = function(fn) {
  if (this === null || this === undefined) {
    throw new TypeError(`Cannot read property 'myForEach' of null`);
  }
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    throw new TypeError(`${fn} is not a function`)
  }
  var _arr = this, thisArg = arguments[1] || window
  for (var i = 0; i<_arr.length; i++) {
    fn.call(thisArg, _arr[i], i, _arr);
  }
}
```

## 实现reduce

```js
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
```

## 实现map

```js
Array.prototype.myMap = function(fn) {
  let _arr = this, thisArg = arguments[1] || window, result = [];
  for(let i=0; i<_arr.length; i++) {
    result.push(fn.call(thisArg, _arr[i], i, _arr));
  }
  return result;
}
```

## 实现filter

```js
Array.prototype.myFilter = function(fn) {
  let _arr = this, thisArg = arguments[1] || window, result = [];
  for(let i=0; i<_arr.length; i++) {
    if (fn.call(thisArg, _arr[i], i, _arr)) {
      result.push(_arr[i]);
    }
  }
  return result;
}
```

## 实现every

```js
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
```

## 实现some

```js
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
```

## 实现 find/findIndex

```js
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
```

## 实现indexOf

```js
Array.prototype.myIndexOf = function(findVal, begin = 0) {
  var _arr = this;
  if (!_arr.length || Math.abs(begin) > _arr.length) {
    return -1;
  }

  if (!findVal) {
    return 0;
  }
  var i = begin >= 0 ? begin : _arr.length + begin;
  for(; i<_arr.length; i++) {
    if (_arr[i] === findVal) {
      return i;
    }
  }
  return -1;
}
```

# 函数篇

## 实现new

```js
function createObj(Con) {
  var obj = Object.create(null);
  Object.setPrototypeOf(obj, Con.prototype)

  var ret = Con.apply(obj, [].slice.call(arguments, 1));
  return typeof ret === 'object' ? ret : obj;
}
```

## 实现call

```js
/**
 * 
 * @param {*} ctx 函数执行上下文this
 * @param  {...args} args 参数列表
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
```

## 实现apply

```js
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
```

## 实现bind

```js
/**
* @param {*} ctx 函数执行上下文this
* @returns 函数
*/
Function.prototype.myBind = function(ctx) {
  if (!ctx) {
    ctx = typeof window !== 'undefined' ? window : global;
  }
  ctx = Object(ctx);
  const fnName = Symbol();
  // const self = this;
  ctx[fnName] = this;
  const args = [].slice.call(arguments, 1);
  function fn() {
    const fnArgs = [].slice.call(arguments);
    const result = ctx[fnName](...args.concat(fnArgs))
    delete ctx[fnName]
    return result;
    // return self.apply(ctx, args.concat(fnArgs));
  }
  return fn;
}
```

## 继承

```js
// es6 继承
class Anima {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Dogs extends Anima {
  constructor(name, weight) {
    super(name)
    this.weight = weight;
  }
}

// ES5继承
// （1）构造函数继承： 使用父类的构造函数来增强子类实例
// 特点：可以实现多继承;
// 缺点：只能继承父类的实例属性和方法，不能继承原型的属性和方法
// 例子:
function A(name) {
  this.name = name;
}
A.prototype.getName = function (){
  return this.name;
}

function B(name, age) {
  A.call(this, name);
  this.age = age;
}
const b = new B('阿飞', 18)
console.log(b.getName()); // TypeError: b.getName is not a function

// (2) 原型链继承
// 特点：基于原型链，既是父类的实例，也是子类的实例
// 缺点： 无法实现多继承

// 例子：
// 采用Object.create
B.prototype = Object.create(A.prototype);
// 或者
// B.prototype = new A()
B.prototype.constructor = B;
B.prototype.getAge = function (){
  return this.age;
}
const a = new A('玄武')
const b = new B('阿飞', 18)
console.log(a.getName())
console.log(b.getName())
console.log(b.getAge())
console.log(a.getAge())

// (3)原型链寄生继承
// 例子
function Fn() {}
Fn.prototype = A.prototype;

B.prototype = new Fn();
B.prototype.getAge = function () {
  return this.age;
}
const a = new A('玄武')
const b = new B('阿飞', 18)
console.log(a.getName())
console.log(b.getName())
console.log(b.getAge())
console.log(a.getAge())

// (4)组合继承: 1和2的组合
// 特点：既可以继承父类属性和方法，也可以继承父类原型的属性和方法
// 缺点： 父类构造函数调用了两次

// 例子：
function B(name, age) {
  A.call(this, name);
  this.age = age;
}
// 采用Object.create
B.prototype = Object.create(A.prototype);
// 或者
// B.prototype = new A()
B.prototype.constructor = B;
B.prototype.getAge = function (){
  return this.age;
}
const a = new A('玄武')
const b = new B('阿飞', 18)
console.log(a.getName())
console.log(b.getName())
console.log(b.getAge())
console.log(a.getAge())

// (5)寄生组合继承：1和3的组合
// 特点：既可以继承父类属性和方法，也可以继承父类原型的属性和方法，父类构造函数只调用一次

// 例子：
function B(name, age) {
  A.call(this, name);
  this.age = age;
}

function Fn() {}
Fn.prototype = A.prototype;

B.prototype = new Fn();
B.prototype.getAge = function () {
  return this.age;
}
const a = new A('玄武')
const b = new B('阿飞', 18)
console.log(a.getName())
console.log(b.getName())
console.log(b.getAge())
console.log(a.getAge())
```


## setTimeout模拟setInterval

```js
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
```

## setInterval模拟setTimeout

```js
const mySetTimeout = function(func, time) {
  let timer = null;
  timer = setInterval(()=> {
    clearInterval(timer);
    func();
  }, time);

  return ()=> clearInterval(timer);
}
```

## 手机号3-4-4分割

```js
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
```

## 解析 url 参数

> 根据name获取url上的search参数值

```js
const getQueryByName = (name) => {
  const queryNameRegex = new RegExp(`[?&]${name}=([^&]*)(&|$)`)
  const queryNameMatch = window.location.search.match(queryNameRegex)
  // 一般都会通过decodeURIComponent解码处理
  return queryNameMatch ? decodeURIComponent(queryNameMatch[1]) : ''
}

// https://www.baidu.com/?name=%E5%89%8D%E7%AB%AF%E8%83%96%E5%A4%B4%E9%B1%BC&sex=boy

console.log(getQueryByName('name'), getQueryByName('sex')) // 前端胖头鱼 boy
```

## 实现获取js数据类型的通用函数

```js
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
```

## 如何实现Vuex数据持久化

* 法一：全局监听，页面刷新的时候将 store 里 state 的值存到 sessionStorage 中，然后从sessionStorage 中获取，再赋值给 store ，并移除 sessionStorage 中的数据

* 方法二：安装 vuex-persistedstate 插件

## Vuex中为什么不建议直接修改state，而是一定要采用mutation去commit提交修改state?

直接修改state，调试工具不能记录状态的变化，容易造成数据的混乱和不可预知的后果；
使用commit提交修改state，调试工具能够很好的记录状态的变化，保存快照，方便开发调试。

## webpack中配置跨域代理的原理？

使用了webpack-dev-server和http-proxy-middleware插件来实现配置代理跨域

## webpack中loader和plugin的区别？

loader 用于对模块的"源代码"进行转换，在 import 或"加载"模块时预处理文件
Loader是一个转换器，它可以将某种格式的文件转换成Webpack支持打包的模块。
在Webpack中，一切皆模块，我们常见的Javascript、CSS、Less、Typescript、Jsx、图片等文件都是模块，不同模块的加载是通过模块加载器来统一管理的，当我们需要使用不同的 Loader 来解析不同类型的文件时，我们可以在module.rules字段下配置相关规则。

plugin赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 webpack 的不同阶段（钩子 / 生命周期），贯穿了webpack整个编译周期，目的在于解决loader 无法实现的其他事

## Vuex原理
Vuex的原理通俗讲就是：利用了全局混入Mixin，将你所创建的store对象，混入到每一个Vue实例中

简单代码实现
``` js
// vuex.js
let Vue;

// install方法设置，是因为Vue.use(xxx)会执行xxx的install方法
const install = (v) => { // 参数v负责接收vue实例
    Vue = v;
    // 全局混入
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.store) {
                // 根页面，直接将身上的store赋值给自己的$store，
                // 这也解释了为什么使用vuex要先把store放到入口文件main.js里的根Vue实例里
                this.$store = this.$options.store;
            } else {
                // 除了根页面以外，将上级的$store赋值给自己的$store
                this.$store = this.$options.parent && this.$options.parent.$store;
            }
        },
    })
}

// 创建类Store
class Store {
    constructor(options) { // options接收传入的store对象
        this.vm = new Vue({
            // 确保state是响应式
            data: {
                state: options.state
            }
        });
        // getter
        let getters = options.getters || {};
        this.getters = {};
        console.log(Object.keys(this.getters))
        Object.keys(getters).forEach(getterName => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return getters[getterName](this.state);
                }
            })
        })
        // mutation
        let mutations = options.mutations || {};
        this.mutations = {};
        Object.keys(mutations).forEach(mutationName => {
            this.mutations[mutationName] = payload => {
                mutations[mutationName](this.state, payload);
            }
        })
        // action
        let actions = options.actions || {};
        this.actions = {};
        Object.keys(actions).forEach(actionName => {
            this.actions[actionName] = payload => {
                actions[actionName](this, payload);
            }
        })
    }
    // 获取state时，直接返回
    get state() {
        return this.vm.state;
    }
    // commit方法，执行mutations的'name'方法
    commit(name, payload) {
        this.mutations[name](payload);
    }
    // dispatch方法，执行actions的'name'方法
    dispatch(name, payload) {
        this.actions[name](payload);
    }
}

// 把install方法和类Store暴露出去
export default {
    install,
    Store
}

```

## Vite与Webpack的区别？

Vite: 是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

* 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。

* 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

rollup 是一种打包工具，特点就是，打的包非常精简，体积小。 官网是英文的，中文资料也比较少，不过好在常规用法可以参考 vite的官网。

Webpack:

* webpack core 是一个纯打包工具（对标 Rollup），而 Vite 其实是一个更上层的工具链方案，对标的是 （webpack + 针对 web 的常用配置 + webpack-dev-server）。

* webpack core 因为只针对打包不预设场景，所以设计得极其灵活，不局限于针对 web 打包，几乎所有可配置的环节都做成了可配置的。这种极度的灵活性对于一些特定场景依然不可替代。配置项极度复杂，插件机制和内部逻辑晦涩难懂，针对常见的 web 也需要大量的配置。

## Vue动态插入组件方法

使用插槽slot和内置组件component

## Vue的template中为什么可以省略this

原因是源码中render使用了with(this)

```js
/**
 * 从 AST 生成渲染函数
 * @returns {
 *   render: `with(this){return _c(tag, data, children)}`,
 *   staticRenderFns: state.staticRenderFns
 * } 
 */
```

* with语句的作用是将代码的作用域设置在一个特定的对象中，with语句如下：

> with (expression) { statement }

如下面的例子：

```js
var  qs =  location.search.substring(1);
var  hostName = location.hostName;
var  url = location.href;

// 使用with语句后
with(location) {
  var  qs =  search.substring(1);
　var  hostName = hostName;
  var  url = href;
}
```

## 参考[Vue源码解析](https://juejin.cn/column/6960553066101735461)

## Vue 的初始化过程（new Vue(options)）都做了什么？

1. 处理组件配置项mergeOptions

  * 初始化根组件时进行了选项合并操作，将全局配置合并到根组件的局部配置上

  * 初始化每个子组件时做了一些性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率

2. initLifecycle初始化组件实例的关系属性，比如 $parent、$children、$root、$refs 等

3. initEvents处理自定义事件, initRender解析组件的插槽信息，得到 vm.$slot，处理渲染函数，得到 vm.$createElement 方法，即 h 函数

4. 调用 beforeCreate 钩子函数

5. initInjections初始化组件的 inject 配置项，得到 ret[key] = val 形式的配置对象，然后对该配置对象进行浅层的响应式处理（只处理了对象第一层数据），并代理每个 key 到 vm 实例上

6. initState数据响应式，处理 props、methods、data、computed、watch 等选项

7. initProvide解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上

8. 调用 created 钩子函数

9. 如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount 方法，反之，没提供 el 选项则必须调用 $mount

10. 接下来则进入挂载阶段

## Vue 响应式原理是怎么实现的？

* 响应式的核心是通过 Object.defineProperty 拦截对数据的访问和设置

* 响应式的数据分为两类：
  1. 对象，循环遍历对象的所有属性，为每个属性设置 getter、setter，以达到拦截访问和设置的目的，如果属性值依旧为对象，则递归为属性值上的每个 key 设置 getter、setter

    * 访问数据时（obj.key)进行依赖收集，在 dep 中存储相关的 watcher
    * 设置数据时由 dep 通知相关的 watcher 去更新
  
  2. 数组，增强数组的(push, pop, shift, unshift, splice, sort, reserve)7 个可以更改自身的原型方法，然后拦截对这些方法的操作

    * 添加新数据时进行响应式处理，然后由 dep 通知 watcher 去更新
    * 删除数据时，也要由 dep 通知 watcher 去更新

## methods、computed 和 watch 有什么区别？

* methods 一般用于封装一些较为复杂的处理逻辑（同步、异步）

* computed 一般用于封装一些简单的同步逻辑，将经过处理的数据返回，然后显示在模版中，以减轻模版的重量

* watch 一般用于当需要在数据变化时执行异步或开销较大的操作

> computed 和 watch 的本质是一样的，内部都是通过 Watcher 来实现的，其实没什么区别，非要说区别的化就两点：1、使用场景上的区别，2、computed 默认是懒执行的，切不可更改。

## Vue 的异步更新机制是如何实现的？

Vue 的异步更新机制的核心是利用了浏览器的异步任务队列来实现的，首选微任务队列，宏任务队列次之。

当响应式数据更新后，会调用 dep.notify 方法，通知 dep 中收集的 watcher 去执行 update 方法，watcher.update 将 watcher 自己放入一个 watcher 队列（全局的 queue 数组）。

然后通过 nextTick 方法将一个刷新 watcher 队列的方法（flushSchedulerQueue）放入一个全局的 callbacks 数组中。

如果此时浏览器的异步任务队列中没有一个叫 flushCallbacks 的函数，则执行 timerFunc 函数，将 flushCallbacks 函数放入异步任务队列。如果异步任务队列中已经存在 flushCallbacks 函数，等待其执行完成以后再放入下一个 flushCallbacks 函数。

flushCallbacks 函数负责执行 callbacks 数组中的所有 flushSchedulerQueue 函数。

flushSchedulerQueue 函数负责刷新 watcher 队列，即执行 queue 数组中每一个 watcher 的 run 方法，从而进入更新阶段，比如执行组件更新函数或者执行用户 watch 的回调函数。

## Vue 的 nextTick API 是如何实现的？

  Vue.nextTick 或者 vm.$nextTick 的原理其实很简单，就做了两件事：

 * 将传递的回调函数用 try catch 包裹然后放入 callbacks 数组

 * 执行 timerFunc 函数，在浏览器的异步任务队列放入一个刷新 callbacks 数组的函数


 ## Vue.use(plugin) 做了什么？

 负责安装 plugin 插件，其实就是执行插件提供的 install 方法。

   * 首先判断该插件是否已经安装过

   * 如果没有，则执行插件提供的 install 方法安装插件，具体做什么有插件自己决定

## Vue.mixin(options) 做了什么？

负责在 Vue 的全局配置上合并 options 配置。然后在每个组件生成 vnode 时会将全局配置合并到组件自身的配置上来。

 * 标准化 options 对象上的 props、inject、directive 选项的格式

 * 处理 options 上的 extends 和 mixins，分别将他们合并到全局配置上

 * 然后将 options 配置和全局配置进行合并，选项冲突时 options 配置会覆盖全局配置

 ## Vue.component(compName, Comp) 做了什么？

 负责注册全局组件。其实就是将组件配置注册到全局配置的 components 选项上（options.components），然后各个子组件在生成 vnode 时会将全局的 components 选项合并到局部的 components 配置项上。

 * 如果第二个参数为空，则表示获取 compName 的组件构造函数

 * 如果 Comp 是组件配置对象，则使用 Vue.extend 方法得到组件构造函数，否则直接进行下一步

 * 在全局配置上设置组件信息，this.options.components.compName = CompConstructor

 ## Vue.directive('my-directive', {xx}) 做了什么？

 在全局注册 my-directive 指令，然后每个子组件在生成 vnode 时会将全局的 directives 选项合并到局部的 directives 选项中。原理同 Vue.component 方法：

 * 如果第二个参数为空，则获取指定指令的配置对象

 * 如果不为空，如果第二个参数是一个函数的话，则生成配置对象 { bind: 第二个参数, update: 第二个参数 }

 * 然后将指令配置对象设置到全局配置上，this.options.directives['my-directive'] = {xx}

 ## Vue.filter('my-filter', function(val) {xx}) 做了什么？

负责在全局注册过滤器 my-filter，然后每个子组件在生成 vnode 时会将全局的 filters 选项合并到局部的 filters 选项中。原理是：

 * 如果没有提供第二个参数，则获取 my-filter 过滤器的回调函数

 * 如果提供了第二个参数，则是设置 this.options.filters['my-filter'] = function(val) {xx}。

## Vue.extend(options) 做了什么？

Vue.extend 基于 Vue 创建一个子类，参数 options 会作为该子类的默认全局配置，就像 Vue 的默认全局配置一样。所以通过 Vue.extend 扩展一个子类，一大用处就是内置一些公共配置，供子类的子类使用。

 * 定义子类构造函数，这里和 Vue 一样，也是调用 _init(options)

 * 合并 Vue 的配置和 options，如果选项冲突，则 options 的选项会覆盖 Vue 的配置项

 * 给子类定义全局 API，值为 Vue 的全局 API，比如 Sub.extend = Super.extend，这样子类同样可以扩展出其它子类

 * 返回子类 Sub

 ## Vue.set(target, key, val) 做了什么?

由于 Vue 无法探测普通的新增 property (比如 this.myObject.newProperty = 'hi')，所以通过 Vue.set 为向响应式对象中添加一个 property，可以确保这个新 property 同样是响应式的，且触发视图更新。

 * 更新数组指定下标的元素：Vue.set(array, idx, val)，内部通过 splice 方法实现响应式更新

 * 更新对象已有属性：Vue.set(obj, key ,val)，直接更新即可 => obj[key] = val

 * 不能向 Vue 实例或者 $data 动态添加根级别的响应式数据

 * Vue.set(obj, key, val)，如果 obj 不是响应式对象，会执行 obj[key] = val，但是不会做响应式处理

 * Vue.set(obj, key, val)，为响应式对象 obj 增加一个新的 key，则通过 defineReactive 方法设置响应式，并触发依赖更新

 ## Vue.delete(target, key) 做了什么？

删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制，但是你应该很少会使用它。当然同样不能删除根级别的响应式属性。

 * Vue.delete(array, idx)，删除指定下标的元素，内部是通过 splice 方法实现的

 * 删除响应式对象上的某个属性：Vue.delete(obj, key)，内部是执行 delete obj.key，然后执行依赖更新即可

 ## Vue.nextTick(cb) 做了什么？

 Vue.nextTick(cb) 方法的作用是延迟回调函数 cb 的执行，一般用于 `this.key = newVal` 更改数据后，想立即获取更改过后的 DOM 数据：

 ```js
this.key = 'new val'

Vue.nextTick(function() {
  // DOM 更新了
})
 ```

其内部的执行过程是：

 * this.key = 'new val，触发依赖通知更新，将负责更新的 watcher 放入 watcher 队列

 * 将刷新 watcher 队列的函数放到 callbacks 数组中

 * 在浏览器的异步任务队列中放入一个刷新 callbacks 数组的函数

 * Vue.nextTick(cb) 来插队，将 cb 函数放入 callbacks 数组

 * 待将来的某个时刻执行刷新 callbacks 数组的函数

 * 然后执行 callbacks 数组中的众多函数，触发 watcher.run 的执行，更新 DOM

 * 由于 cb 函数是在后面放到 callbacks 数组，所以这就保证了先完成的 DOM 更新，再执行 cb 函数

 ## vm.$watch(expOrFn, callback, [options]) 做了什么？

vm.$watch 负责观察 Vue 实例上的一个表达式或者一个函数计算结果的变化。当其发生变化时，回调函数就会被执行，并为回调函数传递两个参数，第一个为更新后的新值，第二个为老值。

这里需要 注意 一点的是：如果观察的是一个对象，比如：数组，当你用数组方法，比如 push 为数组新增一个元素时，回调函数被触发时传递的新值和老值相同，因为它们指向同一个引用，所以在观察一个对象并且在回调函数中有新老值是否相等的判断时需要注意。

vm.$watch 的第一个参数只接收简单的响应式数据的键路径，对于更复杂的表达式建议使用函数作为第一个参数。

至于 vm.$watch 的内部原理是：

 * 设置 options.user = true，标志是一个用户 watcher

 * 实例化一个 Watcher 实例，当检测到数据更新时，通过 watcher 去触发回调函数的执行，并传递新老值作为回调函数的参数

 * 返回一个 unwatch 函数，用于取消观察

 ## vm.$on(event, callback) 做了什么？

监听当前实例上的自定义事件，事件可由 vm.$emit 触发，回调函数会接收所有传入事件触发函数（vm.$emit）的额外参数。

vm.$on 的原理很简单，就是处理传递的 event 和 callback 两个参数，将注册的事件和回调函数以键值对的形式存储到 vm._event 对象中，vm._events = { eventName: [cb1, cb2, ...], ... }。

## vm.$emit(eventName, [...args]) 做了什么？

触发当前实例上的指定事件，附加参数都会传递给事件的回调函数。

其内部原理就是执行 vm._events[eventName] 中所有的回调函数。

> 组件自定义事件的处理内部用的就是 vm.on、vm.on、vm.emit。

## vm.$off([event, callback]) 做了什么？

移除自定义事件监听器，即移除 vm._events 对象上相关数据。

 * 如果没有提供参数，则移除实例的所有事件监听

 * 如果只提供了 event 参数，则移除实例上该事件的所有监听器

 * 如果两个参数都提供了，则移除实例上该事件对应的监听器

 ## vm.$once(event, callback) 做了什么？

监听一个自定义事件，但是该事件只会被触发一次。一旦触发以后监听器就会被移除。

其内部的实现原理是：

* 包装用户传递的回调函数，当包装函数执行的时候，除了会执行用户回调函数之外还会执行 vm.$off(event, 包装函数) 移除该事件

* 用 vm.$on(event, 包装函数) 注册事件

## vm.$forceUpdate() 做了什么？

迫使 Vue 实例重新渲染，它仅仅影响组件实例本身和插入插槽内容的子组件，而不是所有子组件。其内部原理到也简单，就是直接调用 vm._watcher.update()，它就是 watcher.update() 方法，执行该方法触发组件更新。

## vm.$destroy() 做了什么？

负责完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令和事件监听器。在执行过程中会调用 beforeDestroy 和 destroy 两个钩子函数。在大多数业务开发场景下用不到该方法，一般都通过 v-if 指令来操作。

其内部原理是：

* 调用 beforeDestroy 钩子函数

* 将自己从老爹肚子里（$parent）移除，从而销毁和老爹的关系

* 通过 watcher.teardown() 来移除依赖监听

* 通过 vm.__patch__(vnode, null) 方法来销毁节点

* 调用 destroyed 钩子函数

* 通过 vm.$off 方法移除所有的事件监听

## vm._render 做了什么？

官方文档没有提供该方法，它是一个用于源码内部的实例方法，负责生成 vnode。其关键代码就一行，执行 render 函数生成 vnode。不过其中加了大量的异常处理代码。

## 什么是 Hook Event？

Hook Event 是 Vue 的自定义事件结合生命周期钩子实现的一种从组件外部为组件注入额外生命周期方法的功能。

## Hook Event 是如何实现的？

```html
<comp @hook:lifecycleMethod="method" />
```

* 处理组件自定义事件的时候（vm.$on) 如果发现组件有 `hook:xx` 格式的事件（xx 为 Vue 的生命周期函数），则将 `vm._hasHookEvent` 置为 `true`，表示该组件有 Hook Event

* 在组件生命周期方法被触发的时候，内部会通过 `callHook` 方法来执行这些生命周期函数，在生命周期函数执行之后，如果发现 `vm._hasHookEvent` 为 `true`，则表示当前组件有 Hook Event，通过 `vm.$emit('hook:xx')` 触发 Hook Event 的执行

## 简单说一下 Vue 的编译器都做了什么？

Vue 的编译器做了三件事情：

* 将组件的 html 模版解析成 AST 对象

* 优化，遍历 AST，为每个节点做静态标记，标记其是否为静态节点，然后进一步标记出静态根节点，这样在后续更新的过程中就可以跳过这些静态节点了；标记静态根用于生成渲染函数阶段，生成静态根节点的渲染函数

* 从 AST 生成运行时的渲染函数，即大家说的 render，其实还有一个，就是 staticRenderFns 数组，里面存放了所有的静态节点的渲染函数

## 详细说一说编译器的解析过程，它是怎么将 html 字符串模版变成 AST 对象的？

* 遍历 HTML 模版字符串，通过正则表达式匹配 "<"

* 跳过某些不需要处理的标签，比如：注释标签、条件注释标签、Doctype。

* 解析开始标签

 1. 得到一个对象，包括 标签名（tagName）、所有的属性（attrs）、标签在 html 模版字符串中的索引位置

 2. 进一步处理上一步得到的 attrs 属性，将其变成 [{ name: attrName, value: attrVal, start: xx, end: xx }, ...] 的形式

 3. 通过标签名、属性对象和当前元素的父元素生成 AST 对象，其实就是一个 普通的 JS 对象，通过 key、value 的形式记录了该元素的一些信息

 4. 接下来进一步处理开始标签上的一些指令，比如 v-pre、v-for、v-if、v-once，并将处理结果放到 AST 对象上

 5. 处理结束将 ast 对象存放到 stack 数组

 6. 处理完成后会截断 html 字符串，将已经处理掉的字符串截掉

* 解析闭合标签

  1. 如果匹配到结束标签，就从 stack 数组中拿出最后一个元素，它和当前匹配到的结束标签是一对。

  2. 再次处理开始标签上的属性，这些属性和前面处理的不一样，比如：key、ref、scopedSlot、样式等，并将处理结果放到元素的 AST 对象上

  3. 然后将当前元素和父元素产生联系，给当前元素的 ast 对象设置 parent 属性，然后将自己放到父元素的 ast 对象的 children 数组中

* 最后遍历完整个 html 模版字符串以后，返回 ast 对象

## 详细说一下静态标记的过程

* 标记静态节点

  1. 通过递归的方式标记所有的元素节点

  2. 如果节点本身是静态节点，但是存在非静态的子节点，则将节点修改为非静态节点

* 标记静态根节点，基于静态节点，进一步标记静态根节点

 1. 如果节点本身是静态节点 && 而且有子节点 && 子节点不全是文本节点，则标记为静态根节点

 2. 如果节点本身不是静态根节点，则递归的遍历所有子节点，在子节点中标记静态根

## 什么样的节点才可以被标记为静态节点？

* 文本节点

* 节点上没有 v-bind、v-for、v-if 等指令

* 非组件

## 详细说一下渲染函数的生成过程

大家一说到渲染函数，基本上说的就是 render 函数，其实编译器生成的渲染有两类：

* 第一类就是一个 `render` 函数，负责生成动态节点的 vnode

* 第二类是放在一个叫 `staticRenderFns` 数组中的静态渲染函数，这些函数负责生成静态节点的 `vnode`
渲染函数生成的过程，其实就是在遍历 AST 节点，通过递归的方式，处理每个节点，最后生成形如：`_c(tag, attr, children, normalizationType)` 的结果。tag 是标签名，attr 是属性对象，children 是子节点组成的数组，其中每个元素的格式都是 `_c(tag, attr, children, normalizationTYpe)` 的形式，`normalization` 表示节点的规范化类型，是一个数字 0、1、2，不重要。

在处理 AST 节点过程中需要大家重点关注也是面试中常见的问题有：

### 静态节点是怎么处理的

* 静态节点的处理分为两步：

 1. 将生成静态节点 vnode 函数放到 staticRenderFns 数组中

 2. 返回一个 _m(idx) 的可执行函数，意思是执行 staticRenderFns 数组中下标为 idx 的函数，生成静态节点的 vnode

### v-once、v-if、v-for、组件 等都是怎么处理的

* 单纯的 v-once 节点处理方式和静态节点一致

* v-if 节点的处理结果是一个三元表达式

* v-for 节点的处理结果是可执行的 _l 函数，该函数负责生成 v-for 节点的 vnode

* 组件的处理结果和普通元素一样，得到的是形如 _c(compName) 的可执行代码，生成组件的 vnode

编译器最后生成的代码都是经过 with 包裹的，比如:

```html
<div id="app">
  <div v-for="item in arr" :key="item">{{ item }}</div>
</div>
```

```js
with (this) {
  return _c(
    'div',
    {
      attrs:
      {
        "id": "app"
      }
    },
    _l(
      (arr),
      function (item) {
        return _c(
          'div',
          {
            key: item
          },
          [_v(_s(item))]
        )
      }
    ),
    0
  )
}
```

`with` 语句可以扩展作用域链，所以生成的代码中的 `_c、_l、_v、_s` 都是 `this` 上一些方法，也就是说在运行时执行这些方法可以生成各个节点的 vnode。

## 一个组件是如何变成 VNode？

* 组件实例初始化，最后执行 $mount 进入挂载阶段

* 如果是只包含运行时的 vue.js，只直接进入挂载阶段，因为这时候的组件已经变成了渲染函数，编译过程通过模块打包器 + vue-loader + vue-template-compiler 完成的

* 如果没有使用预编译，则必须使用全量的 vue.js

* 挂载时如果发现组件配置项上没有 render 选项，则进入编译阶段

* 将模版字符串编译成 AST 语法树，其实就是一个普通的 JS 对象

* 然后优化 AST，遍历 AST 对象，标记每一个节点是否为静态静态；然后再进一步标记出静态根节点，在组件后续更新时会跳过这些静态节点的更新，以提高性能

* 接下来从 AST 生成渲染函数，生成的渲染函数有两部分组成：

 1. 负责生成动态节点 VNode 的 render 函数

 2. 还有一个 staticRenderFns 数组，里面每一个元素都是一个生成静态节点 VNode 的函数，这些函数会作为 render 函数的组成部分，负责生成静态节点的 VNode

* 接下来将渲染函数放到组件的配置对象上，进入挂载阶段，即执行 mountComponent 方法

* 最终负责渲染组件和更新组件的是一个叫 updateComponent 方法，该方法每次执行前首先需要执行 vm._render 函数，该函数负责执行编译器生成的 render，得到组件的 VNode

* 将一个组件生成 VNode 的具体工作是由 render 函数中的 _c、_o、_l、_m 等方法完成的，这些方法都被挂载到 Vue 实例上面，负责在运行时生成组件 VNode

> 提示：到这里首先要明白什么是 VNode，一句话描述就是 —— 组件模版的 JS 对象表现形式，它就是一个普通的 JS 对象，详细描述了组件中各节点的信息

* _c，负责生成组件或 HTML 元素的 VNode，_c 是所有 render helper 方法中最复杂，也是最核心的一个方法，其它的 _xx 都是它的组成部分

* _l，运行时渲染 v-for 列表的帮助函数，循环遍历 val 值，依次为每一项执行 render 方法生成 VNode，最终返回一个 VNode 数组

* _m，负责生成静态节点的 VNode，即执行 staticRenderFns 数组中指定下标的函数

简单总结 render helper 的作用就是：在 Vue 实例上挂载一些运行时的工具方法，这些方法用在编译器生成的渲染函数中，用于生成组件的 VNode。

## 你能说一说 Vue 的 patch 算法吗？

Vue 的 patch 算法有三个作用：负责首次渲染和后续更新或者销毁组件

* 如果新的VNode不存在，老的VNode存在，直接销毁老的

* 如果老的 VNode 是真实元素，则表示首次渲染，创建整棵 DOM 树，并插入 body，然后移除老的模版节点

* 如果老的 VNode 不是真实元素，并且新的 VNode 也存在，则表示更新阶段，执行 patchVnode

 1. 如果老的VNode等于新的VNode直接返回

 2. 如果新老节点都是文本节点且文本不相同，则直接替换文本

 3. 如果新的VNode有子节点，老的VNode没有子节点，则添加新的子节点，

 4. 如果新的VNode没有子节点，老的VNode有子节点，则删除老的子节点,

 5. 如果新老 VNode 都有孩子，则递归执行 updateChildren，进行 diff 过程

   > 针对前端操作 DOM 节点的特点进行如下优化：
   5.1 diff的过程是个递归的过程，遵循同层比较（降低时间复杂度）深度优先原则

   5.2 通过4种假设，进行首位节点的比较，找到相同节点，则执行 patchVnode，然后将老节点移动到正确的位置

   5.3 如果老的 VNode 先于新的 VNode 遍历结束，则剩余的新的 VNode 执行新增节点操作

   5.4 如果新的 VNode 先于老的 VNode 遍历结束，则剩余的老的 VNode 执行删除操纵，移除这些老节点

## patch

> /src/compiler/patch.js

```js
/**
 * 负责组件的首次渲染和后续更新
 * @param {VNode} oldVnode 老的 VNode
 * @param {VNode} vnode 新的 VNode
 */
export default function patch(oldVnode, vnode) {
  if (oldVnode && !vnode) {
    // 老节点存在，新节点不存在，则销毁组件
    return
  }

  if (!oldVnode) { // oldVnode 不存在，说明是子组件首次渲染
  } else {
    if (oldVnode.nodeType) { // 真实节点，则表示首次渲染根组件
    } else {
      // 后续的更新
      patchVnode(oldVnode, vnode)
    }
  }
}
```

## patchVnode

> /src/compiler/patch.js

```js
/**
 * 对比新老节点，找出其中的不同，然后更新老节点
 * @param {*} oldVnode 老节点的 vnode
 * @param {*} vnode 新节点的 vnode
 */
function patchVnode(oldVnode, vnode) {
  // 如果新老节点相同，则直接结束
  if (oldVnode === vnode) return

  // 将老 vnode 上的真实节点同步到新的 vnode 上，否则，后续更新的时候会出现 vnode.elm 为空的现象
  vnode.elm = oldVnode.elm

  // 走到这里说明新老节点不一样，则获取它们的孩子节点，比较孩子节点
  const ch = vnode.children
  const oldCh = oldVnode.children

  if (!vnode.text) { // 新节点不存在文本节点
    if (ch && oldCh) { // 说明新老节点都有孩子
      // diff
      updateChildren(ch, oldCh)
    } else if (ch) { // 老节点没孩子，新节点有孩子
      // 增加孩子节点
    } else { // 新节点没孩子，老节点有孩子
      // 删除这些孩子节点
    }
  } else { // 新节点存在文本节点
    if (vnode.text.expression) { // 说明存在表达式
      // 获取表达式的新值
      const value = JSON.stringify(vnode.context[vnode.text.expression])
      // 旧值
      try {
        const oldValue = oldVnode.elm.textContent
        if (value !== oldValue) { // 新老值不一样，则更新
          oldVnode.elm.textContent = value
        }
      } catch {
        // 防止更新时遇到插槽，导致报错
        // 目前不处理插槽数据的响应式更新
      }
    }
  }
}
```

## updateChildren

> /src/compiler/patch.js

```js
/**
 * diff，比对孩子节点，找出不同点，然后将不同点更新到老节点上
 * @param {*} ch 新 vnode 的所有孩子节点
 * @param {*} oldCh 老 vnode 的所有孩子节点
 */
function updateChildren(ch, oldCh) {
  // 四个游标
  // 新孩子节点的开始索引，叫 新开始
  let newStartIdx = 0
  // 新结束
  let newEndIdx = ch.length - 1
  // 老开始
  let oldStartIdx = 0
  // 老结束
  let oldEndIdx = oldCh.length - 1
  // 循环遍历新老节点，找出节点中不一样的地方，然后更新
  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) { // 根为 web 中的 DOM 操作特点，做了四种假设，降低时间复杂度
    // 新开始节点
    const newStartNode = ch[newStartIdx]
    // 新结束节点
    const newEndNode = ch[newEndIdx]
    // 老开始节点
    const oldStartNode = oldCh[oldStartIdx]
    // 老结束节点
    const oldEndNode = oldCh[oldEndIdx]
    if (sameVNode(newStartNode, oldStartNode)) { // 假设新开始和老开始是同一个节点
      // 对比这两个节点，找出不同然后更新
      patchVnode(oldStartNode, newStartNode)
      // 移动游标
      oldStartIdx++
      newStartIdx++
    } else if (sameVNode(newStartNode, oldEndNode)) { // 假设新开始和老结束是同一个节点
      patchVnode(oldEndNode, newStartNode)
      // 将老结束移动到新开始的位置
      oldEndNode.elm.parentNode.insertBefore(oldEndNode.elm, oldCh[newStartIdx].elm)
      // 移动游标
      newStartIdx++
      oldEndIdx--
    } else if (sameVNode(newEndNode, oldStartNode)) { // 假设新结束和老开始是同一个节点
      patchVnode(oldStartNode, newEndNode)
      // 将老开始移动到新结束的位置
      oldStartNode.elm.parentNode.insertBefore(oldStartNode.elm, oldCh[newEndIdx].elm.nextSibling)
      // 移动游标
      newEndIdx--
      oldStartIdx++
    } else if (sameVNode(newEndNode, oldEndNode)) { // 假设新结束和老结束是同一个节点
      patchVnode(oldEndNode, newEndNode)
      // 移动游标
      newEndIdx--
      oldEndIdx--
    } else {
      // 上面几种假设都没命中，则老老实的遍历，找到那个相同元素
    }
  }
  // 走到这里，说明老姐节点或者新节点被遍历完了
  if (oldStartIdx > oldEndIdx) {
    // 说明老节点被遍历完了，新节点有剩余，则说明这部分剩余的节点是新增的节点，然后添加这些节点
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    // 说明新节点被遍历完了，老节点有剩余，说明这部分的节点被删掉了，则移除这些节点
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
```

## sameVNode

> /src/compiler/patch.js

```js
/**
 * 判读两个节点是否相同 
 */
function sameVnode (a, b) {
  return (
    // key 必须相同，需要注意的是 undefined === undefined => true
    a.key === b.key && (
      (
        // 标签相同
        a.tag === b.tag &&
        // 都是注释节点
        a.isComment === b.isComment &&
        // 都有 data 属性
        isDef(a.data) === isDef(b.data) &&
        // input 标签的情况
        sameInputType(a, b)
      ) || (
        // 异步占位符节点
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

## Vue是如何进行挂载的？

调用$mount()方法时进行挂载。
挂载步骤:
  1. 传入el和当前实例到mountComponent方法中。
  2. 调用beforeMount钩子函数
  3. 建立响应式数据依赖更新机制，调动render函数获取虚拟dom
  4. 初始化渲染，首次调用patch方法创建dom节点完成挂载和渲染
  5. 挂载渲染完成后调用mounted钩子函数。

## Vue项目中常用的性能优化有哪些?

### 1、代码层面的优化

* v-if 和 v-show 区分使用场景

> v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。

* computed 和 watch 区分使用场景

> 运用场景：

> 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；

> 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

* v-for 遍历必须为 item 添加 key，且避免同时使用 v-if

> 在列表数据进行遍历渲染时，需要为每一项 item 设置唯一 key 值，方便 Vue.js 内部机制精准找到该条列表数据。当 state 更新时，新的状态值和旧的状态值对比，较快地定位到 diff 。

> v-for 比 v-if 优先级高，如果每一次都需要遍历整个数组，将会影响速度，尤其是当之需要渲染很小一部分的时候，必要情况下应该替换成 computed 属性。

* 长列表性能优化

> Vue 会通过 Object.defineProperty 对数据进行劫持，来实现视图响应数据的变化，然而有些时候我们的组件就是纯粹的数据展示，不会有任何改变，我们就不需要 Vue 来劫持我们的数据，在大量数据展示的情况下，这能够很明显的减少组件初始化的时间，那如何禁止 Vue 劫持我们的数据呢？可以通过 Object.freeze 方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了。


* 事件的销毁

> Vue 组件销毁时，会自动清理它与其它实例的连接，解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。 如果在 js 内使用 addEventListene 等方式是不会自动销毁的，我们需要在组件销毁时手动移除这些事件的监听，以免造成内存泄露

* 图片资源懒加载

> 对于图片过多的页面，为了加速页面加载速度，所以很多时候我们需要将页面内未出现在可视区域内的图片先不做加载， 等到滚动到可视区域后再去加载。这样对于页面加载性能上会有很大的提升，也提高了用户体验。我们在项目中使用 Vue 的 vue-lazyload 插件

* 路由懒加载

Vue  是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效了。这样会大大提高首屏显示的速度，但是可能其他的页面的速度就会降下来。

* 第三方插件的按需引入

> 我们在项目中经常会需要引入第三方插件，如果我们直接引入整个插件，会导致项目的体积太大，我们可以借助 babel-plugin-component ，然后可以只引入需要的组件，以达到减小项目体积的目的。

* 优化无限列表性能

> 如果你的应用存在非常长或者无限滚动的列表，那么需要采用 窗口化 的技术来优化性能，只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间。 你可以参考以下开源项目 vue-virtual-scroll-list 和 vue-virtual-scroller  来优化这种无限列表的场景的。

* 服务端渲染 SSR or 预渲染

### 2、Webpack 层面的优化

* Webpack 对图片进行压缩

> 在 vue 项目中除了可以在 webpack.base.conf.js 中 url-loader 中设置 limit 大小来对图片处理，对小于 limit 的图片转化为 base64 格式，其余的不做操作。所以对有些较大的图片资源，在请求资源的时候，加载会很慢，我们可以用 image-webpack-loader来压缩图片

* 减少 ES6 转为 ES5 的冗余代码

> Babel 插件会在将 ES6 代码转换成 ES5 代码时会注入一些辅助函数
> 在默认情况下， Babel 会在每个输出文件中内嵌这些依赖的辅助函数代码，如果多个源代码文件都依赖这些辅助函数，那么这些辅助函数的代码将会出现很多次，造成代码冗余。为了不让这些辅助函数的代码重复出现，可以在依赖它们时通过 require('babel-runtime/helpers/createClass') 的方式导入，这样就能做到只让它们出现一次。babel-plugin-transform-runtime 插件就是用来实现这个作用的，将相关辅助函数进行替换成导入语句，从而减小 babel 编译出来的代码的文件大小。

* 提取公共代码

如果项目中没有去将每个页面的第三方库和公共模块提取出来，则项目会存在以下问题：

相同的资源被重复加载，浪费用户的流量和服务器的成本。
每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

所以我们需要将多个页面的公共代码抽离成单独的文件，来优化以上问题 。Webpack 内置了专门用于提取多个Chunk 中的公共部分的插件 CommonsChunkPlugin，我们在项目中 CommonsChunkPlugin 的配置如下：

```js
// 所有在 package.json 里面依赖的包，都会被打包进 vendor.js 这个文件中。
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function(module, count) {
    return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      module.resource.indexOf(
        path.join(__dirname, '../node_modules')
      ) === 0
    );
  }
}),
// 抽取出代码模块的映射关系
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  chunks: ['vendor']
})

```

* 模板预编译

> 当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。

> 预编译模板最简单的方式就是使用单文件组件——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

> 如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 vue-template-loader，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

* 提取组件的 CSS

> 当使用单文件组件时，组件内的 CSS 会以 style 标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，如果你使用服务端渲染，这会导致一段 “无样式内容闪烁 (fouc) ” 。将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。

> webpack + vue-loader ( vue-cli 的 webpack 模板已经预先配置好)

* 优化 SourceMap

> 开发环境推荐： cheap-module-eval-source-map 
> 生产环境推荐： cheap-module-source-map 

原因如下： 

1. 源代码中的列信息是没有任何作用，因此我们打包后的文件不希望包含列相关信息，只有行信息能建立打包前后的依赖关系。因此不管是开发环境或生产环境，我们都希望添加cheap的基本类型来忽略打包前后的列信息。 
2. 不管是开发环境还是正式环境，我们都希望能定位到bug的源代码具体的位置，比如说某个vue文件报错了，我们希望能定位到具体的vue文件，因此我们也需要module配置。 
3. 我们需要生成map文件的形式，因此我们需要增加source-map属性。 
4. 我们介绍了eval打包代码的时候，知道eval打包后的速度非常快，因为它不生成map文件，但是可以对eval组合使用 eval-source-map使用会将map文件以DataURL的形式存在打包后的js文件中。在正式环境中不要使用 eval-source-map, 因为它会增加文件的大小，但是在开发环境中，可以试用下，因为他们打包的速度很快。


* 构建结果输出分析

### 3、基础的 Web 技术优化

* 开启 gzip 压缩

* 浏览器缓存

* CDN 的使用

> 浏览器从服务器上下载 CSS、js 和图片等文件时都要和服务器连接，而大部分服务器的带宽有限，如果超过限制，网页就半天反应不过来。而 CDN 可以通过不同的域名来加载文件，从而使下载文件的并发连接数大大增加，且CDN 具有更好的可用性，更低的网络延迟和丢包率 。

* 使用 Chrome Performance 查找性能瓶颈

## Vue项目Webpack优化实践

### 1、缩小文件的搜索范围

* 优化Loader配置

> 由于Loader对文件的转换操作很耗时，所以需要让尽可能少的文件被Loader处理。我们可以通过以下3方面优化Loader配置：（1）优化正则匹配（2）通过cacheDirectory选项开启缓存（3）通过include、exclude来减少被处理的文件

```js
{
  // 1、如果项目源码中只有js文件，就不要写成/\.jsx?$/，以提升正则表达式的性能
  test: /\.js$/,
  // 2、babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启
  loader: 'babel-loader?cacheDirectory',
  // 3、只对项目根目录下的src 目录中的文件采用 babel-loader
  include: [resolve('src')]
},
```

* 优化resolve.modules配置

> resolve.modules 用于配置Webpack去哪些目录下寻找第三方模块。resolve.modules的默认值是［node modules］，含义是先去当前目录的/node modules目录下去找我们想找的模块，如果没找到，就去上一级目录../node modules中找，再没有就去../ .. /node modules中找，以此类推，这和Node.js的模块寻找机制很相似。当安装的第三方模块都放在项目根目录的./node modules目录下时，就没有必要按照默认的方式去一层层地寻找，可以指明存放第三方模块的绝对路径，以减少寻找。

```js
{
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    modules: [path.resolve(__dirname,'node_modules')]
  },
}
```

* 优化resolve.alias配置

* 优化resolve.extensions配置 

> 在导入语句没带文件后缀时，Webpack 会在自动带上后缀后去尝试询问文件是否存在。默认是：extensions :[‘. js ‘,’. json ’] 。也就是说，当遇到require ( '. /data ’）这样的导入语句时，Webpack会先去寻找./data .js 文件，如果该文件不存在，就去寻找./data.json 文件，如果还是找不到就报错。如果这个列表越长，或者正确的后缀越往后，就会造成尝试的次数越多，所以 resolve .extensions 的配置也会影响到构建的性能。 

优化措施： 
  • 后缀尝试列表要尽可能小，不要将项目中不可能存在的情况写到后缀尝试列表中。
  • 频率出现最高的文件后缀要优先放在最前面，以做到尽快退出寻找过程。 
  • 在源码中写导入语句时，要尽可能带上后缀，从而可以避免寻找过程。例如在确定的情况下将 require(’. /data ’)写成require(’. /data.json ’)，可以结合enforceExtension 和 enforceModuleExtension开启使用来强制开发者遵守这条优化

* 优化resolve.noParse配置

> noParse配置项可以让Webpack忽略对部分没采用模块化的文件的递归解析和处理，这 样做的好处是能提高构建性能。原因是一些库如jQuery、ChartJS 庞大又没有采用模块化标准，让Webpack去解析这些文件既耗时又没有意义。noParse是可选的配置项，类型需要是RegExp 、[RegExp]、function中的一种。例如，若想要忽略jQuery 、ChartJS ，则优化配置如下：

```js
// 使用正则表达式 
noParse: /jquery|chartjs/ 
// 使用函数，从 Webpack3.0.0开始支持 
noParse: (content)=> { 
// 返回true或false 
return /jquery|chartjs/.test(content); 
}
```

### 2、减少冗余代码

> babel-plugin-transform-runtime 是Babel官方提供的一个插件，作用是减少冗余的代码 。 Babel在将ES6代码转换成ES5代码时，通常需要一些由ES5编写的辅助函数来完成新语法的实现，例如在转换 class extent 语法时会在转换后的 ES5 代码里注入 extent 辅助函数用于实现继承。babel-plugin-transform-runtime会将相关辅助函数进行替换成导入语句，从而减小babel编译出来的代码的文件大小。

### 3、使用HappyPack多进程解析和处理文件

> 由于有大量文件需要解析和处理，所以构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack构建慢的问题会显得更为严重。运行在 Node.之上的Webpack是单线程模型的，也就是说Webpack需要一个一个地处理任务，不能同时处理多个任务。Happy Pack ( https://github.com/amireh/happypack ）就能让Webpack做到这一点，它将任务分解给多个子进程去并发执行，子进程处理完后再将结果发送给主进程。

项目中HappyPack使用配置：

```js
（1）HappyPack插件安装：
    $ npm i -D happypack
（2）webpack.base.conf.js 文件对module.rules进行配置
    module: {
     rules: [
      {
        test: /\.js$/,
        // 将对.js 文件的处理转交给 id 为 babel 的HappyPack实例
          use:['happypack/loader?id=babel'],
          include: [resolve('src'), resolve('test'),   
            resolve('node_modules/webpack-dev-server/client')],
        // 排除第三方插件
          exclude:path.resolve(__dirname,'node_modules'),
        },
        {
          test: /\.vue$/,
          use: ['happypack/loader?id=vue'],
        },
      ]
    },
（3）webpack.prod.conf.js 文件进行配置    const HappyPack = require('happypack');
    // 构造出共享进程池，在进程池中包含5个子进程
    const HappyPackThreadPool = HappyPack.ThreadPool({size:5});
    plugins: [
       new HappyPack({
         // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
         id:'vue',
         loaders:[
           {
             loader:'vue-loader',
             options: vueLoaderConfig
           }
         ],
         threadPool: HappyPackThreadPool,
       }),

       new HappyPack({
         // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
         id:'babel',
         // 如何处理.js文件，用法和Loader配置中一样
         loaders:['babel-loader?cacheDirectory'],
         threadPool: HappyPackThreadPool,
       }),
    ]
```

### 4、使用ParallelUglifyPlugin多进程压缩代码文件

> 由于压缩JavaScript 代码时，需要先将代码解析成用 Object 抽象表示的 AST 语法树，再去应用各种规则分析和处理AST ，所以导致这个过程的计算量巨大，耗时非常多。当Webpack有多个JavaScript 文件需要输出和压缩时，原本会使用UglifyJS去一个一个压缩再输出，但是ParallelUglifyPlugin会开启多个子进程，将对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过UglifyJS去压缩代码，但是变成了并行执行。所以 ParallelUglify Plugin能更快地完成对多个文件的压缩工作。

项目中ParallelUglifyPlugin使用配置：

```js
（1）ParallelUglifyPlugin插件安装：
     $ npm i -D webpack-parallel-uglify-plugin
（2）webpack.prod.conf.js 文件进行配置
    const ParallelUglifyPlugin =require('webpack-parallel-uglify-plugin');
    plugins: [
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJs:{
        compress: {
          warnings: false
        },
        sourceMap: true
      }
     }),
    ]
```

### 5、使用自动刷新 

> 借助自动化的手段，在监听到本地源码文件发生变化时，自动重新构建出可运行的代码后再控制浏览器刷新。Webpack将这些功能都内置了，并且提供了多种方案供我们选择。

项目中自动刷新的配置：

```js
devServer: {
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化后等300ms再去执行动作
    aggregateTimeout: 300,
    // 默认每秒询问1000次
    poll: 1000
  }
},
```

相关优化措施：

（1）配置忽略一些不监听的一些文件，如：node_modules。 
（2）watchOptions.aggregateTirneout 的值越大性能越好，因为这能降低重新构建的频率。
（3） watchOptions.poll 的值越小越好，因为这能降低检查的频率。

### 6、开启模块热替换 

项目中模块热替换的配置：

```js
devServer: {
  hot: true,
},
plugins: [
  new webpack.HotModuleReplacementPlugin(),
// 显示被替换模块的名称
  new webpack.NamedModulesPlugin(), // HMR shows correct file names
]
```

### 7、提取公共代码 

如果每个页面的代码都将这些公共的部分包含进去，则会造成以下问题 ： 

 • 相同的资源被重复加载，浪费用户的流量和服务器的成本。

 • 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。 

 如果将多个页面的公共代码抽离成单独的文件，就能优化以上问题 。Webpack内置了专门用于提取多个Chunk中的公共部分的插件CommonsChunkPlugin。 

 项目中CommonsChunkPlugin的配置：

 ```js
 // 所有在 package.json 里面依赖的包，都会被打包进 vendor.js 这个文件中。
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function(module, count) {
    return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      module.resource.indexOf(
        path.join(__dirname, '../node_modules')
      ) === 0
    );
  }
}),
// 抽取出代码模块的映射关系
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  chunks: ['vendor']
}),
 ```

## 如何中断请求

### XMLHttpRequest中断请求

> XMLHttpRequest.abort()方法将终止该请求，当一个请求被终止，它的readyState将被置为XMLHttpRequest.UNSENT(0)，并且请求的status置为0。

### Axios中断请求

> Axios内置CancelToken类，并且new时可以传入回调函数，回调函数接受一个参数cancel函数，CancelToken会把取消回调注入给参数callback，外部使用cancelCallback接收。

CancelToken构造函数生成cancel函数

```js
async request() {
  try {
    if (typeof this.cancelCallback === 'function') {
      this.cancelCallback('请求中断')
      this.cancelCallback = null
    }
    const res = await axios.get({
      data: {},
      cancelToken: new axios.CancelToken(callback => this.cancelCallback = callback)
    })
  } catch (error) {
    console.log(error)
  }
}
```

CancelToken.source()生成取消令牌token

```js
let cancelTokenSource = null;

async request() {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('请求中断')
    cancelTokenSource = null
  }

  const cancelToken = axios.CancelToken
  cancelTokenSource = cancelToken.source()

  try {
    const ret = await axios.get({
      cancelToken: cancelTokenSource.token,
      data: {}
    })
  } catch (error) {
    console.log(error)
  }
}
```

### Fetch中断请求

1. Fetch是H5新添加的功能，在低版本是不支持的，比如： ie。为了中断Fetch请求跟随出现了AbortController一个控制器对象，允许你根据需要中止一个或者多个web请求。

2. AbortController通过在请求中传入信号源，然后在需要中断请求的时候通过abort方法进行中断请求。

3. AbortController类生成会返回abort中断请求的方法和signal中断请求匹配的信号源。

```js
// 1. 创建 abortController 对象
const abortControllerObj = new AbortController()

// 2. 创建信号源
const signal = abortControllerObj.signal

// 3. 使用
const request = async () => {
  try {
    const ret = await fetch('/api/task/list', { signal })
    return ret
  } catch (error) {
    console.log(error)
  }
}
```

## 浏览器事件轮询与node事件轮询的区别

浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。

## 在浏览器中输入url回车后会发生什么？

1. 通过DNS域名系统解析真实的IP地址，
2. 建立连接(TCP三次握手)，
3. 客户端获取数据，渲染页面，
4. 断开连接(四次挥手)

## 浏览器是如何渲染页面的？

1. 解析html和css形成dom结构和css结构，
2. dom结构和css结构进行render形成渲染树,
3. 浏览器计算布局信息，
4. 经过UI渲染引擎渲染页面，
5. 用户所看到的页面。

## 从哪些方面做性能优化？

1. 加载
  1.1 减少http的请求（精灵图，合并文件），
  1.2 减小文件大小（资源压缩，图片压缩，代码压缩），
  1.3 CDN内容分发（第三方库，大图片，大文件），
  1.4 服务端渲染，预渲染，
  1.5 懒加载，
  1.6 缓存（本地缓存localStorage, sessionStorage, 离线缓存manifest，强缓存，协商缓存），
2. 减少DOM的操作，避免回流和重绘，


## webpack 的构建流程是什么

初始化参数：解析webpack配置参数，合并shell传入和webpack.config.js文件配置的参数,形成最后的配置结果；

开始编译：上一步得到的参数初始化compiler对象，注册所有配置的插件，插件 监听webpack构建生命周期的事件节点，做出相应的反应，执行对象的run方法开始执行编译；

确定入口：从配置的entry入口，开始解析文件构建AST语法树，找出依赖，递归下去；

编译模块：递归中根据文件类型和loader配置，调用所有配置的loader对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；

完成模块编译并输出：递归完事后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据entry或分包配置生成代码块chunk;

输出完成：输出所有的chunk到文件系统;
