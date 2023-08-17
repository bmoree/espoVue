import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AccountsPage from '../views/AccountsPage.vue'
import AccountShowPage from '../views/AccountShowPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/Account',
    name: 'Account.list',
    component: AccountsPage
  },
  {
    path: '/Account/:id',
    name: 'Account.show',
    component: AccountShowPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
