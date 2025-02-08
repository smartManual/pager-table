import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'

Vue.use(VueRouter)

const routes= [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: '/index',
    name: 'Index',
    component: Index
  }
]

const router = new VueRouter({
  routes
})

export default router