import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import InventoryView from '../views/InventoryView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/dashboard/inventario',
      name: 'inventario',
      component: InventoryView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/inventario',
      name: 'admin-inventario',
      component: InventoryView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/ProductosView.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/HomeView.vue')
    }
  ],
})

export default router
