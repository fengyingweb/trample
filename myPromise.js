// console.log(queueMicrotask) // queueMicrotask 创建微任务方法

// 定义状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error)
    }
  }

  // 存储状态
  status = PENDING;

  // 成功之后保存的值
  value = null;

  // 失败之后保存的值
  reason = null;
  
  // 保存成功回调
  onFulfilledCallbacks = [];

  // 保存失败回调
  onRejectedCallbacks = [];

  resolve = (value)=> {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  }

  reject = (reason)=> {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  }

  then = (onFulfilledCall, onRejectedCall)=> {
    const onRealFulfilledCallback = typeof onFulfilledCall === 'function' ? onFulfilledCall : value => value;
    const onRealRejectedCallback = typeof onRejectedCall === 'function' ? onRejectedCall : reason => {throw reason};

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise = new MyPromise((resolve, reject)=> {
      const onFulfilledMicroTask = (value)=> {
        // 创建一个微任务等待 promise 完成初始化
        queueMicrotask(()=> {
          try {
            // 获取成功回调函数的执行结果
            const x = onRealFulfilledCallback(value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })
      };

      const onRejectedMicroTask = (reason)=> {
        queueMicrotask(()=> {
          try {
            // 调用失败回调，并且把原因返回
            const x = onRealRejectedCallback(reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      };

      // 判断状态
      if (this.status === FULFILLED) {
        onFulfilledMicroTask(this.value);
      } else if (this.status === REJECTED) {
        onRejectedMicroTask(this.reason);
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(onFulfilledMicroTask);
        this.onRejectedCallbacks.push(onRejectedMicroTask);
      }
    });

    return promise;
  };

  catch = (onRejectedCall)=> {
    return this.then(null, onRejectedCall);
  };

  finally = (callback)=> {
    return this.then(res=> {
      return MyPromise.resolve(callback()).then(()=> {
        return res;
      })
    }, err=> {
      return MyPromise.resolve(callback()).then(()=> {
        throw err;
      })
    })
  }

  // resolve 静态方法
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve)=> {
      resolve(value)
    })
  }

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject)=> {
      reject(reason);
    })
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 判断then返回的promise是否为自己
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  if (typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      // x 为 null 直接返回，走后面的逻辑会报错
      return resolve(x)
    }

    let then;
    try {
      // 把 x.then 赋值给 then
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false;
      try{
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject)
          },
          r => {
            // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
            if (called) return;
            called = true;
            reject(r);
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;

        // 否则以 error 为据因拒绝 promise
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x)
  }
}

module.exports = MyPromise;
