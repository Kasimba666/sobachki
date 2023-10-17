import Vue from 'vue'
import VueRouter from 'vue-router'
import Dogs from '../views/Dogs.vue'
import Owners from '../views/Countries.vue'
import Plants from '../views/Plants.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dogs',
    component: Dogs
  },
  {
    path: '/owners',
    name: 'owners',
    component: Owners
  },
  {
    path: '/plants',
    name: 'plants',
    component: Plants
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
