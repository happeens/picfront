import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Vote from '@/components/Vote'
import Show from '@/components/Show'

Vue.use(Router)

export default new Router({
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
    },
    {
      path: '/show',
      name: 'Show',
      component: Show
    }
  ]
})
