## 防抖节流

```` html
<div class="btn-wrappper">
    <button id="btn1">按钮1</button>
    <button id="btn2">按钮2</button>
    <button id="btn3">按钮3</button>
    <button id="btn4">按钮4</button>
</div>
````

```` js
let btn1 = document.querySelector('#btn1');
let btn2 = document.querySelector('#btn2');
let btn3 = document.querySelector('#btn3');
let btn4 = document.querySelector('#btn4');

// 节流1 节流的核心思想: 如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器任务
function throttle(fn, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    if (!timer) {
      timer = setTimeout(()=> {
        fn.apply(context, args);
        timer = null;
      }, delay)
    }
  }
}

// 节流2
function throttle2(fn, delay) {
  let last = 0;
  return function(...args) {
    let context = this;
    let now = +Date.now();
    if (now - last < delay) return;
    last = now;
    fn.apply(context, args);
  }
}

// 防抖 核心思想: 每次事件触发则删除原来的定时器，建立新的定时器
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    let context = this;
    if (timer) clearTimeout(timer)
    timer = setTimeout(()=> {
      fn.apply(context, args);
    }, delay)
  }
}

// 加强版节流， 防抖和节流结合使用
function throttle3(fn, delay) {
  let last = 0;
  let timer = null;
  return function(...args) {
    let context = this;
    let now = +Date.now();
    if (now - last < delay) {
      clearTimeout(timer);
      timer = setTimeout(()=> {
        fn.apply(context, args);
      }, delay)
    } else {
      last = now;
      fn.apply(context, args);
    }
  }
}

btn1.addEventListener('click', throttle((e)=> {
    console.log('btn1: ', e.pageX);
}, 1000), false);

btn2.addEventListener('click', throttle2((e)=> {
  console.log('btn2: ', e.pageX);
}, 2000), false);

btn3.addEventListener('click', debounce((e)=> {
  console.log('btn3: ', e.pageX);
}, 1500), false);

btn4.addEventListener('click', throttle3((e)=> {
  console.log('btn4: ', e.pageX);
}, 3000), false)
````
