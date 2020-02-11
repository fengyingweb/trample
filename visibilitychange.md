## 页面可见性改变事件`visibilitychange`

`visibilitychange`事件介绍 简单的说，浏览器标签页被隐藏或显示的时候会触发`visibilitychange`事件

### API的属性和事件

HTML5中专门为`document`添加了相关属性和事件.

属性:
1. `document.hidden`只读属性 布尔值 简单的表示标签页显示或者隐藏, 如果页面处于被认为是对用户隐藏状态时返回true，否则返回false。

2. `document.visibilityState`只读属性, 是一个用来展示文档可见性状态的字符串,可能的值：
  + `visible`: 页面内容至少是部分可见。 在实际中，这意味着页面是非最小化窗口的前景选项卡。
  + `hidden`: 页面内容对用户不可见。 在实际中，这意味着文档可以是一个后台标签，或是最小化窗口的一部分，或是在操作系统锁屏激活的状态下。
  + `prerender`: 页面内容正在被预渲染且对用户是不可见的(被`document.hidden`当做隐藏). 文档可能初始状态为`prerender`，但绝不会从其它值转为该值。 注释：浏览器支持是可选的。
  + `unloaded`: 页面正在从内存中卸载。 注释：浏览器支持是可选的。

3. `document.onvisibilitychange`: `EventListener`提供在`visibilitychange`事件被触发时要调用的代码。

```` javascript
  let vibibleState = '';
  let visibleChange = '';
  if (typeof document.visibilityState !== 'undefined') {
      visibleChange = 'visibilitychange';
      vibibleState = 'visibilityState';
  }else if (typeof document.webkitVisibilityState !== 'undefined') {
      visibleChange = 'webkitvisibilitychange';
      vibibleState = 'webkitVisibilityState';
  }

  if (visibleChange) {
      document.addEventListener(visibleChange, function () {
        if (document[vibibleState] == "visible") {
          //页面激活的时候TODO
        }
      }, false);
  }
````
