import { createRouter, createWebHistory } from 'vue-router'
import chatLoginView from '../views/chatLoginView.vue'
import chatSignUpView from '../views/chatSignUpView.vue'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: chatLoginView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: chatSignUpView
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/chatMainView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && store.state.onFocusUser === null) {
    if (to.path !== '/' && store.state.addUser === true) {
      next()
    } else {
      alert("connection closed !")
      router.push('/')
    }
  } else {
    next()
  }
})

export default router
