## IOS中输入框获得焦点后, 虚拟键盘弹起在收缩引起dom节点事件偏移的问题:

原因是IOS中有固定定位属性的元素, 当IOS的虚拟键盘弹出时会使整个页面元素往上偏移, 当键盘收起时页面下移, 但实际的页面滚动高度没有恢复正常, 使事件偏移了, 解决办法是输入框元素在失去焦点后, 让页面的滚动高度为0就可以了.

``` javascript
  function handleBlur() {
    let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  }
```
