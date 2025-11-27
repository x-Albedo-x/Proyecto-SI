import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Login from '../views/Login.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import AdminClientes from '../views/admin/Clientes.vue'
import AdminProductos from '../views/admin/Productos.vue'
import AdminPedidos from '../views/admin/Pedidos.vue'
import AdminInventario from '../views/admin/Inventario.vue'
import AdminPerfil from '../views/admin/Perfil.vue'
import Tienda from '../views/cliente/Tienda.vue'
import Carrito from '../views/cliente/Carrito.vue'
import MisPedidos from '../views/cliente/MisPedidos.vue'
import Perfil from '../views/cliente/Perfil.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, role: 'administrador' }
    },
    {
        path: '/admin/clientes',
        name: 'AdminClientes',
        component: AdminClientes,
        meta: { requiresAuth: true, role: 'administrador' }
    },
    {
        path: '/admin/productos',
        name: 'AdminProductos',
        component: AdminProductos,
        meta: { requiresAuth: true, role: 'administrador' }
    },
    {
        path: '/admin/pedidos',
        name: 'AdminPedidos',
        component: AdminPedidos,
        meta: { requiresAuth: true, role: 'administrador' }
    },
    {
        path: '/admin/inventario',
        name: 'AdminInventario',
        component: AdminInventario,
        meta: { requiresAuth: true, role: 'administrador' }
    },
    {
        path: '/admin/perfil',
        name: 'AdminPerfil',
        component: AdminPerfil,
        meta: { requiresAuth: true, role: 'administrador' }
    },
    {
        path: '/tienda',
        name: 'Tienda',
        component: Tienda,
        meta: { requiresAuth: true, role: 'cliente' }
    },
    {
        path: '/carrito',
        name: 'Carrito',
        component: Carrito,
        meta: { requiresAuth: true, role: 'cliente' }
    },
    {
        path: '/mis-pedidos',
        name: 'MisPedidos',
        component: MisPedidos,
        meta: { requiresAuth: true, role: 'cliente' }
    },
    {
        path: '/perfil',
        name: 'Perfil',
        component: Perfil,
        meta: { requiresAuth: true, role: 'cliente' }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    authStore.loadUserFromStorage()

    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated) {
            next('/login')
        } else if (to.meta.role && authStore.userRole !== to.meta.role) {
            next('/login')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
