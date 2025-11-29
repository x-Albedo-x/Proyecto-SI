<template>
  <div class="productos-page">
    <NavBar />
    
    <div class="productos-container">
      <!-- Sidebar con filtros -->
      <aside class="filters-sidebar">
        <div class="filter-section">
          <h3 class="filter-title">Búsqueda</h3>
          <input 
            v-model="filtros.busqueda" 
            type="text" 
            placeholder="Buscar productos..."
            class="search-input"
            @input="aplicarFiltros"
          />
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Categoría</h3>
          <div class="filter-options">
            <label class="filter-option">
              <input 
                type="radio" 
                v-model="filtros.categoria" 
                value=""
                @change="aplicarFiltros"
              />
              <span>Todas</span>
            </label>
            <label v-for="cat in categorias" :key="cat" class="filter-option">
              <input 
                type="radio" 
                v-model="filtros.categoria" 
                :value="cat"
                @change="aplicarFiltros"
              />
              <span>{{ cat }}</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Rango de Precio</h3>
          <div class="price-inputs">
            <input 
              v-model.number="filtros.precioMin" 
              type="number" 
              placeholder="Mín"
              class="price-input"
              @input="aplicarFiltros"
            />
            <span class="price-separator">-</span>
            <input 
              v-model.number="filtros.precioMax" 
              type="number" 
              placeholder="Máx"
              class="price-input"
              @input="aplicarFiltros"
            />
          </div>
        </div>

        <button @click="limpiarFiltros" class="clear-filters-btn">
          Limpiar Filtros
        </button>
      </aside>

      <!-- Contenido principal -->
      <main class="productos-main">
        <!-- Barra de navegación superior -->
        <div class="productos-header">
          <div class="header-info">
            <h1>Nuestros Productos</h1>
            <p class="productos-count">{{ productos.length }} productos encontrados</p>
          </div>
          
          <div class="header-controls">
            <div class="sort-container">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sort-icon">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
              <select v-model="filtros.ordenar" @change="aplicarFiltros" class="sort-select">
                <option value="">Ordenar por</option>
                <option value="precio_asc">Precio: Menor a Mayor</option>
                <option value="precio_desc">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Grid de productos -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="productos.length === 0" class="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
          <div class="empty-actions">
            <button class="seed-btn" @click="mostrarInstruccionesSeed = true">Crear productos de ejemplo</button>
          </div>
          <div v-if="mostrarInstruccionesSeed" class="seed-instructions">
            <p>Para cargar productos de ejemplo, ejecuta:</p>
            <pre><code>cd backend
npm run seed:products</code></pre>
            <p>Luego recarga esta página.</p>
          </div>
        </div>

        <div v-else class="productos-grid">
          <div 
            v-for="producto in productos" 
            :key="producto.producto_id" 
            class="producto-card"
            @click="abrirModal(producto)"
          >
            <div class="producto-image">
              <img :src="producto.imagen_url" :alt="producto.nombre" />
              <span v-if="producto.stock < 10" class="stock-badge">
                {{ producto.stock > 0 ? 'Últimas unidades' : 'Agotado' }}
              </span>
            </div>
            
            <div class="producto-info">
              <h3 class="producto-nombre">{{ producto.nombre }}</h3>
              <p class="producto-descripcion">{{ producto.descripcion }}</p>
              
              <div class="producto-footer">
                <span class="producto-precio">${{ producto.precio.toFixed(2) }}</span>
                <button 
                  @click.stop="agregarAlCarrito(producto)" 
                  class="add-to-cart-btn"
                  :disabled="producto.stock === 0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {{ producto.stock === 0 ? 'Agotado' : 'Agregar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-column footer-main">
          <div class="footer-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L25 15L35 17L27.5 24.5L29 35L20 29.5L11 35L12.5 24.5L5 17L15 15L20 5Z" fill="#10B981"/>
              <path d="M20 10C15 15 12 20 12 25C12 30 15 33 20 35C25 33 28 30 28 25C28 20 25 15 20 10Z" fill="#34D399"/>
            </svg>
            <span class="logo-text">Verde & Raíces</span>
          </div>
          <p class="footer-description">
            Tu tienda de confianza para plantas y naturaleza.
          </p>
        </div>

        <div class="footer-column">
          <h4>Navegación</h4>
          <ul class="footer-links">
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/productos">Productos</router-link></li>
            <li><router-link to="/comunidad">Comunidad</router-link></li>
            <li><router-link to="/about">Sobre Nosotros</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Contacto</h4>
          <ul class="footer-links">
            <li>📍 Calle Jardín 123</li>
            <li>📞 +1 234 567 890</li>
            <li>✉️ info@verdeyraices.com</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2025 Verde & Raíces. Todos los derechos reservados.</p>
      </div>
    </footer>

    <!-- Product Detail Modal -->
    <ProductModal 
      :producto="productoSeleccionado"
      @close="cerrarModal"
      @add-to-cart="agregarAlCarrito"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import ProductModal from '../components/ProductModal.vue'
import api from '../services/api'
import { useCartStore } from '../stores/cartStore'

const productos = ref([])
const categorias = ref([])
const loading = ref(false)
const mostrarInstruccionesSeed = ref(false)
const productoSeleccionado = ref(null)
const cartStore = useCartStore()

const filtros = ref({
  busqueda: '',
  categoria: '',
  precioMin: null,
  precioMax: null,
  ordenar: ''
})

const cargarProductos = async () => {
  try {
    loading.value = true
    
    const params = {}
    if (filtros.value.busqueda) params.busqueda = filtros.value.busqueda
    if (filtros.value.categoria) params.categoria = filtros.value.categoria
    if (filtros.value.precioMin) params.precioMin = filtros.value.precioMin
    if (filtros.value.precioMax) params.precioMax = filtros.value.precioMax
    if (filtros.value.ordenar) params.ordenar = filtros.value.ordenar
    
    const response = await api.get('/productos', { params })
    console.log('Respuesta de productos:', response.data)
    // Convertir precios a números
    productos.value = (response.data.productos || []).map(p => ({
      ...p,
      precio: parseFloat(p.precio),
      stock: parseInt(p.stock) || 0
    }))
  } catch (error) {
    console.error('Error al cargar productos:', error)
    productos.value = []
  } finally {
    loading.value = false
  }
}

const cargarCategorias = async () => {
  try {
    const response = await api.get('/productos/categorias')
    console.log('Respuesta de categorías:', response.data)
    categorias.value = response.data.categorias || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    categorias.value = []
  }
}

const aplicarFiltros = () => {
  cargarProductos()
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    categoria: '',
    precioMin: null,
    precioMax: null,
    ordenar: ''
  }
  cargarProductos()
}

const agregarAlCarrito = (producto) => {
  cartStore.agregarAlCarrito(producto, 1)
  cerrarModal()
  // Mostrar notificación de éxito
  alert(`${producto.nombre} ha sido agregado al carrito`)
}

const abrirModal = (producto) => {
  productoSeleccionado.value = producto
  document.body.style.overflow = 'hidden'
}

const cerrarModal = () => {
  productoSeleccionado.value = null
  document.body.style.overflow = 'auto'
}

onMounted(() => {
  cargarProductos()
  cargarCategorias()
})
</script>

<style scoped>
.productos-page {
  min-height: 100vh;
  background: #f9fafb;
}

.productos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 100px 2rem 3rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

/* Sidebar de filtros */
.filters-sidebar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-section:last-of-type {
  border-bottom: none;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
  transition: color 0.2s ease;
}

.filter-option:hover {
  color: #10B981;
}

.filter-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10B981;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
}

.price-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.price-input:focus {
  outline: none;
  border-color: #10B981;
}

.price-separator {
  color: #9ca3af;
  font-weight: 600;
  padding: 0 4px;
}

.clear-filters-btn {
  width: 100%;
  padding: 10px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Contenido principal */
.productos-main {
  min-height: 400px;
}

.productos-header {
  background: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.productos-count {
  font-size: 14px;
  color: #6b7280;
}

.sort-select {
  padding: 8px 12px 8px 32px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding-right: 12px;
}

.sort-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 180px;
}

.sort-icon {
  position: absolute;
  left: 8px;
  pointer-events: none;
  color: #6b7280;
  z-index: 1;
}

.sort-select:focus {
  outline: none;
  border-color: #10B981;
}

/* Estados de carga y vacío */
.loading {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #f3f4f6;
  border-top-color: #10B981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state svg {
  margin: 0 auto 20px;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 8px;
}

/* Grid de productos */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.producto-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.producto-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.producto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.producto-card:hover .producto-image img {
  transform: scale(1.05);
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.producto-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.producto-nombre {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.producto-descripcion {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.producto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.producto-precio {
  font-size: 24px;
  font-weight: 700;
  color: #10B981;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.add-to-cart-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

@media (max-width: 968px) {
  .productos-container {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    position: static;
  }
  
  .price-inputs {
    grid-template-columns: 1fr 28px 1fr;
  }
  
  .productos-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}

.producto-card {
  cursor: pointer;
}

.producto-card:hover {
  cursor: pointer;
}

/* Footer Styles */
.footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 50px 0 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-main {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-logo .logo-text {
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
}

.footer-description {
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 20px;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #10B981;
  transform: translateY(-3px);
}

.footer-column h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #10B981;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  text-align: center;
}

.footer-bottom p {
  color: #9ca3af;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
