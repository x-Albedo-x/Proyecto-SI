<template>
    <div class="admin-section">
        <div class="page-header">
            <h1>Catálogo de Productos</h1>
            <button class="btn-primary">+ Nuevo Producto</button>
        </div>

        <div class="products-grid">
            <div v-for="producto in productos" :key="producto.id" class="product-card">
                <div class="product-image">IMG</div>
                <h3>{{ producto.nombre }}</h3>
                <p class="description">{{ producto.descripcion }}</p>
                <div class="product-footer">
                    <div class="price">${{ producto.precio }}</div>
                    <div class="actions">
                        <button class="btn-icon">Editar</button>
                        <button class="btn-icon delete">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="productos.length === 0" class="empty">No hay productos</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const productos = ref([
    { id: 1, nombre: 'Laptop HP', descripcion: 'Laptop 15 pulgadas', precio: 12000.00 },
    { id: 2, nombre: 'Mouse Logitech', descripcion: 'Mouse inalámbrico', precio: 350.00 },
    { id: 3, nombre: 'Monitor Samsung', descripcion: 'Monitor 24 pulgadas', precio: 3800.00 }
])
</script>

<style scoped>
.admin-section {
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

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.page-header h1 {
    font-size: 32px;
    color: #333;
}

.btn-primary {
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.product-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
}

.product-image {
    width: 100%;
    height: 160px;
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
}

.product-card h3 {
    padding: 15px 15px 5px;
    font-size: 16px;
    color: #333;
}

.description {
    padding: 0 15px;
    font-size: 13px;
    color: #666;
    min-height: 30px;
}

.product-footer {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e0e0e0;
    background: #f9f9f9;
}

.price {
    font-size: 18px;
    font-weight: bold;
    color: #FF6B35;
}

.actions {
    display: flex;
    gap: 8px;
}

.btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: #e3f2fd;
    color: #1976d2;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn-icon:hover {
    background: #1976d2;
    color: white;
}

.btn-icon.delete {
    background: #ffebee;
    color: #d32f2f;
}

.btn-icon.delete:hover {
    background: #d32f2f;
    color: white;
}

.empty {
    text-align: center;
    padding: 60px 20px;
    color: #999;
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }
}
</style>
