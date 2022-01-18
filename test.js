const MyPromise = require('./myPromise');

const promise = new MyPromise((resolve, reject)=> {
  resolve('success')
  // setTimeout(()=> {
  //   resolve('success')
  // }, 2000)
})

promise.then(res=> {
  console.log(1);
  console.log('resolve1', res);
}, err=> {
  console.log(err);
});

promise.then(res=> {
  console.log(2);
  console.log('resolve2', res);
}, err=> {
  console.log(err);
});

promise.then(res=> {
  console.log(3);
  console.log('resolve3', res);
}, err=> {
  console.log(err);
})
