import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
      // {
      //     path: '/saveEnterprise',
      //     name: 'saveEnterprise',
      //     component: SaveEnterprise//() => import('./views/save.vue')
      // },
      {
          path: '/save',
          name: 'save',
          component: () => import('./views/save.vue')
      },
      {
          path: '/list',
          name: 'list',
          component: () => import('./views/list.vue')
      }

  ]
})
