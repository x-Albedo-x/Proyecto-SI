<template>
  <div class="inventory-page">
    <AdminSidebar />
    
    <main class="main-content">
      <nav class="top-nav">
        <h1>Inventario</h1>
        <button class="add-btn" @click="openModal">Agregar Producto</button>
      </nav>

      <div class="inventory-container">
      <div class="filters">
        <input 
          v-model="filtro" 
          type="text" 
          placeholder="Buscar por nombre..."
          class="filter-input"
        />
        <button @click="recargarProductos" class="refresh-btn">Recargar</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total de Productos</p>
            <p class="stat-value">{{ productos.length }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Stock Total</p>
            <p class="stat-value">{{ totalStock }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Valor Inventario</p>
            <p class="stat-value">${{ parseFloat(totalValue).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table v-if="productosFiltrados.length > 0" class="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Valor Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productosFiltrados" :key="producto.producto_id">
              <td>{{ producto.nombre }}</td>
              <td>${{ parseFloat(producto.precio).toFixed(2) }}</td>
              <td>
                <span class="stock-badge" :class="getStockClass(producto.stock)">
                  {{ producto.stock }}
                </span>
              </td>
              <td>${{ (parseFloat(producto.precio) * (producto.stock || 0)).toFixed(2) }}</td>
              <td class="actions-cell">
                <button class="action-btn edit" @click="openEdit(producto)">Editar</button>
                <button class="action-btn stock" @click="openStock(producto)">Reponer</button>
                <button class="action-btn delete" @click="removeProduct(producto)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No hay productos registrados</p>
      </div>
    </div>

    <!-- Modal Agregar/Editar -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ modo === 'create' ? 'Agregar Producto' : 'Editar Producto' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <form @submit.prevent="handleSave" class="modal-body">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" type="text" required />
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="form.descripcion" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio</label>
              <input v-model.number="form.precio" type="number" step="0.01" required />
            </div>

            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.categoria">
                <option value="">Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Imagen URL</label>
              <input v-model="form.imagen_url" type="url" />
            </div>

            <div class="form-group" v-if="modo === 'create'">
              <label>Stock Inicial</label>
              <input v-model.number="form.stock" type="number" min="0" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Reponer Stock -->
    <div v-if="showStockModal" class="modal-overlay" @click="closeStockModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Reponer Stock - {{ productoSeleccionado?.nombre }}</h2>
          <button class="close-btn" @click="closeStockModal">×</button>
        </div>
        
        <form @submit.prevent="handleStock" class="modal-body">
          <div class="form-group">
            <label>Stock Actual: {{ productoSeleccionado?.stock || 0 }}</label>
          </div>

          <div class="form-group">
            <label>Cantidad a Agregar</label>
            <input v-model.number="cantidadStock" type="number" required min="1" />
          </div>

          <div class="form-actions">
            <button type="button" @click="closeStockModal" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Agregar Stock</button>
          </div>
        </form>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import { productService } from '../services/productService'

const router = useRouter()
const productos = ref([])
const filtro = ref('')
const showModal = ref(false)
const showStockModal = ref(false)
const modo = ref('create')
const productoSeleccionado = ref(null)
const cantidadStock = ref(1)
const categorias = ref([])

const form = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  imagen_url: ''
})

const productosFiltrados = computed(() => {
  if (!filtro.value) return productos.value
  
  const termino = filtro.value.toLowerCase()
  return productos.value.filter(p => {
    const nombre = (p.nombre || '').toLowerCase()
    const desc = (p.descripcion || '').toLowerCase()
    return nombre.includes(termino) || desc.includes(termino)
  })
})

const totalStock = computed(() => {
  return productos.value.reduce((sum, p) => sum + (p.stock || 0), 0)
})

const totalValue = computed(() => {
  return productos.value.reduce((sum, p) => sum + (parseFloat(p.precio) * (p.stock || 0)), 0)
})

const getStockClass = (stock) => {
  if (stock <= 5) return 'low'
  if (stock <= 15) return 'medium'
  return 'high'
}

const cargarProductos = async () => {
  try {
    const data = await productService.list()
    console.log('Productos cargados:', data)
    productos.value = data || []
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

const recargarProductos = () => {
  cargarProductos()
}

const openModal = () => {
  modo.value = 'create'
  form.value = { nombre: '', descripcion: '', precio: 0, imagen_url: '', categoria: '', stock: 0 }
  showModal.value = true
}

const openEdit = (producto) => {
  modo.value = 'edit'
  productoSeleccionado.value = producto
  form.value = { ...producto }
  showModal.value = true
}

const openStock = (producto) => {
  productoSeleccionado.value = producto
  cantidadStock.value = 1
  showStockModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = { nombre: '', descripcion: '', precio: 0, imagen_url: '' }
  productoSeleccionado.value = null
}

const closeStockModal = () => {
  showStockModal.value = false
  cantidadStock.value = 1
}

const handleSave = async () => {
  try {
    if (modo.value === 'create') {
      await productService.create(form.value)
    } else {
      await productService.update(productoSeleccionado.value.producto_id, form.value)
    }
    
    cargarProductos()
    closeModal()
    alert('Producto guardado correctamente')
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Error al guardar el producto')
  }
}

const handleStock = async () => {
  try {
    const nuevoStock = (productoSeleccionado.value.stock || 0) + cantidadStock.value
    
    await productService.updateStock(productoSeleccionado.value.producto_id, nuevoStock)
    
    cargarProductos()
    closeStockModal()
    alert('Stock actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar stock:', error)
    alert('Error al actualizar stock')
  }
}

const removeProduct = async (producto) => {
  if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return
  
  try {
    await productService.remove(producto.producto_id)
    
    cargarProductos()
    alert('Producto eliminado')
  } catch (error) {
    console.error('Error al eliminar:', error)
    alert('Error al eliminar')
  }
}

const cargarCategorias = async () => {
  try {
    const data = await productService.categories()
    console.log('Categorías cargadas:', data)
    categorias.value = data || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

onMounted(() => {
  cargarProductos()
  cargarCategorias()
})
</script>

<style scoped>
.inventory-page {
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
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.top-nav h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.add-btn {
  background: #10B981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #059669;
}

.inventory-container {
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
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #10B981;
  margin: 0;
}

.table-responsive {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.inventory-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.inventory-table tbody tr:hover {
  background: #f9fafb;
}

.stock-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.stock-badge.low {
  background: #fee2e2;
  color: #991b1b;
}

.stock-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.stock-badge.high {
  background: #dcfce7;
  color: #166534;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.action-btn.edit {
  background: #3b82f6;
  color: white;
}

.action-btn.edit:hover {
  background: #2563eb;
}

.action-btn.stock {
  background: #f59e0b;
  color: white;
}

.action-btn.stock:hover {
  background: #d97706;
}

.action-btn.delete {
  background: #ef4444;
  color: white;
}

.action-btn.delete:hover {
  background: #dc2626;
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
  max-width: 500px;
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

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  flex: 1;
  padding: 10px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-save {
  flex: 1;
  padding: 10px 16px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: #059669;
}

@media (max-width: 768px) {
  .top-nav {
    flex-wrap: wrap;
    gap: 12px;
  }

  .top-nav h1 {
    flex-basis: 100%;
    font-size: 22px;
  }

  .inventory-container {
    padding: 20px 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .actions-cell {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
