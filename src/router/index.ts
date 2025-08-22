/*
 * @Autor: jiangzupei
 * @Description:
 * @Date: 2025-06-30 14:11:45
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-22 15:13:01
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
        import(
          /* webpackChunkName: "promotions-resource" */ '@/views/promotions-resource/PromotionsResource.vue'
        ),
    },
    {
      path: '/promotionsActivity',
      name: 'PromotionsActivity',
      component: () =>
        import(
          /* webpackChunkName: "promotions-activity" */ '@/views/promotions-activity/PromotionsActivity.vue'
        ),
    },
    {
      path: '/orders',
      name: 'OrderManage',
      component: () =>
        import(/* webpackChunkName: "order-manage" */ '@/views/orders/OrderManage.vue'),
    },
    {
      path: '/cateConfig',
      name: 'CateConfig',
      component: () =>
        import(/* webpackChunkName: "cate-config" */ '@/views/cate-config/CateConfig.vue'),
    },
    {
      path: '/couponList',
      name: 'CouponList',
      component: () =>
        import(/* webpackChunkName: "coupon-list" */ '@/views/coupon/CouponList.vue'),
    },
  ],
})

export default router
