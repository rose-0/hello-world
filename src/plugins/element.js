import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'

//导入弹框提示组件
import {Message} from 'element-ui'

// 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//弹框组件需要全局挂载 $message是自定以属性，挂在vue的原型对象上，每个组件都可以通过this访问到它
Vue.prototype.$message = Message
