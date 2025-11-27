<template>
    <nav class="navbar">
        <RouterLink to="/dashboard" class="navbar-brand">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            Gestión Comercial
        </RouterLink>

        <ul class="navbar-menu">
            <li>
                <RouterLink to="/dashboard" class="navbar-link" :class="{ active: isActive('dashboard') }">
                    Dashboard
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/clientes" class="navbar-link" :class="{ active: isActive('admin/clientes') }">
                    Clientes
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/productos" class="navbar-link" :class="{ active: isActive('admin/productos') }">
                    Productos
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/pedidos" class="navbar-link" :class="{ active: isActive('admin/pedidos') }">
                    Pedidos
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/inventario" class="navbar-link" :class="{ active: isActive('admin/inventario') }">
                    Inventario
                </RouterLink>
            </li>
        </ul>

        <div class="navbar-user">
            <div class="user-dropdown">
                <button class="user-avatar" @click="toggleDropdown">
                    {{ authStore.userName?.charAt(0).toUpperCase() }}
                </button>
                <div v-if="showDropdown" class="dropdown-menu">
                    <div class="dropdown-header">
                        <div class="user-name-dropdown">{{ authStore.userName }}</div>
                        <div class="user-role-dropdown">{{ authStore.userRole }}</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <RouterLink to="/admin/perfil" class="dropdown-item" @click="showDropdown = false">
                        Perfil
                    </RouterLink>
                    <button class="dropdown-item logout" @click="handleLogout">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)

const isActive = (path) => {
    return route.path.startsWith('/' + path)
}

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const handleLogout = () => {
    showDropdown.value = false
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.navbar {
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    width: 100%;
}

.navbar-brand {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    text-decoration: none;
    font-size: 20px;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.navbar-brand:hover {
    transform: scale(1.05);
}

.navbar-brand svg {
    width: 30px;
    height: 30px;
}

.navbar-menu {
    display: flex;
    gap: 25px;
    list-style: none;
}

.navbar-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
}

.navbar-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.navbar-link.active {
    background-color: rgba(255, 255, 255, 0.3);
    border-bottom: 3px solid white;
}

.navbar-user {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    position: relative;
}

.user-dropdown {
    position: relative;
}

.user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.user-avatar:hover {
    background-color: rgba(255, 255, 255, 0.4);
    border-color: white;
    transform: scale(1.05);
}

.dropdown-menu {
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    min-width: 220px;
    z-index: 1001;
    overflow: hidden;
    animation: slideDown 0.2s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    background: #f9f9f9;
}

.user-name-dropdown {
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.user-role-dropdown {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.dropdown-divider {
    height: 1px;
    background: #e0e0e0;
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: 12px 20px;
    text-decoration: none;
    color: #333;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.dropdown-item:hover {
    background-color: #f5f5f5;
    color: #FF6B35;
    padding-left: 25px;
}

.dropdown-item.logout {
    color: #C62828;
}

.dropdown-item.logout:hover {
    background-color: #ffebee;
    color: #C62828;
}

@media (max-width: 768px) {
    .navbar {
        padding: 0 20px;
    }

    .navbar-menu {
        gap: 15px;
        display: none;
    }

    .navbar-link {
        font-size: 14px;
    }

    .user-info {
        display: none;
    }
}
</style>
