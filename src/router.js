import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
// import Home from './components/Home.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import Add from './components/goods/Add.vue'
import Order from './components/order/Order.vue'
Vue.use(Router)

//export default new Router直接new然后导出
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    //children放子路由组件welcome
    { 
      path: '/home', 
      component: Home,
      //重定向
      redirect: "/welcome",
      children:
      [
      {path: '/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
      ] 
    }
  ]
})

// 挂载路由导航守卫，即加权限
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')//tokenStr不存在，没登陆，跳转
  next()//存在token 放行
})

//路由对象暴露出去 
export default router
// // 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 将要访问的路径
//   // from 代表从哪个路径跳转而来
//   // next 是一个函数，表示放行
//   //     next()  放行    next('/login')  强制跳转

//   if (to.path === '/login') return next()
//   // 获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })

// export default router
