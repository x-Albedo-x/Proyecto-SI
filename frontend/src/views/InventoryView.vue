<template>
  <div class="inventory-page">
    <NavBar v-if="isCliente" />
    <div class="inventory-container">
      <!-- Sidebar / Header Back -->
      <div class="sidebar">
        <button class="back-btn" @click="goBack">
          <v-icon icon="mdi-arrow-left"/> Volver al Dashboard
        </button>
        <div class="sidebar-content">
          <h2>Administración</h2>
          <p>de Inventario</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <div class="page-header">
          <div>
            <h1>Inventario</h1>
            <p class="subtitle">Gestiona todos los productos disponibles en tu tienda</p>
          </div>
          <button class="add-btn" @click="openModal">
            <v-icon icon="mdi-plus"/> Agregar Producto
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <v-icon icon="mdi-package" class="stat-icon"/>
            <div>
              <p class="stat-label">Total de Productos</p>
              <p class="stat-value">{{ productos.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <v-icon icon="mdi-warehouse" class="stat-icon"/>
            <div>
              <p class="stat-label">Stock Total</p>
              <p class="stat-value">{{ totalStock }}</p>
            </div>
          </div>
          <div class="stat-card">
            <v-icon icon="mdi-currency-usd" class="stat-icon"/>
            <div>
              <p class="stat-label">Valor del Inventario</p>
              <p class="stat-value">${{ totalValue.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in productos" :key="p.producto_id">
                <td><img :src="p.imagen_url" alt="img" class="thumb" /></td>
                <td><strong>{{ p.nombre }}</strong></td>
                <td>{{ p.categoria || '—' }}</td>
                <td>${{ p.precio.toFixed(2) }}</td>
                <td><span class="badge">{{ p.stock }}</span></td>
                <td>${{ (p.precio * p.stock).toFixed(2) }}</td>
                <td class="actions-cell">
                  <button class="action-btn edit" @click="openEdit(p)">Editar</button>
                  <button class="action-btn stock" @click="openStock(p)">Reponer</button>
                  <button class="action-btn delete" @click="removeProduct(p)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <h2 v-if="mode==='create'">Nuevo Producto</h2>
          <h2 v-else-if="mode==='edit'">Editar Producto</h2>
          <h2 v-else>Reponer Stock</h2>
          <form v-if="mode!=='stock'" @submit.prevent="handleSave">
            <div class="grid">
              <label>
                Nombre
                <input v-model="form.nombre" type="text" required />
              </label>
              <label>
                Precio
                <input v-model.number="form.precio" type="number" step="0.01" required />
              </label>
              <label class="full">
                Descripción
                <textarea v-model="form.descripcion" rows="3"></textarea>
              </label>
              <label>
                Categoría
                <input v-model="form.categoria" type="text" />
              </label>
              <label>
                Stock inicial
                <input v-model.number="form.stock" type="number" min="0" />
              </label>
              <label class="full">
                URL de imagen
                <input v-model="form.imagen_url" type="url" />
              </label>
            </div>
            <div class="actions">
              <button type="button" class="secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="primary">Guardar</button>
            </div>
          </form>
          <form v-else @submit.prevent="handleStock">
            <div class="grid">
              <label class="full">
                Cantidad nueva total
                <input v-model.number="stockCantidad" type="number" min="0" required />
              </label>
            </div>
            <div class="actions">
              <button type="button" class="secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="primary">Actualizar Stock</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { productService } from '../services/productService'

const productos = ref([])
const showModal = ref(false)
const mode = ref('create')
const currentId = ref(null)
const form = ref({ nombre: '', descripcion: '', categoria: '', precio: null, stock: 0, imagen_url: '' })
const stockCantidad = ref(0)

const route = useRoute()
const router = useRouter()

// Detectar si es cliente o admin
const isCliente = computed(() => {
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  return user?.tipo === 'cliente'
})

// Cálculos de estadísticas
const totalStock = computed(() => {
  return productos.value.reduce((sum, p) => sum + (p.stock || 0), 0)
})

const totalValue = computed(() => {
  return productos.value.reduce((sum, p) => sum + (p.precio * p.stock || 0), 0)
})

const goBack = () => {
  router.push('/dashboard')
}

const load = async () => {
  const data = await productService.list()
  // Convertir precios a números
  productos.value = data.map(p => ({
    ...p,
    precio: parseFloat(p.precio),
    stock: parseInt(p.stock) || 0
  }))
}

const openModal = () => { mode.value = 'create'; showModal.value = true }
const closeModal = () => { showModal.value = false }

const handleSave = async () => {
  try {
    if (mode.value === 'create') {
      await productService.create(form.value)
    } else if (mode.value === 'edit' && currentId.value) {
      const { nombre, descripcion, categoria, precio, imagen_url } = form.value
      await productService.update(currentId.value, { nombre, descripcion, categoria, precio, imagen_url })
    }
    closeModal()
    form.value = { nombre: '', descripcion: '', categoria: '', precio: null, stock: 0, imagen_url: '' }
    await load()
  } catch (e) {
    alert(e?.message || 'Error al guardar')
  }
}

const handleStock = async () => {
  try {
    if (!currentId.value) return
    await productService.updateStock(currentId.value, stockCantidad.value)
    closeModal()
    stockCantidad.value = 0
    await load()
  } catch (e) {
    alert(e?.message || 'Error al actualizar stock')
  }
}

const openEdit = (p) => {
  mode.value = 'edit'
  currentId.value = p.producto_id
  form.value = { nombre: p.nombre, descripcion: p.descripcion, categoria: p.categoria, precio: p.precio, stock: p.stock, imagen_url: p.imagen_url }
  showModal.value = true
}

const openStock = (p) => {
  mode.value = 'stock'
  currentId.value = p.producto_id
  stockCantidad.value = p.stock
  showModal.value = true
}

const removeProduct = async (p) => {
  if (!confirm(`Eliminar ${p.nombre}?`)) return
  await productService.remove(p.producto_id)
  await load()
}

onMounted(async () => {
  await load()
  if (route.query.open === 'add') {
    showModal.value = true
  }
})
</script>

<style scoped>
.inventory-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f4f8 100%);
  min-height: 100vh;
}

.inventory-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  padding: 40px 24px;
  box-shadow: 2px 0 12px rgba(16, 185, 129, 0.1);
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255, 0.2);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.back-btn:hover {
  background: rgba(255,255,255, 0.3);
}

.sidebar-content {
  margin-top: 40px;
  color: white;
}

.sidebar-content h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.sidebar-content p {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}

/* Main Content */
.main-content {
  margin-left: 280px;
  flex: 1;
  padding: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  margin-top: 8px;
  font-size: 14px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.stat-icon {
  color: #10B981;
  font-size: 28px;
}

.stat-label {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  margin: 8px 0 0 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

/* Table */
.table-wrap {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.inventory-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.inventory-table tbody tr:hover {
  background: #f9fafb;
}

.thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.badge {
  display: inline-block;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: white;
}

.action-btn.edit {
  background: #3b82f6;
}

.action-btn.edit:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transform: translateY(-1px);
}

.action-btn.stock {
  background: #10B981;
}

.action-btn.stock:hover {
  background: #059669;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  transform: translateY(-1px);
}

.action-btn.delete {
  background: #ef4444;
}

.action-btn.delete:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  transform: translateY(-1px);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal {
  width: 600px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.modal h2 {
  margin: 0 0 24px 0;
  font-size: 20px;
  color: #1a1a1a;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.grid .full {
  grid-column: 1 / -1;
}

.grid label {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

input, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary:hover {
  background: #e5e7eb;
}

.primary {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 1024px) {
  .sidebar { width: 0; padding: 0; }
  .main-content { margin-left: 0; padding: 24px; }
  .page-header { flex-direction: column; gap: 16px; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
