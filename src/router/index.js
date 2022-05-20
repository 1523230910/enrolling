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
    path: '/lists',
    name: 'Lists',
    component: () => import('../views/Lists.vue'),
    props: true,
    children: [
      {
        path: 'add',
        component: () => import('../components/Add.vue'),
      },
      {
        path: 'find',
        component: () => import('../components/Find.vue'),
      },
      {
        path: 'set',
        component: () => import('../components/Set.vue'),
      },
      {
        path: 'user',
        component: () => import('../components/User.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router