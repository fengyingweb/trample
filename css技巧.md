# 常用易忘CSS小技巧

## 1.解决inline-block元素设置overflow:hidden属性导致相邻行内元素向下偏移

````html
.wrap {
  display: inline-block;
  overflow: hidden
	vertical-align: bottom
}

````

## 2.超出部分显示省略号

````html
// 单行文本
.wrap {
	overflow:hidden;/*超出部分隐藏*/
	text-overflow:ellipsis;/*超出部分显示省略号*/
	white-space:nowrap;/*规定段落中的文本不进行换行 */
}
// 多行文本
.wrap {
    width: 100%;
    overflow: hidden;
    display: -webkit-box;   //将对象作为弹性伸缩盒子模型显示  *必须结合的属性*
    -webkit-box-orient: vertical;   //设置伸缩盒对象的子元素的排列方式  *必须结合的属性*
    -webkit-line-clamp: 3;   //用来限制在一个块元素中显示的文本的行数
    word-break: break-all;   //让浏览器实现在任意位置的换行 *break-all为允许在单词内换行*
}

````

## 3.css实现不换行、自动换行、强制换行

````html
//不换行
.wrap {
  white-space:nowrap;
}
//自动换行
.wrap {
  word-wrap: break-word;
  word-break: normal;
}
//强制换行
.wrap {
  word-break:break-all;
}

````

## 4.CSS实现文本两端对齐

````html
.wrap {
    text-align: justify;
    text-justify: distribute-all-lines;  //ie6-8
    text-align-last: justify;  //一个块或行的最后一行对齐方式
    -moz-text-align-last: justify;
    -webkit-text-align-last: justify;
}

````

## 5.实现文字竖向排版

````html
// 单列展示时
.wrap {
    width: 25px;
    line-height: 18px;
    height: auto;
    font-size: 12px;
    padding: 8px 5px;
    word-wrap: break-word;/*英文的时候需要加上这句，自动换行*/  
}
// 多列展示时
.wrap {
    height: 210px;
    line-height: 30px;
    text-align: justify;
    writing-mode: vertical-lr;  //从左向右    
    writing-mode: tb-lr;        //IE从左向右
    //writing-mode: vertical-rl;  -- 从右向左
    //writing-mode: tb-rl;        -- 从右向左
}

````

## 6.使元素鼠标事件失效

````html
.wrap {
    // 如果按tab能选中该元素，如button，然后按回车还是能执行对应的事件，如click。
	pointer-events: none;
    cursor: default;
}

````

## 7.禁止用户选择

````html
.wrap {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

````

## 8.cursor属性

````html
.wrap {
  cursor：pointer; //小手指；
  cursor：help; //箭头加问号；
  cursor：wait; //转圈圈；
  cursor：move; //移动光标；
  cursor：crosshair; //十字光标
}
````

## 9.使用硬件加速

````html
.wrap {
    transform: translateZ(0);
}

````

## 10.图片宽度自适应

````html
img {max-width: 100%}

````

## 11.消除transition闪屏

````html
.wrap {
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
}

````

## 12.自定义滚动条

````html
overflow-y: scroll;
// 整个滚动条
::-webkit-scrollbar {
    width: 5px;
}

// 滚动条的轨道
::-webkit-scrollbar-track {
    background-color: #ffa336;
    border-radius: 5px;
}

// 滚动条的滑块
::-webkit-scorllbar-thumb {
    background-color: #ffc076;
    border-radius: 5px;
}

````

## 13.让 HTML 识别 string 里的 '\n' 并换行

````html
body {
  	white-space: pre-line;
}

````

## 14.移除被点链接的边框

````html
a {outline: none}
a {outline: 0}

````

## 15.使用CSS显示链接之后的URL

````html
a:after{content:" (" attr(href) ") ";}

````

## 16.select内容居中显示、下拉内容右对齐

````html
select{
    text-align: center;
    text-align-last: center;
}
select option {
    direction: rtl;
}

````

## 17.修改input输入框中光标的颜色不改变字体的颜色

````html
input{
    color:  #fff;
    caret-color: red;
}

````

## 18.修改input 输入框中 placeholder 默认字体样式

````html
//webkit内核的浏览器 
input::-webkit-input-placeholder {
    color: #c2c6ce;
}
//Firefox版本4-18 
input:-moz-placeholder {
    color: #c2c6ce;
}
//Firefox版本19+
input::-moz-placeholder {
    color: #c2c6ce;
}
//IE浏览器
input:-ms-input-placeholder {
    color: #c2c6ce;
}

````

## 19.子元素固定宽度 父元素宽度被撑开

````html
// 父元素下的子元素是行内元素
.wrap {
  white-space: nowrap;
}
// 若父元素下的子元素是块级元素
.wrap {
  white-space: nowrap;  // 子元素不被换行
  display: inline-block;
}

````

## 20.实现宽高等比例自适应矩形

````html
        .scale {
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
            position: relative; 
        }

        .item {
            position: absolute; 
            width: 100%;
            height: 100%;
            background-color: 499e56;
        }    
   <div class="scale">
        <div class="item">
            这里是所有子元素的容器
        </div>
    </div>

````

## 21.transfrom的rotate属性在span标签下失效

````html
span {
  display: inline-block
}

````

## 22.边框字体同色

````html
	.wrap {
		width: 200px;
		height: 200px;
		color: #000;
		font-size: 30px;
		border: 50px solid currentColor;
		// border: 50px solid; // 实现二
	}

````