import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/global.css'

import elementUI from 'element-ui'

import './assets/fonts/iconfont.css'

import axios from 'axios'
// 接口基准地址

Vue.use(elementUI)
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
Vue.prototype.$http = axios
// Vue.config.productionTip = false

// 拦截器
axios.interceptors.request.use(function (config) {

  // console.log(config)
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, function (error) {
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
