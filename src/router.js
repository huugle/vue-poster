import Vue from 'vue'
import Router from 'vue-router'
import Poster from './views/Poster.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Poster
    }
  ]
})
