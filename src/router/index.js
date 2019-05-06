import Vue from 'vue'
import Router from 'vue-router'
// import login from '@/components/login'
import login from '../components/login.vue'
import home from '@/components/Home'
import welcome from '@/components/Welcome'
import user from '@/components/User'
import rights from '@/components/Rights'
import roles from '@/components/Roles'
import cat from '@/components/Cat'
import params from '@/components/Params'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',

      children: [{
          path: '/welcome',
          component: welcome
        },
        {
          path: '/users',
          component: user
        },
        {
          path:'/rights',
          component:rights
        },
        {
          path:'/roles',
          component:roles
        },
        {
          path:'/categories',
          component:cat
        },
        {
          path:'/params',
          component:params
        }
      ]
    }
  ]
})
// 路由守卫
// 在这里验证token
router.beforeEach((to, from, next) => {
  //  console.log(this.a.push)
  var token = window.sessionStorage.getItem('token')

  if (token === null && to.path != "/login") {
    next('/login')
  }
  next()
})

export default router
