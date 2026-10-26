import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('layouts/MainLayout.vue'),
    // children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    children: [
      { path: 'home', name:'home', component: () => import('pages/HomePage.vue') },
      { path: 'profile', name: 'profile', component: () => import('pages/ProfilePage.vue') },
      // { path: 'newItem', name: 'newItem', component: () => import('pages/NewProduct2.vue') },
      { path: 'newSales', name: 'newSales', component: () => import('pages/SalesPage.vue') },
      { path: 'notification', name: 'notification', component: () => import('pages/NotificationPage.vue') },
      { path: 'sales', name: 'sales', component: () => import('pages/SelfSalesPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
