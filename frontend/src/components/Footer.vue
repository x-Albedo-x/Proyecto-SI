<template>
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
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
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

.footer-main { display: flex; flex-direction: column; }
.footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.footer-logo .logo-text { font-weight: 800; font-size: 14px; line-height: 1.2; }
.footer-description { color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }

.footer-column h4 { font-size: 16px; font-weight: 700; margin-bottom: 20px; color: white; }
.footer-links { list-style: none; padding: 0; margin: 0; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { color: #9ca3af; text-decoration: none; font-size: 14px; transition: color 0.2s ease; }
.footer-links a:hover { color: #10B981; }

.footer-bottom { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; text-align: center; }
.footer-bottom p { color: #9ca3af; font-size: 14px; }

@media (max-width: 1024px) { .footer-content { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .footer-content { grid-template-columns: 1fr; } }
</style>
