import Vue from 'vue'//导入vue
import App from './App.vue'//导入根组件
import router from './router'//导入路由
import './plugins/element.js'//导入elementui
//导入全局样式表
import './assets/css/global.css'
//导入插件
import TreeTable from 'vue-table-with-tree-grid'

//导入字体图标
import './assets/fonts/iconfont.css'
//导入发起请求用的包
import axios from 'axios'
// 把包挂在vue的原型对象上，这样每个组件都可以通过this直接访问到$http，从而发起ajax请求
//设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器 对每个请求都做这样的处理
axios.interceptors.request.use(config => {
  console.log(config)
  //必须在请求头中使用 Authorization 字段提供 token 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  //把app根组件渲染到render上
  render: h => h(App) //=> 是es6的箭头函数，render 函数的返回值是VNode（即：虚拟节点，也就是我们要渲染的节点）
}).$mount('#app')//mount， 意思为挂载。 可以理解为将vue实例（逻辑应用），挂靠在某个dom元素（载体）上的一个过程。
