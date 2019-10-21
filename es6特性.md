## 声明
  **const**: 声明常量
  **let**: 声明变量

### 作用

* 作用域
  1. 全局作用域
  2. 函数作用域: function() {}
  3. 块级作用域: {}

* 作用范围
  1. `var`命令在全局代码中执行
  2. `const`命令和`let`命令只能在代码块中执行

* 赋值使用
  1. `const`命令声明常量后必须立马赋值
  2. `let`命令声明变量后可立马赋值或使用时赋值

* 声明方法 `var`、`const`、`let`、`function`、`class`、`import`

### 重点难点
  
  * 不允许重复声明
  * 未定义就使用会报错：const命令和let命令不存在变量提升
  * 暂时性死区：在代码块内使用let命令声明变量之前，该变量都不可用

## 解构赋值
  
  * **字符串解构：** `const [a, b, c, d, e] = "hello"`
  * **数值解构：** `const { toString: s } = 123`
  * **布尔值解构：** `const { toString: b } = true`
  * **对象解构**
    1. 形式：`const { x, y } = { x: 1, y: 2 }`
    2. 默认：`const { x, y = 2 } = { x: 1 }`
    3. 改名：`const { x, y: z } = { x: 1, y: 2 }`
  * **数组解构**
    1. 规则：数据结构具有`Iterator`接口可采用数组形式的解构赋值
    2. 形式：`const [x, y] = [1, 2]`
    3. 默认：`const [x, y = 2] = [1]`
  * **函数参数解构**
    1. 数组解构：`function Func([x = 0, y = 1]) {}`
    2. 对象解构：`function Func({ x = 0, y = 1 } = {}) {}`

### 应用场景

  * 交换变量值：`[x, y] = [y, x]`
  * 返回函数多个值：`const [x, y, z] = func()`
  * 定义函数参数：`func([1, 2])`
  * 提取JSON数据：`const { name, version } = packageJson`
  * 定义函数参数默认值：`function Func({ x = 1, y = 2 } = {}) {}`
  * 遍历Map结构：`for (let [k, v] of Map) {}`
  * 输入模块指定属性和方法：`const { readFile, writeFile } = require("fs")`

### 重点难点
  * 匹配模式：只要等号两边的模式相同，左边的变量就会被赋予对应的值
  * 解构赋值规则：只要等号右边的值不是对象或数组，就先将其转为对象
  * 解构默认值生效条件：属性值严格等于undefined
  * 解构遵循匹配模式
  * 解构不成功时变量的值等于undefined
  * undefined和null无法转为对象，因此无法进行解构

## 字符串扩展
  * Unicode表示法：大括号包含表示Unicode字符(\u{0xXX}或\u{0XXX})
  * 字符串遍历：可通过for-of遍历字符串
  * 字符串模板：可单行可多行可插入变量的增强版字符串
  * 标签模板：函数参数的特殊调用
  * String.raw()：返回把字符串所有变量替换且对斜杠进行转义的结果
  * String.fromCodePoint()：返回码点对应字符
  * codePointAt()：返回字符对应码点(String.fromCodePoint()的逆操作)
  * normalize()：把字符的不同表示方法统一为同样形式，返回新字符串(Unicode正规化)
  * repeat()：把字符串重复n次，返回新字符串
  * matchAll()：返回正则表达式在字符串的所有匹配
  * includes()：是否存在指定字符串
  * startsWith()：是否存在字符串头部指定字符串
  * endsWith()：是否存在字符串尾部指定字符串

### 重点难点
  * 以上扩展方法均可作用于由4个字节储存的Unicode字符上

## 数值扩展
  * 二进制表示法：0b或0B开头表示二进制(0bXX或0BXX)
  * 八进制表示法：0o或0O开头表示二进制(0oXX或0OXX)
  * Number.EPSILON：数值最小精度
  * Number.MIN_SAFE_INTEGER：最小安全数值(-2^53)
  * Number.MAX_SAFE_INTEGER：最大安全数值(2^53)
  * Number.parseInt()：返回转换值的整数部分
  * Number.parseFloat()：返回转换值的浮点数部分
  * Number.isFinite()：是否为有限数值
  * Number.isNaN()：是否为NaN
  * Number.isInteger()：是否为整数
  * Number.isSafeInteger()：是否在数值安全范围内
  * Math.trunc()：返回数值整数部分
  * Math.sign()：返回数值类型(正数1、负数-1、零0)
  * Math.cbrt()：返回数值立方根
  * Math.clz32()：返回数值的32位无符号整数形式
  * Math.imul()：返回两个数值相乘
  * Math.fround()：返回数值的32位单精度浮点数形式
  * Math.hypot()：返回所有数值平方和的平方根
  * Math.expm1()：返回e^n - 1
  * Math.log1p()：返回1 + n的自然对数(Math.log(1 + n))
  * Math.log10()：返回以10为底的n的对数
  * Math.log2()：返回以2为底的n的对数
  * Math.sinh()：返回n的双曲正弦
  * Math.cosh()：返回n的双曲余弦
  * Math.tanh()：返回n的双曲正切
  * Math.asinh()：返回n的反双曲正弦
  * Math.acosh()：返回n的反双曲余弦
  * Math.atanh()：返回n的反双曲正切

## 对象扩展
  * 简洁表示法：直接写入变量和函数作为对象的属性和方法({ prop, method() {} })
  * 属性名表达式：字面量定义对象时使用[]定义键([prop]，不能与上同时使用)
  * 方法的name属性：返回方法函数名
    1. 取值函数(getter)和存值函数(setter)：get/set 函数名(属性的描述对象在get和set上)
    2. bind返回的函数：bound 函数名
    3. Function构造函数返回的函数实例：anonymous
  * 属性的可枚举性和遍历：描述对象的enumerable
  * super关键字：指向当前对象的原型对象(只能用在对象的简写方法中method() {})
  * Object.is()：对比两值是否相等
  * Object.assign()：合并对象(浅拷贝)，返回原对象
  * Object.getPrototypeOf()：返回对象的原型对象
  * Object.setPrototypeOf()：设置对象的原型对象
  * __proto__：返回或设置对象的原型对象

### 属性遍历
  * 描述：自身、可继承、可枚举、非枚举、Symbol
  * 遍历
    1. for-in：遍历对象自身可继承可枚举属性
    2. Object.keys()：返回对象自身可枚举属性的键组成的数组
    3. Object.getOwnPropertyNames()：返回对象自身可继承可枚举非枚举属性的键组成的数组
    4. Object.getOwnPropertySymbols()：返回对象Symbol属性的键组成的数组
    5. Reflect.ownKeys()：返回对象自身可继承可枚举非枚举Symbol属性的键组成的数组
  * 规则
    1. 首先遍历所有数值键，按照数值升序排列
    2. 其次遍历所有字符串键，按照加入时间升序排列
    3. 最后遍历所有Symbol键，按照加入时间升序排列

## 数组扩展
  * 扩展运算符(...)：转换数组为用逗号分隔的参数序列([...arr]，相当于rest/spread参数的逆运算)
  * Array.from()：转换具有Iterator接口的数据结构为真正数组，返回新数组
    1. 类数组对象：包含length的对象、Arguments对象、NodeList对象
    2. 可遍历对象：String、Set结构、Map结构、Generator函数
  * Array.of()：转换一组值为真正数组，返回新数组
  * copyWithin()：把指定位置的成员复制到其他位置，返回原数组
  * find()：返回第一个符合条件的成员
  * findIndex()：返回第一个符合条件的成员索引值
  * fill()：根据指定值填充整个数组，返回原数组
  * keys()：返回以索引值为遍历器的对象
  * values()：返回以属性值为遍历器的对象
  * entries()：返回以索引值和属性值为遍历器的对象
  * 数组空位：ES6明确将数组空位转为undefined(空位处理规不一，建议避免出现)

### 扩展应用
  * 克隆数组：const arr = [...arr1]
  * 合并数组：const arr = [...arr1, ...arr2]
  * 拼接数组：arr.push(...arr1)
  * 代替apply：Math.max.apply(null, [x, y]) => Math.max(...[x, y])
  * 转换字符串为数组：[..."hello"]
  * 转换类数组对象为数组：[...Arguments, ...NodeList]
  * 转换可遍历对象为数组：[...String, ...Set, ...Map, ...Generator]
  * 与数组解构赋值结合：const [x, ...rest/spread] = [1, 2, 3]
  * 计算Unicode字符长度：Array.from("hello").length => [..."hello"].length

### 重点难点
  * 使用keys()、values()、entries()返回的遍历器对象，可用for-of自动遍历或next()手动遍历

## 函数扩展
  * 参数默认值：为函数参数指定默认值
    1. 形式：function Func(x = 1, y = 2) {}
    2. 参数赋值：惰性求值(函数调用后才求值)
    3. 参数位置：尾参数
    4. 参数作用域：函数作用域
    5. 声明方式：默认声明，不能用const或let再次声明
    6. length：返回没有指定默认值的参数个数
    7. 与解构赋值默认值结合：function Func({ x = 1, y = 2 } = {}) {}
    8. 应用
       * 指定某个参数不得省略，省略即抛出错误：function Func(x = throwMissing()) {}
       * 将参数默认值设为undefined，表明此参数可省略：Func(undefined, 1)
  * rest/spread参数(...)：返回函数多余参数
    1. 形式：以数组的形式存在，之后不能再有其他参数
    2. 作用：代替Arguments对象
    3. length：返回没有指定默认值的参数个数但不包括rest/spread参数
  * 严格模式：在严格条件下运行JS
    1. 应用：只要函数参数使用默认值、解构赋值、扩展运算符，那么函数内部就不能显式设定为严格模式
  * name属性：返回函数的函数名
    1. 将匿名函数赋值给变量：空字符串(ES5)、变量名(ES6)
    2. 将具名函数赋值给变量：函数名(ES5和ES6)
    3. bind返回的函数：bound 函数名(ES5和ES6)
    4. Function构造函数返回的函数实例：anonymous(ES5和ES6)
  * 箭头函数(=>)：函数简写
    1. 无参数：() => {}
    2. 单个参数：x => {}
    3. 多个参数：(x, y) => {}
    4. 解构参数：({x, y}) => {}
    5. 嵌套使用：部署管道机制
    6. this指向固定化
       * 并非因为内部有绑定this的机制，而是根本没有自己的this，导致内部的this就是外层代码块的this
       * 因为没有this，因此不能用作构造函数
  * 尾调用优化：只保留内层函数的调用帧
    1. 尾调用
       * 定义：某个函数的最后一步是调用另一个函数
       * 形式：function f(x) { return g(x); }
    2. 尾递归
       * 定义：函数尾调用自身
       * 作用：只要使用尾递归就不会发生栈溢出，相对节省内存
       * 实现：把所有用到的内部变量改写成函数的参数并使用参数默认值

### 箭头函数误区
  * 函数体内的this是定义时所在的对象而不是使用时所在的对象
  * 可让this指向固定化，这种特性很有利于封装回调函数
  * 不可当作构造函数，因此箭头函数不可使用new命令
  * 不可使用yield命令，因此箭头函数不能用作Generator函数
  * 不可使用Arguments对象，此对象在函数体内不存在(可用rest/spread参数代替)
  * 返回对象时必须在对象外面加上括号
