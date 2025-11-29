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
          <span class="icon">—</span>
          <span>Dashboard</span>
        </button>
        <button class="nav-item" @click="goPedidos" type="button">
          <span class="icon">—</span>
          <span>Pedidos</span>
        </button>
        <button class="nav-item" @click="goInventario" type="button">
          <span class="icon">—</span>
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
      <div class="dashboard-header">
        <h1>Dashboard de Ventas</h1>
      </div>

      <!-- Estadísticas generales -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total de Pedidos</p>
            <p class="stat-value">{{ estadisticas.totalVentas?.total_pedidos || 0 }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Ingresos Totales</p>
            <p class="stat-value">${{ parseFloat(estadisticas.totalVentas?.total_ingresos || 0).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Gráficas -->
      <div class="charts-container">
        <!-- Gráfica de compras por hora -->
        <div class="chart-section">
          <h2>Compras por Hora (Últimas 24h)</h2>
          <Chart
            v-if="datosGrafica.labels.length > 0"
            type="line"
            :labels="datosGrafica.labels"
            :datasets="datosGrafica.datasets"
            :options="opcionesGrafica"
          />
          <p v-else class="no-data">No hay datos disponibles</p>
        </div>

        <!-- Gráfica de ventas por producto -->
        <div class="chart-section">
          <h2>Ventas por Producto</h2>
          <Chart
            v-if="datosProductos.labels.length > 0"
            type="bar"
            :labels="datosProductos.labels"
            :datasets="datosProductos.datasets"
            :options="opcionesProductos"
          />
          <p v-else class="no-data">No hay datos disponibles</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Chart from '../components/Chart.vue'
import { pedidoService } from '../services/pedidoService'

const router = useRouter()

const estadisticas = ref({
  totalVentas: null,
  ventasPorProducto: []
})
const statsHora = ref([])

const datosGrafica = computed(() => {
  const porHora = {}
  
  statsHora.value.forEach(stat => {
    const hora = `${String(stat.hora).padStart(2, '0')}:00`
    porHora[hora] = stat.cantidad_pedidos
  })

  const horas = []
  for (let i = 23; i >= 0; i--) {
    horas.push(`${String(i).padStart(2, '0')}:00`)
  }

  return {
    labels: horas,
    datasets: [
      {
        label: 'Cantidad de Pedidos',
        data: horas.map(h => porHora[h] || 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const datosProductos = computed(() => {
  return {
    labels: estadisticas.value.ventasPorProducto.map(p => p.nombre),
    datasets: [
      {
        label: 'Total Vendido ($)',
        data: estadisticas.value.ventasPorProducto.map(p => parseFloat(p.total_ventas)),
        backgroundColor: [
          '#10B981',
          '#34D399',
          '#6EE7B7',
          '#A7F3D0',
          '#CCFBF1'
        ]
      }
    ]
  }
})

const opcionesGrafica = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}

const opcionesProductos = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarDatos = async () => {
  try {
    const [stats, general] = await Promise.all([
      pedidoService.obtenerEstadisticasHora(),
      pedidoService.obtenerEstadisticas()
    ])

    console.log('Stats:', stats)
    console.log('General:', general)

    statsHora.value = stats.stats || []
    estadisticas.value = general
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const goDashboard = () => {
  router.push('/dashboard')
}

const goPedidos = () => {
  router.push('/orders')
}

const goInventario = () => {
  router.push('/admin/inventario')
}

onMounted(() => {
  cargarDatos()
  // Recargar cada 30 segundos
  setInterval(cargarDatos, 30000)
})
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
  z-index: 100;
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
  cursor: pointer;
}

.nav-item:hover,
.nav-item.active {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
}

.nav-item .icon {
  font-size: 18px;
}

.nav-item:focus {
  outline: none;
  box-shadow: none;
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
  margin: 0;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
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
  padding: 32px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

/* Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #10B981;
  margin: 0;
}

/* Charts */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.chart-section h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.no-data {
  text-align: center;
  color: #9ca3af;
  padding: 40px 20px;
  margin: 0;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status.entregado {
  background: #dcfce7;
  color: #166534;
}

.status.pendiente {
  background: #fef3c7;
  color: #92400e;
}

.status.cancelado {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 1024px) {
  .charts-container {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
  }

  .dashboard-header h1 {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .charts-container {
    gap: 20px;
  }

  .dashboard-header h1 {
    font-size: 20px;
  }

  .chart-section {
    padding: 16px;
  }

  .stat-card {
    padding: 16px;
  }
}
</style>
