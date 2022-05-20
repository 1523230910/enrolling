import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {   
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/lists/:list',
    name: 'Lists',
    component: () => import('../views/Lists.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router