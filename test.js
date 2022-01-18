const MyPromise = require('./myPromise');

const promise = new MyPromise((resolve, reject)=> {
  resolve('success')
})

promise.then(res=> {
  console.log(1);
  console.log('resolve1:', res);
  return MyPromise.resolve('success2')
}, err=> {
  console.log(err);
}).then(res=> {
  console.log(2);
  console.log('resolve2:', res)
});
