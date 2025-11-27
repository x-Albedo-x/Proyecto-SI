<template>
    <nav class="navbar">
        <RouterLink to="/" class="navbar-brand">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            GestióN Comercial
        </RouterLink>

        <ul class="navbar-menu">
            <li>
                <RouterLink to="/" class="navbar-link" :class="{ active: isActive('') }">
                    Inicio
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/clientes" class="navbar-link" :class="{ active: isActive('clientes') }">
                    Clientes
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/productos" class="navbar-link" :class="{ active: isActive('productos') }">
                    Productos
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/pedidos" class="navbar-link" :class="{ active: isActive('pedidos') }">
                    Pedidos
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/inventario" class="navbar-link" :class="{ active: isActive('inventario') }">
                    Inventario
                </RouterLink>
            </li>
        </ul>

        <div class="navbar-user">
            <span>Admin</span>
            <div class="user-avatar">A</div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
    return route.path.startsWith('/' + path) || (path === '' && route.path === '/')
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
    font-size: 24px;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.navbar-brand:hover {
    transform: scale(1.05);
}

.navbar-brand svg {
    width: 35px;
    height: 35px;
}

.navbar-menu {
    display: flex;
    gap: 30px;
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
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.user-avatar:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .navbar {
        padding: 0 20px;
    }

    .navbar-menu {
        gap: 15px;
    }

    .navbar-link {
        font-size: 14px;
        gap: 5px;
    }

    .navbar-brand {
        font-size: 18px;
    }
}
</style>
