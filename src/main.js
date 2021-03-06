import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './dapp/configs'
import {web3,contract} from './dapp/web3/web2eth'
import './utils/prototypes' //导入原型方法

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
