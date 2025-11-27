<template>
    <div class="tienda">
        <div class="tienda-header">
            <h1>Tienda Online</h1>
            <div class="search-bar">
                <input type="text" placeholder="Buscar productos..." v-model="busqueda">
            </div>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label>Ordenar por:</label>
                <select v-model="ordenarPor">
                    <option value="reciente">Más Reciente</option>
                    <option value="precio-asc">Precio: Menor a Mayor</option>
                    <option value="precio-desc">Precio: Mayor a Menor</option>
                    <option value="nombre">Nombre: A-Z</option>
                </select>
            </div>
        </div>

        <div class="products-grid">
            <div v-for="producto in filteredProductos" :key="producto.id" class="product-card">
                    <div class="product-image">{{ producto.imagen || 'IMG' }}</div>
                <h3>{{ producto.nombre }}</h3>
                <p class="description">{{ producto.descripcion }}</p>
                <div class="product-price">${{ producto.precio }}</div>
                <div class="product-stock">
                    <span v-if="producto.stock > 0" class="in-stock">En Stock</span>
                    <span v-else class="out-stock">Agotado</span>
                </div>
                <div class="quantity-selector">
                    <button @click="cantidad[producto.id] = Math.max(1, (cantidad[producto.id] || 1) - 1)">-</button>
                    <input type="number" v-model.number="cantidad[producto.id]" min="1" max="10">
                    <button @click="cantidad[producto.id] = Math.min(10, (cantidad[producto.id] || 1) + 1)">+</button>
                </div>
                <button 
                    @click="addToCart(producto)" 
                    class="btn-add-cart"
                    :disabled="producto.stock === 0"
                >
                    Agregar al Carrito
                </button>
            </div>
        </div>

        <div v-if="filteredProductos.length === 0" class="empty">
            <p>No se encontraron productos</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const busqueda = ref('')
const ordenarPor = ref('reciente')
const cantidad = ref({})

const productos = ref([
    { id: 1, nombre: 'Laptop HP', descripcion: 'Laptop 15 pulgadas', precio: 12000.00, stock: 10, imagen: 'IMG' },
    { id: 2, nombre: 'Mouse Logitech', descripcion: 'Mouse inalámbrico', precio: 350.00, stock: 50, imagen: 'IMG' },
    { id: 3, nombre: 'Monitor Samsung', descripcion: 'Monitor 24 pulgadas', precio: 3800.00, stock: 20, imagen: '🖥' },
    { id: 4, nombre: 'Teclado Mecánico', descripcion: 'Teclado RGB', precio: 1500.00, stock: 15, imagen: '⌨' },
    { id: 5, nombre: 'Auriculares Sony', descripcion: 'Con cancelación de ruido', precio: 2500.00, stock: 8, imagen: '🎧' },
    { id: 6, nombre: 'Webcam Logitech', descripcion: '4K Ultra HD', precio: 800.00, stock: 25, imagen: '📷' }
])

const filteredProductos = computed(() => {
    let filtered = productos.value.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
    )

    if (ordenarPor.value === 'precio-asc') {
        filtered.sort((a, b) => a.precio - b.precio)
    } else if (ordenarPor.value === 'precio-desc') {
        filtered.sort((a, b) => b.precio - a.precio)
    } else if (ordenarPor.value === 'nombre') {
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
    }

    return filtered
})

const addToCart = (producto) => {
    const qty = cantidad.value[producto.id] || 1
    alert(`${qty} ${producto.nombre}(s) agregado(s) al carrito`)
    cantidad.value[producto.id] = 1
}
</script>

<style scoped>
.tienda {
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

.tienda-header {
    margin-bottom: 30px;
}

.tienda-header h1 {
    font-size: 36px;
    color: #333;
    margin-bottom: 20px;
}

.search-bar {
    margin-bottom: 20px;
}

.search-bar input {
    width: 100%;
    max-width: 400px;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.filters {
    margin-bottom: 30px;
}

.filter-group {
    display: flex;
    gap: 15px;
    align-items: center;
}

.filter-group label {
    font-weight: 600;
    color: #333;
}

.filter-group select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.product-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 30px rgba(255, 107, 53, 0.15);
}

.product-image {
    width: 100%;
    height: 180px;
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 70px;
}

.product-card h3 {
    padding: 15px 15px 5px;
    font-size: 18px;
    color: #333;
}

.description {
    padding: 0 15px;
    font-size: 13px;
    color: #666;
    min-height: 30px;
}

.product-price {
    padding: 10px 15px;
    font-size: 22px;
    font-weight: bold;
    color: #FF6B35;
}

.product-stock {
    padding: 0 15px 10px;
}

.in-stock {
    display: inline-block;
    background: #d4edda;
    color: #155724;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.out-stock {
    display: inline-block;
    background: #f8d7da;
    color: #721c24;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.quantity-selector {
    display: flex;
    gap: 5px;
    padding: 10px 15px;
    background: #f9f9f9;
}

.quantity-selector button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    color: #FF6B35;
    transition: all 0.2s ease;
}

.quantity-selector button:hover {
    background: #FF6B35;
    color: white;
    border-color: #FF6B35;
}

.quantity-selector input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
}

.quantity-selector input:focus {
    outline: none;
    border-color: #FF6B35;
}

.btn-add-cart {
    margin: 10px 15px;
    padding: 12px;
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-add-cart:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-add-cart:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty {
    text-align: center;
    padding: 80px 20px;
    color: #999;
    font-size: 18px;
}

@media (max-width: 768px) {
    .tienda-header h1 {
        font-size: 28px;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 15px;
    }

    .search-bar input {
        max-width: 100%;
    }
}
</style>
