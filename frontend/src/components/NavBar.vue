<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 5L25 15L35 17L27.5 24.5L29 35L20 29.5L11 35L12.5 24.5L5 17L15 15L20 5Z" fill="#10B981"/>
          <path d="M20 10C15 15 12 20 12 25C12 30 15 33 20 35C25 33 28 30 28 25C28 20 25 15 20 10Z" fill="#34D399"/>
        </svg>
        <span class="logo-text">DUTCH<br>ROOTS</span>
      </router-link>

      <ul class="nav-menu">
        <li><router-link to="/" class="nav-link">Inicio</router-link></li>
        <li><router-link to="/productos" class="nav-link">Productos</router-link></li>
        <li><router-link to="/about" class="nav-link">Sobre Nosotros</router-link></li>
        <li><router-link to="/contact" class="nav-link">Contacto</router-link></li>
      </ul>

      <!-- Si no está logueado -->
      <button v-if="!isLoggedIn" class="book-btn" @click="goToLogin">Iniciar Sesión</button>

      <!-- Si está logueado -->
      <div v-else class="user-menu-container">
        <div class="user-profile-trigger" @click="toggleMenu">
          <div class="user-avatar-small">
            <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.nombre" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <span class="user-name">{{ userName }}</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            :class="{ rotated: showMenu }"
            class="dropdown-arrow"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <div v-if="showMenu" class="dropdown-menu">
          <div class="menu-header">
            <div class="user-avatar-large">
              <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.nombre" />
              <span v-else>{{ userInitial }}</span>
            </div>
            <div class="user-info">
              <p class="user-full-name">{{ user.nombre }}</p>
              <p class="user-email">{{ userEmail }}</p>
            </div>
          </div>
          
          <div class="menu-divider"></div>
          
          <button class="menu-item" @click="goToProfile">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Mi Perfil</span>
          </button>
          <button class="menu-item" @click="goToCart">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Carrito</span>
          </button>
          
          <div class="menu-divider"></div>
          
          <button class="menu-item logout" @click="handleLogout">
            <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const showMenu = ref(false)
const user = ref(null)

const isLoggedIn = computed(() => authService.isAuthenticated())

const userInitial = computed(() => {
  if (user.value && user.value.nombre) {
    return user.value.nombre.charAt(0).toUpperCase()
  }
  return 'U'
})

const userName = computed(() => {
  if (user.value && user.value.nombre) {
    // Obtener solo el primer nombre
    return user.value.nombre.split(' ')[0]
  }
  return 'Usuario'
})

const userEmail = computed(() => {
  if (user.value && user.value.correo) {
    return user.value.correo
  }
  return ''
})

onMounted(() => {
  if (isLoggedIn.value) {
    user.value = authService.getCurrentUser()
  }
  
  // Escuchar cambios de avatar por evento
  window.addEventListener('userAvatarUpdated', (e) => {
    if (user.value) {
      user.value.avatar_url = e.detail.avatar
    }
  })
  
  // Escuchar cambios en localStorage (para sincronizar entre tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'user' && e.newValue) {
      user.value = JSON.parse(e.newValue)
    }
  })
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const goToLogin = () => {
  router.push('/login')
}

const goToProfile = () => {
  showMenu.value = false
  router.push('/perfil')
}

const goToCart = () => {
  showMenu.value = false
  router.push('/cart')
}

const handleLogout = () => {
  showMenu.value = false
  authService.logout()
  user.value = null
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
}

.logo-text {
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
  color: #1a1a1a;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #10B981;
}

.book-btn {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.book-btn:active {
  transform: translateY(0);
}

.user-menu-container {
  position: relative;
}

.user-profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-profile-trigger:hover {
  border-color: #10B981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

.user-avatar-small {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  overflow: hidden;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  letter-spacing: -0.01em;
}

.dropdown-arrow {
  color: #6b7280;
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 58px;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
  min-width: 260px;
  overflow: hidden;
  animation: slideDown 0.25s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-header {
  padding: 20px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-bottom: 1px solid #d1fae5;
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  flex-shrink: 0;
  overflow: hidden;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-full-name {
  font-weight: 600;
  font-size: 15px;
  color: #111827;
  margin: 0 0 3px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
}

.menu-item {
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #374151;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
}

.menu-item:hover {
  background: #f9fafb;
  color: #10B981;
}

.menu-item:active {
  background: #f3f4f6;
}

.menu-item.logout {
  color: #dc2626;
}

.menu-item.logout:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.menu-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.menu-item:hover .menu-icon {
  opacity: 1;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}
</style>
