# dialog插件实例

## dialog.vue模板

```html
<template>
    <div>
        <Overlay v-if="overlay" :visible="visible"></Overlay>
        <transition name="zoom">
            <section class="ac-dialog" v-if="visible" @touchmove.prevent>
                <div :class="['dialog', className]">
                    <div class="dialog-content">
                        <h2 v-if="isShowTitle">{{title}}</h2>
                        <p v-html="message" :style="{textAlign:messageAlign,paddingTop:isShowTitle?'.2rem':'.8rem'}"></p>
                        <slot name="extra-content"></slot>
                    </div>
                    <div class="dialog-button">
                        <div class="dialog-button-cancel" :style="{color: cancelColor}" v-if="isShowCancelBtn" @click="cancel">{{cancelText}}</div>
                        <div class="dialog-button-confirm" :style="{color: confirmColor}" @click="confirm">{{confirmText}}</div>
                    </div>
                </div>
            </section>
        </transition>
    </div>
</template>
```
```js
<script>
import {defineComponent, reactive, toRefs, getCurrentInstance, onMounted} from 'vue'
import Overlay from '../overlay'
export default defineComponent({
    name: 'Dialog',
    props: {
        message: {
            type: String,
            default: '一些消息提示语'
        },
        className: String,
        isShowTitle: {
            type: Boolean,
            default: true
        },
        isShowCancelBtn: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: '提示'
        },
        messageAlign: {
            type: String,
            default: 'center'
        },
        confirmText: {
            type: String,
            default: '确认'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        overlay: {
            type: Boolean,
            default: true
        },
        closeOnClickOverlay: {
            type: Boolean,
            default: false
        },
        cancelColor: {
            type: String,
            default: '#909399'
        },
        confirmColor: {
            type: String,
            default: '#409EFF'
        }
    },
    components: {
        Overlay
    },
    setup() {
        let ele = null
        const dialogState = reactive({
            visible: false,
            resolve: '',
            reject: '',
            promise: '' // 保存promise对象
        })
        const remove = ()=> {
            document.body.removeChild(ele)
        }
        // 确定,将promise断定为resolve状态
        const confirm = ()=> {
            dialogState.visible = false
            dialogState.resolve('confirm')
            remove()
        }

        // 取消,将promise断定为reject状态
        const cancel = ()=> {
            dialogState.visible = false
            dialogState.reject('cancel')
            remove()
        }

        // 弹出dialogBox,并创建promise对象
        const showDialogBox = ()=> {
            dialogState.visible = true
            dialogState.promise = new Promise((resolve, reject) => {
                dialogState.resolve = resolve
                dialogState.reject = reject
            })
            // 返回promise对象
            return dialogState.promise
        }
        onMounted(()=> {
            const {ctx} = getCurrentInstance()
            ele = ctx.$el
        })
        return {
            ...toRefs(dialogState),
            confirm,
            cancel,
            showDialogBox,
        }
    }
})
</script>
```
```css
<style lang="less" scoped>
@import "../../assets/css/var.less";
.dialog {
    width: 72%;
    height: auto;
    background: #fff;
    border-radius: 30px;
    backface-visibility: hidden; /*avoid blurry text after scale animation*/
    &-content {
        color: @dialogFontColor;
        font-size: @termsFontSize;/*px*/
        line-height: 1.5em;
        &>h2{
            font-size: 1.2em;
            line-height: 3em;
            text-align: center;
        }
        &>p{
            padding: 40px 5%;
        }
    }
    &-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1PX solid @colorIvory;/*no*/
        &>div{
            flex: 1;
            text-align: center;
            font-size: @btnFontSize;/*px*/
            padding: 30px 0;
        }
        &-confirm{
            color: @confirmColor;
        }
        &-cancel{
            color: @cancelColor;
            border-right: 1PX solid @colorIvory;/*no*/
        }
    }
}
</style>
```
## index.js引入组件，创建插件

```js

import { createVNode, render } from 'vue'
import DialogVue from './index.vue';

// 定义插件对象
const Dialog = {};
// 定义vue插件
Dialog.install = function (app) {
  let currentVm;
  const initInstance = (options) => {
    // 实例化vue实例
    let props = {}
    if (typeof options === 'string') {
      props.message = options
    } else if (typeof options === 'object') {
      props = Object.assign(props, options)
    }
    const container = document.createElement('div')
    let vm = createVNode(DialogVue, props, null);
    render(vm, container)
    currentVm = vm.component.proxy // 注意应取proxy属性，不能取ctx属性, 取ctx属性打包后会找不到对应属性
    document.body.appendChild(container.firstElementChild);
  };
  
  app.config.globalProperties.$dialog = {
    showDialogBox (options = {}) {
      if (!currentVm) {
        initInstance(options);
      }
      return currentVm.showDialogBox()
          .then(val => {
            currentVm = null;
            return Promise.resolve(val);
          })
          .catch(err => {
            currentVm = null;
            return Promise.reject(err);
          });
    },
    cancel(){
      return currentVm.cancel()
    }
  };
};
export default Dialog;

```
## main.js中引用插件

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Dialog from './components/dialog'

const app = createApp(App)

app.use(Dialog)
app.use(router).use(store).mount('#app')
```

## 使用

```js
<script>
import {reactive, toRefs, onMounted, defineAsyncComponent, getCurrentInstance} from 'vue'
export default {
  name: 'Home',
  components: {
    StartDialog: defineAsyncComponent(()=> import('@/components/startDialog')),
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config
    const startState = reactive({
      showStartDialog: false,
      showStartClose: true
    })
    const closeStart = ()=> {
      startState.showStartDialog = false
      setTimeout(()=> {
        globalProperties.$dialog.showDialogBox('账户存在异常，无法进行兑换~')
      }, 1000)
    }

    const showDialog = ()=> {
      globalProperties.$dialog.showDialogBox({
          isShowTitle: false,
          isShowCancelBtn: false,
          confirmText: '知道了',
          message: '活动已结束，下次请赶早~！'
      })
    }

    onMounted(()=> {
      globalProperties.$loading.show('')
      setTimeout(()=> {
        startState.showStartDialog = true
        globalProperties.$loading.hide()
      }, 3000)
    })

    return {
      ...toRefs(startState),
      closeStart,
      showDialog
    }
  }
}
</script>
```
