<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <svg width="35" height="35" viewBox="0 0 40 40" fill="none">
          <path d="M20 5L25 15L35 17L27.5 24.5L29 35L20 29.5L11 35L12.5 24.5L5 17L15 15L20 5Z" fill="#10B981"/>
        </svg>
        <h2>DUTCH ROOTS</h2>
      </div>

      <nav class="sidebar-nav">
        <button class="nav-item active" @click="goDashboard" type="button">
          <span class="icon"><v-icon icon="mdi-view-dashboard" size="18"/></span>
          <span>Dashboard</span>
        </button>
        <button class="nav-item" @click="goPedidos" type="button">
          <span class="icon"><v-icon icon="mdi-cart" size="18"/></span>
          <span>Pedidos</span>
        </button>
        <button class="nav-item" @click="goInventario" type="button">
          <span class="icon"><v-icon icon="mdi-chart-line" size="18"/></span>
          <span>Inventario</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <img src="https://i.pravatar.cc/40?img=5" alt="Admin" />
          <div>
            <p class="user-name">Admin</p>
            <p class="user-role">Administrador</p>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">Cerrar Sesión</button>
      </div>
    </aside>

    <main class="main-content">
      <div class="welcome-container">
        <h1>Bienvenido al Dashboard</h1>
        <p class="welcome-text">Selecciona una opción en el menú de la izquierda para comenzar</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // Lógica de logout
  router.push('/login')
}

const goDashboard = () => {
  router.push('/dashboard')
}

const goProductos = () => {
  router.push('/productos')
}

const goPedidos = () => {
  // Ruta futura de pedidos; por ahora al dashboard
  router.push('/dashboard')
}

const goInventario = () => {
  router.push('/admin/inventario')
}

const goInventarioAdd = () => {
  router.push({ path: '/admin/inventario', query: { open: 'add' } })
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h2 {
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #6b7280;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  box-shadow: none;
  background: transparent;
}

.nav-item:hover,
.nav-item.active {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
}

.nav-item .icon {
  font-size: 18px;
}
/* Remove focus outline */
.nav-item:focus {
  outline: none;
  box-shadow: none;
}
.quick-actions { margin: 16px 24px; }
.qa-card { display:flex; justify-content: space-between; align-items:center; background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); padding:16px; }
.qa-card h3 { margin:0; }
.qa-actions { display:flex; gap:10px; }
.secondary { background:#f3f4f6; border:none; padding:10px 16px; border-radius:8px; font-weight:600; cursor:pointer; }
.primary { background:#10B981; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; cursor:pointer; }

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: #fee;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #fecaca;
}

.main-content {
  margin-left: 250px;
  flex: 1;
  padding: 24px;
}

.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 80vh;
  text-align: center;
}

.welcome-container h1 {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.welcome-text {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.1);
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .welcome-container {
    min-height: 60vh;
  }

  .welcome-container h1 {
    font-size: 32px;
  }

  .welcome-text {
    font-size: 16px;
  }
}
</style>
