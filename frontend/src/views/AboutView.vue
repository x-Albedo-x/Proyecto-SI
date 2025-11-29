<template>
  <div class="about-page">
    <NavBar />
    
    <div class="about-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>Sobre Verde & Raíces</h1>
          <p>Tu tienda de confianza para plantas y naturaleza</p>
        </div>
      </section>

      <!-- Misión Section -->
      <section class="section">
        <div class="section-content">
          <div class="section-text">
            <h2>Nuestra Misión</h2>
            <p>En Verde & Raíces, creemos que la naturaleza es esencial para la vida. Nuestro objetivo es acercar la belleza y los beneficios de las plantas a cada hogar, creando espacios verdes que transforman vidas y mejoran la calidad del aire.</p>
            <p>Nos comprometemos a ofrecer plantas de la más alta calidad, asesoramiento experto y un servicio amable que haga que cuidar tus plantas sea fácil y gratificante.</p>
          </div>
          <div class="section-image">
            <svg viewBox="0 0 300 300" fill="none">
              <circle cx="150" cy="150" r="140" stroke="#10B981" stroke-width="2" fill="#F0FDF4"/>
              <path d="M150 80V220M80 150H220" stroke="#10B981" stroke-width="2"/>
              <circle cx="150" cy="150" r="30" fill="#34D399"/>
              <path d="M120 200C120 180 135 165 150 165C165 165 180 180 180 200" fill="#10B981" opacity="0.3"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- Visión Section -->
      <section class="section section-alt">
        <div class="section-content">
          <div class="section-image">
            <svg viewBox="0 0 300 300" fill="none">
              <rect x="50" y="50" width="200" height="200" stroke="#059669" stroke-width="2" rx="10" fill="#F0FDF4"/>
              <circle cx="150" cy="120" r="25" fill="#10B981"/>
              <path d="M100 150H200" stroke="#34D399" stroke-width="2"/>
              <path d="M110 170H190" stroke="#34D399" stroke-width="2"/>
              <path d="M120 190H180" stroke="#34D399" stroke-width="2"/>
            </svg>
          </div>
          <div class="section-text">
            <h2>Nuestra Visión</h2>
            <p>Ser la tienda de plantas más confiable y amigable del país, donde cada cliente encuentre no solo productos de calidad, sino también conocimiento, inspiración y comunidad.</p>
            <p>Queremos que Verde & Raíces sea sinónimo de sustentabilidad, responsabilidad ambiental y amor por la naturaleza.</p>
          </div>
        </div>
      </section>

      <!-- Valores Section -->
      <section class="section">
        <h2 style="text-align: center; margin-bottom: 40px;">Nuestros Valores</h2>
        <div class="valores-grid">
          <div class="valor-card">
            <div class="valor-icon">🌱</div>
            <h3>Sostenibilidad</h3>
            <p>Cuidamos el medio ambiente en cada aspecto de nuestro negocio</p>
          </div>
          <div class="valor-card">
            <div class="valor-icon">❤️</div>
            <h3>Pasión</h3>
            <p>Amamos lo que hacemos y eso se refleja en nuestro servicio</p>
          </div>
          <div class="valor-card">
            <div class="valor-icon">🤝</div>
            <h3>Comunidad</h3>
            <p>Creemos en crear conexiones auténticas con nuestros clientes</p>
          </div>
          <div class="valor-card">
            <div class="valor-icon">✨</div>
            <h3>Calidad</h3>
            <p>Ofrecemos solo lo mejor en plantas, productos y servicio</p>
          </div>
        </div>
      </section>

      <!-- Por qué elegirnos -->
      <section class="section section-alt">
        <h2 style="text-align: center; margin-bottom: 40px;">¿Por qué elegirnos?</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-number">1</div>
            <h3>Plantas de Calidad</h3>
            <p>Seleccionamos cuidadosamente cada planta para garantizar que llegue a tu hogar en perfectas condiciones</p>
          </div>
          <div class="feature-item">
            <div class="feature-number">2</div>
            <h3>Asesoramiento Experto</h3>
            <p>Nuestro equipo te ayuda a elegir la planta perfecta según tu espacio y experiencia</p>
          </div>
          <div class="feature-item">
            <div class="feature-number">3</div>
            <h3>Comunidad Activa</h3>
            <p>Únete a nuestra comunidad para compartir experiencias y aprender de otros amantes de las plantas</p>
          </div>
          <div class="feature-item">
            <div class="feature-number">4</div>
            <h3>Envios Seguros</h3>
            <p>Empaques especiales que protegen tus plantas durante el transporte</p>
          </div>
        </div>
      </section>

      <!-- Contacto CTA -->
      <section class="cta-section">
        <h2>¿Listo para empezar tu jardín?</h2>
        <p>Descubre nuestra amplia selección de plantas y accesorios</p>
        <router-link to="/productos" class="cta-button">Ver Productos</router-link>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes breathe {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.about-page {
  min-height: 100vh;
  background: #fff;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 130px 20px 0 20px;
}

.hero-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  text-align: center;
  margin-bottom: 60px;
  margin-left: -20px;
  margin-right: -20px;
  animation: slideInDown 0.8s ease-out;
}

.hero-content h1 {
  font-size: 3rem;
  margin: 0 0 20px 0;
  font-weight: 700;
  animation: slideInDown 0.8s ease-out 0.2s both;
}

.hero-content p {
  font-size: 1.3rem;
  margin: 0;
  opacity: 0.95;
  animation: slideInDown 0.8s ease-out 0.4s both;
}

.section {
  padding: 60px 20px;
  margin-bottom: 40px;
  animation: fadeIn 0.8s ease-out;
}

.section-alt {
  background: #F0FDF4;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.section-text h2 {
  font-size: 2rem;
  color: #10B981;
  margin-bottom: 20px;
  font-weight: 700;
  animation: slideInUp 0.6s ease-out;
}

.section-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 15px;
  animation: slideInUp 0.6s ease-out 0.1s both;
}

.section-image {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: float 6s ease-in-out infinite;
}

.section-image svg {
  width: 100%;
  max-width: 300px;
  height: auto;
  animation: breathe 4s ease-in-out infinite;
}

.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.valor-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  animation: slideInUp 0.6s ease-out both;
}

.valor-card:nth-child(1) {
  animation-delay: 0s;
}

.valor-card:nth-child(2) {
  animation-delay: 0.1s;
}

.valor-card:nth-child(3) {
  animation-delay: 0.2s;
}

.valor-card:nth-child(4) {
  animation-delay: 0.3s;
}

.valor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
}

.valor-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  animation: breathe 4s ease-in-out infinite;
}

.valor-card h3 {
  font-size: 1.3rem;
  color: #10B981;
  margin-bottom: 10px;
}

.valor-card p {
  color: #6B7280;
  font-size: 0.95rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
}

.feature-item {
  background: white;
  padding: 30px;
  border-radius: 12px;
  border-left: 4px solid #10B981;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.6s ease-out both;
}

.feature-item:nth-child(1) {
  animation-delay: 0s;
}

.feature-item:nth-child(2) {
  animation-delay: 0.1s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(4) {
  animation-delay: 0.3s;
}

.feature-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #10B981;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 15px;
  animation: breathe 4s ease-in-out infinite;
}

.feature-item h3 {
  font-size: 1.2rem;
  color: #111827;
  margin-bottom: 10px;
}

.feature-item p {
  color: #6B7280;
  font-size: 0.95rem;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  border-radius: 12px;
  margin: 60px 20px;
  animation: slideInUp 0.8s ease-out;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.cta-section h2 {
  font-size: 2.2rem;
  margin: 0 0 15px 0;
  font-weight: 700;
  animation: slideInDown 0.8s ease-out 0.2s both;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #10B981;
  padding: 14px 40px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1.05rem;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .section-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .valores-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .section {
    padding: 40px 20px;
  }

  .cta-section {
    margin: 40px 20px;
    padding: 40px 20px;
  }
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
