import Vue from 'vue'
import Router from 'vue-router'
// import login from '@/components/login'
import login from '../components/login.vue'
import home from '@/components/Home'
import welcome from '@/components/Welcome'


Vue.use(Router)

const router = new Router({
  routes: [

    {path: '/login',component:login},
    {path: '/home',component:home,
      redirect:'/welcome',
      
      children:[{path: '/welcome',component:welcome}]
    }
    
  ]
})
// 路由守卫
// 在这里验证token
router.beforeEach((to, from, next) => {
//  console.log(this.a.push)
  var token = window.sessionStorage.getItem('token')

  if (token === null&&to.path!="/login"){
      next('/login')
  }
  next()
})

export default router