import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import { chainUrl } from "./assets/js/config";
import HttpProvider from './assets/js/HttpProvider'
let newhttpProvider = new HttpProvider(chainUrl)
Vue.prototype.httpProvider = newhttpProvider

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
