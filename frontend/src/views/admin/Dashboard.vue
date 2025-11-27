<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <h1>Dashboard</h1>
            <p>Bienvenido, {{ authStore.userName }}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">Clientes</div>
                <div class="stat-content">
                    <div class="stat-number">{{ stats.clientes }}</div>
                    <div class="stat-label">Clientes Registrados</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">Productos</div>
                <div class="stat-content">
                    <div class="stat-number">{{ stats.productos }}</div>
                    <div class="stat-label">Productos</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">Pedidos</div>
                <div class="stat-content">
                    <div class="stat-number">{{ stats.pedidos }}</div>
                    <div class="stat-label">Pedidos Totales</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">Ventas</div>
                <div class="stat-content">
                    <div class="stat-number">${{ stats.totalVentas }}</div>
                    <div class="stat-label">Total Ventas</div>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <section class="chart-card">
                <h2>Ventas por Mes</h2>
                <canvas id="ventasPorMes" ref="ventasCanvas"></canvas>
            </section>

            <section class="chart-card">
                <h2>Distribución de Productos</h2>
                <canvas id="distribucionProductos" ref="productosCanvas"></canvas>
            </section>
        </div>

        <div class="charts-grid">
            <section class="chart-card">
                <h2>Estado de Pedidos</h2>
                <canvas id="estadoPedidos" ref="pedidosCanvas"></canvas>
            </section>

            <section class="chart-card">
                <h2>Ingresos por Categoría</h2>
                <canvas id="ingresosPorCategoria" ref="categoriasCanvas"></canvas>
            </section>
        </div>

        <div class="dashboard-grid">
            <section class="section-card">
                <h2>Pedidos Recientes</h2>
                <table class="mini-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pedido in pedidosRecientes" :key="pedido.id">
                            <td>#{{ pedido.id }}</td>
                            <td>{{ pedido.cliente }}</td>
                            <td>
                                <span class="estado" :class="pedido.estado">
                                    {{ pedido.estado }}
                                </span>
                            </td>
                            <td>${{ pedido.monto }}</td>
                            <td>{{ pedido.fecha }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="section-card">
                <h2>Productos Bajo Stock</h2>
                <div class="product-list">
                    <div v-for="producto in productosBajoStock" :key="producto.id" class="product-item">
                        <div class="product-info">
                            <h3>{{ producto.nombre }}</h3>
                            <p>Stock: <strong>{{ producto.stock }}</strong> unidades</p>
                        </div>
                        <span class="stock-badge">Bajo</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Chart from 'chart.js/auto'

const authStore = useAuthStore()
const ventasCanvas = ref(null)
const productosCanvas = ref(null)
const pedidosCanvas = ref(null)
const categoriasCanvas = ref(null)

let ventasChart = null
let productosChart = null
let pedidosChart = null
let categoriasChart = null

const stats = ref({
    clientes: 25,
    productos: 15,
    pedidos: 42,
    totalVentas: '15250.75'
})

const pedidosRecientes = ref([
    { id: 1001, cliente: 'Juan Pérez', estado: 'Completado', monto: '1250.00', fecha: '2025-11-25' },
    { id: 1002, cliente: 'María López', estado: 'Pendiente', monto: '850.50', fecha: '2025-11-24' },
    { id: 1003, cliente: 'Carlos García', estado: 'Completado', monto: '2100.00', fecha: '2025-11-23' },
    { id: 1004, cliente: 'Ana Martínez', estado: 'Cancelado', monto: '450.00', fecha: '2025-11-22' },
    { id: 1005, cliente: 'Pedro López', estado: 'Completado', monto: '3200.25', fecha: '2025-11-21' }
])

const productosBajoStock = ref([
    { id: 1, nombre: 'Mouse Inalámbrico', stock: 3 },
    { id: 2, nombre: 'Teclado Mecánico', stock: 2 },
    { id: 3, nombre: 'Monitor 4K', stock: 1 },
    { id: 4, nombre: 'Cable HDMI', stock: 4 }
])

onMounted(() => {
    inicializarGraficas()
})

const inicializarGraficas = () => {
    crearGraficaVentas()
    crearGraficaProductos()
    crearGraficaPedidos()
    crearGraficaCategorias()
}

const crearGraficaVentas = () => {
    const ctx = ventasCanvas.value?.getContext('2d')
    if (!ctx) return

    if (ventasChart) ventasChart.destroy()

    ventasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Ventas (USD)',
                    data: [1200, 1800, 1500, 2200, 2800, 3100, 2900, 3500, 3200, 3800, 4200, 3900],
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FF6B35',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#666' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    ticks: { color: '#666' },
                    grid: { display: false }
                }
            }
        }
    })
}

const crearGraficaProductos = () => {
    const ctx = productosCanvas.value?.getContext('2d')
    if (!ctx) return

    if (productosChart) productosChart.destroy()

    productosChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Laptops', 'Mouse', 'Teclados', 'Monitores', 'Cables'],
            datasets: [
                {
                    data: [4, 3, 2, 3, 3],
                    backgroundColor: [
                        '#FF6B35',
                        '#D4845F',
                        '#E8956F',
                        '#F2A87F',
                        '#FFAA8F'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#333',
                        font: { size: 12 },
                        padding: 15
                    }
                }
            }
        }
    })
}

const crearGraficaPedidos = () => {
    const ctx = pedidosCanvas.value?.getContext('2d')
    if (!ctx) return

    if (pedidosChart) pedidosChart.destroy()

    pedidosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Completado', 'Pendiente', 'Cancelado', 'En Preparación'],
            datasets: [
                {
                    label: 'Cantidad de Pedidos',
                    data: [28, 8, 3, 3],
                    backgroundColor: ['#1B5E20', '#FFA726', '#EF5350', '#42A5F5'],
                    borderRadius: 6,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#666' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    ticks: { color: '#666' },
                    grid: { display: false }
                }
            }
        }
    })
}

const crearGraficaCategorias = () => {
    const ctx = categoriasCanvas.value?.getContext('2d')
    if (!ctx) return

    if (categoriasChart) categoriasChart.destroy()

    categoriasChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Hardware', 'Software', 'Accesorios', 'Servicios', 'Consultoría'],
            datasets: [
                {
                    label: 'Ingresos (miles USD)',
                    data: [12, 5, 8, 3, 7],
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    pointBackgroundColor: '#FF6B35',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                r: {
                    ticks: { color: '#666' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    })
}
</script>

<style scoped>
.dashboard {
    padding: 20px;
    background: #FAF8F3;
    min-height: 100vh;
}

.dashboard-header {
    margin-bottom: 30px;
}

.dashboard-header h1 {
    color: #2C3E50;
    font-size: 2.5rem;
    margin-bottom: 5px;
}

.dashboard-header p {
    color: #666;
    font-size: 1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: #fff;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
}

.stat-icon {
    font-size: 1.2rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 15px 20px;
    border-radius: 8px;
    min-width: 100px;
    text-align: center;
}

.stat-content {
    flex: 1;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.95;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.chart-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #F0EBE0;
}

.chart-card h2 {
    color: #2C3E50;
    font-size: 1.3rem;
    margin-bottom: 20px;
    font-weight: 600;
}

.chart-card canvas {
    max-height: 300px;
    width: 100% !important;
    height: auto !important;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.section-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #F0EBE0;
}

.section-card h2 {
    color: #2C3E50;
    font-size: 1.3rem;
    margin-bottom: 20px;
    font-weight: 600;
}

.mini-table {
    width: 100%;
    border-collapse: collapse;
}

.mini-table thead {
    background: #F5F1E8;
}

.mini-table th {
    padding: 12px;
    text-align: left;
    color: #2C3E50;
    font-weight: 600;
    border-bottom: 2px solid #E0D9CE;
    font-size: 0.9rem;
}

.mini-table td {
    padding: 12px;
    border-bottom: 1px solid #E0D9CE;
    color: #555;
    font-size: 0.9rem;
}

.mini-table tr:hover {
    background: #FAF8F3;
}

.estado {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.estado.Completado {
    background: #C8E6C9;
    color: #2E7D32;
}

.estado.Pendiente {
    background: #FFE0B2;
    color: #E65100;
}

.estado.Cancelado {
    background: #FFCDD2;
    color: #C62828;
}

.product-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #F5F1E8;
    border-radius: 8px;
    border-left: 4px solid #FF6B35;
    transition: background 0.3s ease;
}

.product-item:hover {
    background: #EFEBE9;
}

.product-info h3 {
    color: #2C3E50;
    font-size: 1rem;
    margin-bottom: 5px;
    font-weight: 600;
}

.product-info p {
    color: #666;
    font-size: 0.9rem;
}

.stock-badge {
    background: #FF6B35;
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
    }

    .stat-card {
        flex-direction: column;
        text-align: center;
        padding: 15px;
    }

    .charts-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-header h1 {
        font-size: 1.8rem;
    }
}
</style>
