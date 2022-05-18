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
  let last = 0;
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
    this.eventObj[eventName] = [cb]
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
    fnArgs = [].slice.call(arguments);
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

## 手机号3-3-4分割

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
                this.$store = this.$parent && this.$parent.$store;
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

## 参考[Vue源码解析] (https://juejin.cn/column/6960553066101735461)

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

## Hook Event 是如果实现的？

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

* 如果老的 VNode 是真实元素，则表示首次渲染，创建整棵 DOM 树，并插入 body，然后移除老的模版节点

* 如果老的 VNode 不是真实元素，并且新的 VNode 也存在，则表示更新阶段，执行 patchVnode

 1. 首先是全量更新所有的属性

 2. 如果新老 VNode 都有孩子，则递归执行 updateChildren，进行 diff 过程

   > 针对前端操作 DOM 节点的特点进行如下优化：
   2.1 同层比较（降低时间复杂度）深度优先（递归）

   2.2 而且前端很少有完全打乱节点顺序的情况，所以做了四种假设，假设新老 VNode 的开头结尾存在相同节点，一旦命中假设，就避免了一次循环，降低了 diff 的时间复杂度，提高执行效率。如果不幸没有命中假设，则执行遍历，从老的 VNode 中找到新的 VNode 的开始节点

   2.3 找到相同节点，则执行 patchVnode，然后将老节点移动到正确的位置

   2.4 如果老的 VNode 先于新的 VNode 遍历结束，则剩余的新的 VNode 执行新增节点操作

   2.5 如果新的 VNode 先于老的 VNode 遍历结束，则剩余的老的 VNode 执行删除操纵，移除这些老节点

 3. 如果新的 VNode 有孩子，老的 VNode 没孩子，则新增这些新孩子节点

 4. 如果老的 VNode 有孩子，新的 VNode 没孩子，则删除这些老孩子节点

 5. 剩下一种就是更新文本节点

* 如果新的 VNode 不存在，老的 VNode 存在，则调用 destroy，销毁老节点

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
  // 跳出循环，说明有一个节点首先遍历结束了
  if (newStartIdx < newEndIdx) { // 说明老节点先遍历结束，则将剩余的新节点添加到 DOM 中

  }
  if (oldStartIdx < oldEndIdx) { // 说明新节点先遍历结束，则将剩余的这些老节点从 DOM 中删掉

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
