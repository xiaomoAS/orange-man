/*
 * @Autor: jiangzupei
 * @Description:
 * @Date: 2025-06-30 14:11:45
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-11-21 11:48:41
 * @FilePath: /orange-man/src/router/index.ts
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/ware',
    },
    {
      path: '/ware',
      name: 'WareList',
      component: () => import(/* webpackChunkName: "ware-list" */ '@/views/ware/WareList.vue'),
    },
    {
      path: '/promotionsResource',
      name: 'PromotionsResource',
      component: () =>
        import(/* webpackChunkName: "promotions-resource" */ '@/views/promotions-resource/PromotionsResource.vue'),
    },
    {
      path: '/promotionsActivity',
      name: 'PromotionsActivity',
      component: () =>
        import(/* webpackChunkName: "promotions-activity" */ '@/views/promotions-activity/PromotionsActivity.vue'),
    },
    {
      path: '/orders',
      name: 'OrderManage',
      component: () => import(/* webpackChunkName: "order-manage" */ '@/views/orders/OrderManage.vue'),
    },
    {
      path: '/cateConfig',
      name: 'CateConfig',
      component: () => import(/* webpackChunkName: "cate-config" */ '@/views/cate-config/CateConfig.vue'),
    },
    {
      path: '/couponList',
      name: 'CouponList',
      component: () => import(/* webpackChunkName: "coupon-list" */ '@/views/coupon/CouponList.vue'),
    },
    {
      path: '/leaderConfigs',
      name: 'LeaderConfigs',
      component: () => import(/* webpackChunkName: "leader-configs" */ '@/views/leader-configs/LeaderConfigs.vue'),
    },
    {
      path: '/userList',
      name: 'UserList',
      component: () => import(/* webpackChunkName: "user-list" */ '@/views/user-list/UserList.vue'),
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import(/* webpackChunkName: "login-page" */ '@/views/login/LoginPage.vue'),
    },
  ],
})

export default router
