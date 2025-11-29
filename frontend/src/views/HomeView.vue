<template>
  <div class="home">
    <NavBar />
    
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-left">
          <h1 class="hero-title">
            Transforma tu <span class="gradient-text">Jardín<br>Soñado</span> en Realidad
          </h1>
          <p class="hero-subtitle">
            Nuestros jardines son más que simples colecciones de plantas; son obras de arte vivientes. 
            Explora varios estilos de jardín, desde jardines formales clásicos hasta modernos.
          </p>
          <router-link to="/productos" class="cta-btn">Comenzar Ahora</router-link>
        </div>

        <div class="hero-right">
          <div class="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop&crop=entropy" 
              alt="Beautiful garden plants"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="products-section">
      <div class="section-header">
        <h2 class="section-title">Plantas Destacadas</h2>
        <router-link to="/productos" class="view-all">Ver todas</router-link>
      </div>

      <div class="products-grid">
        <ProductCard
          v-for="(product, index) in featuredProducts"
          :key="product.producto_id"
          :product="product"
          :isBestChoice="index === 0"
          @add-to-cart="handleAddToCart"
          @view-details="abrirModal"
        />
      </div>
    </section>

    <!-- Customer Reviews -->
    <section class="reviews-section">
      <h3 class="reviews-title">Top Clientes</h3>
      <div class="review-card">
          <div class="reviewer-images">
            <template v-for="(u, idx) in topClientes" :key="u.cliente_id || idx">
              <img v-if="u.avatar_url" :src="u.avatar_url" :alt="u.nombre || 'Cliente'" />
              <img v-else :src="`https://i.pravatar.cc/60?u=${u.cliente_id || idx}`" :alt="u.nombre || 'Cliente'" />
            </template>
          </div>
      </div>
    </section>

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
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'
import api from '../services/api'
import { useCartStore } from '../stores/cartStore'

const featuredProducts = ref([])
const productoSeleccionado = ref(null)
const cartStore = useCartStore()
const topClientes = ref([])

const cargarProductosDestacados = async () => {
  try {
    const response = await api.get('/productos')
    // Tomar los primeros 4 productos
    const productos = (response.data.productos || []).slice(0, 4)
    // Convertir precios a números
    featuredProducts.value = productos.map(p => ({
      ...p,
      precio: parseFloat(p.precio),
      stock: parseInt(p.stock) || 0
    }))
  } catch (error) {
    console.error('Error al cargar productos destacados:', error)
  }
}

const handleAddToCart = (product) => {
  cartStore.agregarAlCarrito(product, 1)
  cerrarModal()
  alert(`${product.nombre} ha sido agregado al carrito`)
}

const abrirModal = (producto) => {
  productoSeleccionado.value = producto
}

const cerrarModal = () => {
  productoSeleccionado.value = null
}

onMounted(() => {
  cargarProductosDestacados()
  cargarTopClientes()
})

const cargarTopClientes = async () => {
  try {
    const resp = await api.get('/comunidad/comentarios')
    const comentarios = resp.data?.comentarios || []

    // Contar comentarios por usuario (activo = más comentarios)
    const counts = new Map()
    const profiles = new Map()

    for (const c of comentarios) {
      const key = c.cliente_id || c.usuario_id || c.nombre
      if (!key) continue
      counts.set(key, (counts.get(key) || 0) + 1)
      if (!profiles.has(key)) {
        profiles.set(key, {
          cliente_id: c.cliente_id || c.usuario_id || key,
          nombre: c.nombre || 'Usuario',
          avatar_url: c.avatar_url || ''
        })
      }
    }

    // Ordenar por más activos y tomar top 5
    const sortedKeys = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => key)

    topClientes.value = sortedKeys.map(key => profiles.get(key)).filter(Boolean)
  } catch (e) {
    console.error('No se pudieron cargar usuarios de comunidad:', e)
    topClientes.value = []
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8faf9 0%, #ffffff 100%);
}

.hero {
  padding-top: 120px;
  padding-bottom: 60px;
  min-height: auto;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.gradient-text {
  color: #10B981;
}

.hero-subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
  max-width: 500px;
}

.cta-btn {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  text-decoration: none; /* remove underline on router-link */
  display: inline-block; /* keep button-like layout for links */
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
}

.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  width: 550px;
  height: 550px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(16, 185, 129, 0.2),
    0 10px 30px rgba(0, 0, 0, 0.1);
  animation: float 6s ease-in-out infinite;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-image:hover {
  transform: translateY(-10px);
  box-shadow: 
    0 30px 80px rgba(16, 185, 129, 0.3),
    0 15px 40px rgba(0, 0, 0, 0.15);
}

.hero-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  z-index: 1;
  pointer-events: none;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
  transform: scale(1.1);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.products-section {
  max-width: 1400px;
  margin: 60px auto;
  padding: 0 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a1a;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10B981;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none; /* remove underline */
}

.view-all:hover {
  text-decoration: none; /* keep no underline on hover */
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.reviews-section {
  max-width: 1400px;
  margin: 40px auto 60px;
  padding: 0 2rem;
}

.reviews-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.review-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto; /* center the card */
}

.reviewer-images {
  display: flex;
  justify-content: center; /* center avatars */
  gap: 16px;
}

.reviewer-images img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  animation: floatPulse 4.5s ease-in-out infinite;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reviewer-images img:nth-child(1) { animation-delay: 0s; }
.reviewer-images img:nth-child(2) { animation-delay: 0.15s; }
.reviewer-images img:nth-child(3) { animation-delay: 0.3s; }
.reviewer-images img:nth-child(4) { animation-delay: 0.45s; }
.reviewer-images img:nth-child(5) { animation-delay: 0.6s; }

.reviewer-images img:hover {
  transform: translateY(-6px) scale(1.06);
  box-shadow: 0 16px 35px rgba(16,185,129,0.28);
}

@keyframes floatPulse {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.03); }
}

/* Removed text block inside card */

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  color: #FCD34D;
}

.footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 50px 0 20px;
  margin-top: 0;
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
  .hero-content {
    grid-template-columns: 1fr;
  }
  
  .logo-center {
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }

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
