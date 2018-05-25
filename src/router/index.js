import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/pages/Goods/Goods'
import Ratings from '@/pages/Ratings/Ratings'
import Shangjia from '@/pages/Shangjia/Shangjia'
Vue.use(Router)

export default new Router({
  linkActiveClass: 'red',
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: Ratings
    },
    {
      path: '/shangjia',
      name: 'Shangjia',
      component: Shangjia
    }
  ]
})
