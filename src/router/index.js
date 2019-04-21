import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'

// import aa from '../components/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // path: '/',
      // name: 'HelloWorld',
      // component: HelloWorld
      path: '/login', component: login,
      // path: '/login', component: aa,
    }
  ]
})
