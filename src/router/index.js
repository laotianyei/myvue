import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'
import home from '@/components/Home'
// import home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [

    {path: '/login',component:login},
    {path: '/home',component:home}
  ]
})
// 路由守卫
// 在这里验证token
router.beforeEach((to, from, next) => {
 console.log(this.a.push)
  var token = window.sessionStorage.getItem('token')

  if (token === null&&to.path!="/login"){
      next('/login')
  }
  next()
})

export default router