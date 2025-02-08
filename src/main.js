import Vue from 'vue'
import router from './router'
import App from './App.vue'
import Antd from 'ant-design-vue'
import PagerTable from '../lib/index'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)
Vue.use(PagerTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
