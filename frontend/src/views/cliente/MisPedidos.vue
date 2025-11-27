<template>
    <div class="pedidos">
        <h1>Mis Pedidos</h1>

        <div v-if="pedidos.length > 0" class="pedidos-list">
            <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
                <div class="pedido-header">
                    <div class="pedido-id">Pedido #{{ pedido.id }}</div>
                    <span class="pedido-estado" :class="pedido.estado">{{ pedido.estado }}</span>
                </div>

                <div class="pedido-info">
                    <div class="info-item">
                        <span class="label">Fecha:</span>
                        <span>{{ pedido.fecha }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Total:</span>
                        <span class="total">${{ pedido.total }}</span>
                    </div>
                </div>

                <div class="pedido-items">
                    <div v-for="item in pedido.items" :key="item.id" class="pedido-item">
                        <span class="item-name">{{ item.nombre }}</span>
                        <span class="item-qty">x{{ item.cantidad }}</span>
                        <span class="item-price">${{ item.subtotal }}</span>
                    </div>
                </div>

                <div class="pedido-actions">
                    <button class="btn-detail">Ver Detalles</button>
                    <button v-if="pedido.estado === 'completado'" class="btn-reorder">Repetir Pedido</button>
                </div>
            </div>
        </div>

        <div v-else class="pedidos-vacio">
            <div class="empty-icon">Pedidos</div>
            <h2>No tienes pedidos</h2>
            <p>¡Empieza a comprar!</p>
            <RouterLink to="/tienda" class="btn-shop">Ir a la Tienda</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const pedidos = ref([
    {
        id: 1001,
        fecha: '2025-11-15',
        estado: 'completado',
        total: '12350.00',
        items: [
            { id: 1, nombre: 'Laptop HP', cantidad: 1, subtotal: '12000.00' },
            { id: 2, nombre: 'Mouse Logitech', cantidad: 1, subtotal: '350.00' }
        ]
    },
    {
        id: 1002,
        fecha: '2025-11-20',
        estado: 'enviado',
        total: '4300.00',
        items: [
            { id: 3, nombre: 'Monitor Samsung', cantidad: 1, subtotal: '3800.00' },
            { id: 4, nombre: 'Teclado Mecánico', cantidad: 1, subtotal: '1500.00' }
        ]
    }
])
</script>

<style scoped>
.pedidos {
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

.pedidos h1 {
    font-size: 32px;
    color: #333;
    margin-bottom: 30px;
}

.pedidos-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
}

.pedido-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.pedido-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.pedido-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e0e0e0;
}

.pedido-id {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.pedido-estado {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.pedido-estado.pendiente {
    background: #fff3cd;
    color: #856404;
}

.pedido-estado.pagado {
    background: #cfe2ff;
    color: #084298;
}

.pedido-estado.enviado {
    background: #cff4fc;
    color: #055160;
}

.pedido-estado.completado {
    background: #d4edda;
    color: #155724;
}

.pedido-estado.cancelado {
    background: #f8d7da;
    color: #721c24;
}

.pedido-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.info-item .label {
    font-size: 12px;
    color: #999;
    font-weight: 600;
}

.info-item span {
    color: #333;
    font-weight: 500;
}

.info-item .total {
    color: #FF6B35;
    font-size: 18px;
    font-weight: bold;
}

.pedido-items {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 15px;
}

.pedido-item {
    display: grid;
    grid-template-columns: 1fr 60px 80px;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    font-size: 13px;
}

.pedido-item:last-child {
    border-bottom: none;
}

.item-name {
    color: #333;
    font-weight: 500;
}

.item-qty {
    text-align: center;
    color: #666;
}

.item-price {
    text-align: right;
    color: #FF6B35;
    font-weight: 600;
}

.pedido-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.btn-detail,
.btn-reorder,
.btn-shop {
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: block;
    text-align: center;
}

.btn-detail {
    background: #e3f2fd;
    color: #1976d2;
}

.btn-detail:hover {
    background: #1976d2;
    color: white;
}

.btn-reorder {
    background: #FF6B35;
    color: white;
}

.btn-reorder:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.pedidos-vacio {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
}

.pedidos-vacio h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.pedidos-vacio p {
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
}

.btn-shop {
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    max-width: 200px;
    margin: 0 auto;
}

.btn-shop:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
    .pedidos-list {
        grid-template-columns: 1fr;
    }

    .pedido-actions {
        grid-template-columns: 1fr;
    }
}
</style>
