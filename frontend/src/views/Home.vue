<template>
    <div class="home">
        <section class="hero">
            <div class="hero-content">
                <h1>Bienvenido a Gestión Comercial</h1>
                <p>Sistema integral de gestión para tu negocio</p>
                <button class="btn-primary" @click="scrollToFeatures">Explorar Funcionalidades</button>
            </div>
            <div class="hero-illustration">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="illustration">
                    <rect x="50" y="50" width="300" height="200" fill="#FF6B35" opacity="0.1" rx="10"/>
                    <circle cx="200" cy="80" r="30" fill="#FF6B35"/>
                    <rect x="80" y="120" width="240" height="20" fill="#D4845F"/>
                    <rect x="80" y="160" width="240" height="20" fill="#FF6B35" opacity="0.7"/>
                </svg>
            </div>
        </section>

        <section class="features" ref="featuresSection">
            <h2>Funcionalidades Principales</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">Clientes</div>
                    <h3>Gestión de Clientes</h3>
                    <p>Administra información completa de tus clientes, contactos y direcciones.</p>
                    <RouterLink to="/clientes" class="feature-link">Ver Clientes →</RouterLink>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">Productos</div>
                    <h3>Catálogo de Productos</h3>
                    <p>Organiza y mantén actualizado tu catálogo de productos con precios.</p>
                    <RouterLink to="/productos" class="feature-link">Ver Productos →</RouterLink>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">Pedidos</div>
                    <h3>Gestión de Pedidos</h3>
                    <p>Crea, administra y realiza seguimiento de todos tus pedidos.</p>
                    <RouterLink to="/pedidos" class="feature-link">Ver Pedidos →</RouterLink>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">Inventario</div>
                    <h3>Control de Inventario</h3>
                    <p>Monitorea el stock de productos en tiempo real.</p>
                    <RouterLink to="/inventario" class="feature-link">Ver Inventario →</RouterLink>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">Reportes</div>
                    <h3>Reportes y Análisis</h3>
                    <p>Obtén insights sobre el desempeño de tu negocio.</p>
                    <div class="feature-link disabled">Próximamente</div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">Config</div>
                    <h3>Configuración</h3>
                    <p>Personaliza tu sistema según las necesidades de tu negocio.</p>
                    <div class="feature-link disabled">Próximamente</div>
                </div>
            </div>
        </section>

        <section class="stats">
            <div class="stat-card">
                <div class="stat-number">{{ stats.clientes }}</div>
                <div class="stat-label">Clientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ stats.productos }}</div>
                <div class="stat-label">Productos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ stats.pedidos }}</div>
                <div class="stat-label">Pedidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${{ stats.totalVentas }}</div>
                <div class="stat-label">Total Ventas</div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const featuresSection = ref(null)

const stats = ref({
    clientes: 2,
    productos: 3,
    pedidos: 0,
    totalVentas: '0.00'
})

const scrollToFeatures = () => {
    featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.home {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* HERO SECTION */
.hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 80px;
    gap: 60px;
    animation: slideIn 0.6s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-content h1 {
    font-size: 48px;
    margin-bottom: 20px;
    color: #333;
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-content p {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
}

.btn-primary {
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
}

.hero-illustration {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.illustration {
    width: 100%;
    max-width: 400px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

/* FEATURES SECTION */
.features {
    margin-bottom: 80px;
}

.features h2 {
    font-size: 36px;
    text-align: center;
    margin-bottom: 50px;
    color: #333;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.feature-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 30px rgba(255, 107, 53, 0.2);
}

.feature-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.feature-card h3 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
}

.feature-card p {
    color: #666;
    margin-bottom: 20px;
    flex: 1;
}

.feature-link {
    color: #FF6B35;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-block;
}

.feature-link:hover {
    color: #D4845F;
    transform: translateX(5px);
}

.feature-link.disabled {
    color: #ccc;
    cursor: not-allowed;
    pointer-events: none;
}

/* STATS SECTION */
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    padding: 40px;
    border-radius: 12px;
    margin-bottom: 40px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .hero {
        flex-direction: column;
        margin-bottom: 60px;
    }

    .hero-content h1 {
        font-size: 32px;
    }

    .hero-content p {
        font-size: 16px;
    }

    .features h2 {
        font-size: 28px;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .illustration {
        max-width: 300px;
    }

    .stats {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
