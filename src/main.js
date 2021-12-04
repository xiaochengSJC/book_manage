// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import  'element-ui/lib/theme-chalk/index.css'
import createPersistedState from 'vuex-persistedState'
import global from './global';
import moment from 'moment'
 
Vue.prototype.$moment = moment

Vue.prototype.global = global;

Vue.use(Element)
Vue.config.productionTip = false

var axios = require('axios')

axios.defaults.headers.post["Content-Type"] = "application/json";
var instance = axios.create({}) // 这样创建出来的 只需要：
instance.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json'
    return config
  }, err => {
    return Promise.reject(err)
  }
)
Vue.prototype.$axios = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data:function(){
		return {
			userInfo:{
      }
		}
	},
  plugins:[createPersistedState()],
  components: { App },
  template: '<App/>'
})
