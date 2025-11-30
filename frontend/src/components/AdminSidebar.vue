<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <router-link to="/dashboard" class="logo-link">
        <svg width="35" height="35" viewBox="0 0 40 40" fill="none">
          <path d="M20 5L25 15L35 17L27.5 24.5L29 35L20 29.5L11 35L12.5 24.5L5 17L15 15L20 5Z" fill="#10B981"/>
        </svg>
        <h2>Verde & Raíces</h2>
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <button 
        class="nav-item" 
        :class="{ active: currentRoute === 'dashboard' }" 
        @click="navigate('dashboard')" 
        type="button"
      >
        <span class="icon"></span>
        <span>Dashboard</span>
      </button>
      <button 
        class="nav-item" 
        :class="{ active: currentRoute === 'orders' }" 
        @click="navigate('orders')" 
        type="button"
      >
        <span class="icon"></span>
        <span>Pedidos</span>
      </button>
      <button 
        class="nav-item" 
        :class="{ active: currentRoute === 'inventario' }" 
        @click="navigate('inventario')" 
        type="button"
      >
        <span class="icon"></span>
        <span>Inventario</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <button class="user-profile" @click="goProfile" type="button" :title="`Ver perfil de ${adminUser.nombre}`">
        <img v-if="adminUser?.avatar_url" :src="adminUser.avatar_url" :alt="adminUser?.nombre" />
        <img v-else src="https://i.pravatar.cc/40?img=5" alt="Admin" />
        <div>
          <p class="user-name">{{ adminUser?.nombre || 'Admin' }}</p>
          <p class="user-role">Administrador</p>
        </div>
      </button>
      <button class="logout-btn" @click="handleLogout" type="button">Cerrar Sesión</button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const adminUser = ref({
  nombre: 'Admin',
  avatar_url: ''
})

const currentRoute = computed(() => {
  const name = route.name
  if (name === 'dashboard') return 'dashboard'
  if (name === 'orders') return 'orders'
  if (name === 'admin-inventario' || name === 'inventario') return 'inventario'
  return ''
})

const navigate = (page) => {
  if (page === 'dashboard') router.push('/dashboard')
  if (page === 'orders') router.push('/orders')
  if (page === 'inventario') router.push('/admin/inventario')
}

const goProfile = () => {
  router.push('/perfil')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  adminUser.value = {
    nombre: user.nombre || 'Admin',
    avatar_url: user.avatar_url || ''
  }
})
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.sidebar-nav {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.nav-item.active {
  background: #d1fae5;
  color: #10B981;
}

.nav-item .icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  width: 100%;
  text-align: left;
}

.user-profile:hover {
  background: #f3f4f6;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-profile > div {
  min-width: 0;
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid #fee2e2;
  background: #fef2f2;
  border-radius: 6px;
  color: #dc2626;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fee2e2;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .sidebar-header {
    padding: 16px;
  }

  .sidebar-header h2 {
    font-size: 16px;
  }
}
</style>
