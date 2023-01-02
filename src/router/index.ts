import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    redirect: '/index',
    component: Layout,
    name: 'index',
    meta: { title: '首页' },
    children: [
      {
        component: () => import('@/views/index.vue'),
        path: 'index',
        name: 'index',
        meta: { title: '首页' },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory('/'),
  routes: routes,
})
