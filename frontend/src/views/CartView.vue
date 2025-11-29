<template>
  <div class="cart-page">
    <NavBar />
    
    <div class="cart-container">
      <h1>Mi Carrito</h1>
      
      <!-- Carrito vacío -->
      <div v-if="loading" class="cart-skeleton">
        <SkeletonLoader v-for="n in 3" :key="n" type="list" :avatar="true" :lines="2" :image="true" />
      </div>
      <div v-else-if="cart.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para comenzar tu compra</p>
        <router-link to="/productos" class="btn-continue-shopping">
          Seguir Comprando
        </router-link>
      </div>

      <!-- Carrito con items -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cart.items" :key="item.producto_id" class="cart-item">
            <div class="item-image">
              <img :src="item.imagen_url" :alt="item.nombre" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.nombre }}</h3>
              <p class="item-category">{{ item.categoria }}</p>
              <p class="item-price">${{ item.precio.toFixed(2) }}</p>
            </div>
            
            <div class="item-controls">
              <button @click="decrementar(item.producto_id)" class="qty-btn">−</button>
              <input 
                v-model.number="item.cantidad" 
                type="number" 
                min="1"
                @change="actualizarCantidad(item.producto_id, item.cantidad)"
                class="qty-input"
              />
              <button @click="incrementar(item.producto_id)" class="qty-btn">+</button>
            </div>
            
            <div class="item-subtotal">
              <p class="subtotal-label">Subtotal</p>
              <p class="subtotal-price">${{ (item.precio * item.cantidad).toFixed(2) }}</p>
            </div>
            
            <button 
              @click="eliminarDelCarrito(item.producto_id)"
              class="btn-remove"
              title="Eliminar del carrito"
            >
              ×
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-section">
            <h3>Resumen del Pedido</h3>
            
            <div class="summary-row">
              <span>Subtotal ({{ cart.cartCount }} items)</span>
              <span>${{ cart.cartTotal.toFixed(2) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Envío</span>
              <span class="shipping-cost">Gratis</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ cart.cartTotal.toFixed(2) }}</span>
            </div>
            
            <button class="btn-checkout" @click="procesarCompra" :disabled="procesando">
              {{ procesando ? 'Procesando...' : 'Proceder al Pago' }}
            </button>
            
            <router-link to="/productos" class="btn-continue-shopping-link">
              Seguir Comprando
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { pedidoService } from '../services/pedidoService'
import NavBar from '../components/NavBar.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'

const router = useRouter()
const cartStore = useCartStore()
const cart = computed(() => cartStore)
const procesando = ref(false)
const loading = ref(true)

const incrementar = (productoId) => {
  const item = cart.value.items.find(i => i.producto_id === productoId)
  if (item) {
    cartStore.updateCantidad(productoId, item.cantidad + 1)
  }
}

const decrementar = (productoId) => {
  const item = cart.value.items.find(i => i.producto_id === productoId)
  if (item && item.cantidad > 1) {
    cartStore.updateCantidad(productoId, item.cantidad - 1)
  }
}

const actualizarCantidad = (productoId, cantidad) => {
  if (cantidad < 1) {
    eliminarDelCarrito(productoId)
  } else {
    cartStore.updateCantidad(productoId, cantidad)
  }
}

const eliminarDelCarrito = (productoId) => {
  cartStore.removeFromCart(productoId)
}

const procesarCompra = async () => {
  try {
    procesando.value = true
    
    const resultado = await pedidoService.crearPedido(cart.value.items)
    
    if (resultado.success) {
      alert(`¡Compra realizada! Número de pedido: ${resultado.pedidoId}`)
      cartStore.vaciarCarrito()
      router.push('/')
    }
  } catch (error) {
    console.error('Error al procesar compra:', error)
    alert('Error al procesar la compra. Intenta de nuevo.')
  } finally {
    procesando.value = false
  }
}

// Simular delay al cargar carrito
onMounted(() => {
  setTimeout(() => (loading.value = false), 500)
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8faf9 0%, #ffffff 100%);
  padding-top: 100px;
}

.cart-skeleton {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 20px;
}

.cart-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 2rem;
}

h1 {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 40px;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-cart h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

/* Cart with items */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 150px 120px 50px;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-details h3 {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 16px;
}

.item-category {
  font-size: 13px;
  color: #9ca3af;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #10B981;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px;
  background: #f9fafb;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.qty-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.qty-input {
  width: 50px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.qty-input:focus {
  outline: none;
}

.item-subtotal {
  text-align: right;
}

.subtotal-label {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.subtotal-price {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.btn-remove {
  width: 40px;
  height: 40px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #fecaca;
}

/* Cart Summary */
.cart-summary {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.summary-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.summary-row span:last-child {
  font-weight: 600;
  color: #1a1a1a;
}

.shipping-cost {
  color: #10B981;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.btn-checkout {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-continue-shopping,
.btn-continue-shopping-link {
  display: block;
  text-align: center;
  padding: 12px 20px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-continue-shopping:hover,
.btn-continue-shopping-link:hover {
  background: #e5e7eb;
  color: #1a1a1a;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-container {
    padding: 20px 1rem;
  }

  h1 {
    font-size: 28px;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 12px;
  }

  .item-controls {
    grid-column: 2;
  }

  .item-subtotal,
  .btn-remove {
    grid-column: 2;
  }

  .item-image {
    width: 80px;
    height: 80px;
    grid-row: 1 / 4;
  }
}
</style>
