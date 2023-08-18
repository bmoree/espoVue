import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import EntityListingPage from '../views/EntityListingPage.vue'
import EntityShowPage from '../views/EntityShowPage.vue'
import EntityEditPage from '../views/EntityEditPage.vue'

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
    path: '/:entity',
    name: 'Entity.list',
    component: EntityListingPage
  },
  {
    path: '/:entity/:id',
    name: 'Entity.show',
    component: EntityShowPage
  },
  {
    path: '/:entity/:id/edit',
    name: 'Entity.edit',
    component: EntityEditPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
