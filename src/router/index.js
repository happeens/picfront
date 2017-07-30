import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Vote from '@/components/Vote'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/all',
      name: 'Home',
      component: Home
    },
    {
      path: '/',
      name: 'Vote',
      component: Vote
    }
  ]
})
