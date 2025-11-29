<template>
  <div class="orders-page">
    <AdminSidebar />
    
    <main class="main-content">
      <nav class="top-nav">
        <h1>Pedidos</h1>
      </nav>

      <div class="orders-container">
      <div class="filters">
        <input 
          v-model="filtro" 
          type="text" 
          placeholder="Buscar por ID, nombre, estado o fecha..."
          class="filter-input"
        />
        <button @click="recargarPedidos" class="refresh-btn">Recargar</button>
      </div>

      <div class="table-responsive">
        <table v-if="pedidos.length > 0" class="pedidos-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pedido in pedidosFiltrados" :key="pedido.pedido_id">
              <td>#{{ pedido.pedido_id }}</td>
              <td>{{ pedido.cliente_nombre }}</td>
              <td>${{ parseFloat(pedido.total).toFixed(2) }}</td>
              <td>
                <span class="status" :class="pedido.estado">
                  {{ pedido.estado }}
                </span>
              </td>
              <td>{{ formatDate(pedido.fecha) }}</td>
              <td>
                <button class="action-btn" @click="verDetalles(pedido)">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No hay pedidos registrados</p>
      </div>

      <div v-if="pedidoSeleccionado" class="modal-overlay" @click="pedidoSeleccionado = null">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Detalles del Pedido #{{ pedidoSeleccionado.pedido_id }}</h2>
            <button class="close-btn" @click="pedidoSeleccionado = null">×</button>
          </div>
          
          <div class="modal-body">
            <div class="info-section">
              <p><strong>Cliente:</strong> {{ pedidoSeleccionado.cliente_nombre }}</p>
              <p><strong>Total:</strong> ${{ parseFloat(pedidoSeleccionado.total).toFixed(2) }}</p>
              <p><strong>Estado:</strong> 
                <span class="status" :class="pedidoSeleccionado.estado">
                  {{ pedidoSeleccionado.estado }}
                </span>
              </p>
              <p><strong>Fecha:</strong> {{ formatDate(pedidoSeleccionado.fecha) }}</p>
              <p><strong>Dirección de Envío:</strong> {{ pedidoSeleccionado.direccion_envio }}</p>
            </div>

            <div class="items-section" v-if="pedidoSeleccionado.items">
              <h3>Productos</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in JSON.parse(pedidoSeleccionado.items || '[]')" :key="idx">
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>${{ parseFloat(item.precio_unitario).toFixed(2) }}</td>
                    <td>${{ (item.cantidad * parseFloat(item.precio_unitario)).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import { pedidoService } from '../services/pedidoService'

const router = useRouter()
const pedidos = ref([])
const filtro = ref('')
const pedidoSeleccionado = ref(null)

const pedidosFiltrados = computed(() => {
  if (!filtro.value) return pedidos.value
  
  const termino = filtro.value.toLowerCase()
  return pedidos.value.filter(p => {
    const id = String(p.pedido_id).toLowerCase()
    const nombre = (p.cliente_nombre || '').toLowerCase()
    const estado = (p.estado || '').toLowerCase()
    const fecha = new Date(p.fecha).toLocaleDateString('es-ES').toLowerCase()
    
    return (
      id.includes(termino) ||
      nombre.includes(termino) ||
      estado.includes(termino) ||
      fecha.includes(termino)
    )
  })
})

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

const cargarPedidos = async () => {
  try {
    const result = await pedidoService.obtenerTodosPedidos()
    pedidos.value = result.pedidos || []
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
  }
}

const recargarPedidos = () => {
  cargarPedidos()
}

const verDetalles = (pedido) => {
  pedidoSeleccionado.value = pedido
}

onMounted(() => {
  cargarPedidos()
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
}

.main-content {
  margin-left: 250px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-nav {
  background: white;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.top-nav h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 2rem;
  flex: 1;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.refresh-btn {
  background: #10B981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #059669;
}

.table-responsive {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.pedidos-table {
  width: 100%;
  border-collapse: collapse;
}

.pedidos-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.pedidos-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.pedidos-table tbody tr:hover {
  background: #f9fafb;
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

.status.procesando {
  background: #bfdbfe;
  color: #1e40af;
}

.status.enviado {
  background: #dbeafe;
  color: #0c4a6e;
}

.status.cancelado {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #2563eb;
}

.no-data {
  text-align: center;
  color: #9ca3af;
  padding: 40px 20px;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section p {
  margin: 0 0 12px 0;
  color: #1f2937;
}

.info-section strong {
  color: #1a1a1a;
}

.items-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.items-table th {
  background: #f9fafb;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.items-table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 14px;
}

@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .top-nav h1 {
    font-size: 22px;
  }

  .filters {
    flex-direction: column;
  }

  .pedidos-table th,
  .pedidos-table td {
    padding: 8px;
    font-size: 12px;
  }
}
</style>
