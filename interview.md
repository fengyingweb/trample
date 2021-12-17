# 面试汇总

##1 下面代码输出什么？

````js
let a = {name: '1'};
let b = a;
a.x = a = {name: '2'}
console.log(a.x) // {name: '2'}
console.log(b.x) // undefined
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