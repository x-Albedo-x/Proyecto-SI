<template>
    <div class="admin-section">
        <div class="page-header">
            <h1>Control de Inventario</h1>
            <button class="btn-primary">+ Ajustar Stock</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Valor Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in inventario" :key="item.id">
                        <td>{{ item.producto }}</td>
                        <td>${{ item.precio }}</td>
                        <td>{{ item.cantidad }}</td>
                        <td>${{ (item.cantidad * item.precio).toFixed(2) }}</td>
                        <td>
                            <span class="status" :class="getStatus(item.cantidad)">
                                {{ getStatusText(item.cantidad) }}
                            </span>
                        </td>
                        <td class="actions">
                            <button class="btn-icon edit">Editar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="inventario.length === 0" class="empty">No hay productos</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const inventario = ref([
    { id: 1, producto: 'Laptop HP', precio: 12000.00, cantidad: 10 },
    { id: 2, producto: 'Mouse Logitech', precio: 350.00, cantidad: 50 },
    { id: 3, producto: 'Monitor Samsung', precio: 3800.00, cantidad: 20 }
])

const getStatus = (cantidad) => {
    if (cantidad > 20) return 'alto'
    if (cantidad > 5) return 'bajo'
    return 'critico'
}

const getStatusText = (cantidad) => {
    if (cantidad > 20) return 'Stock Alto'
    if (cantidad > 5) return 'Stock Bajo'
    return 'Stock Crítico'
}
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
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: #f5f7fa;
    border-bottom: 2px solid #e0e0e0;
}

th {
    padding: 15px 20px;
    text-align: left;
    font-weight: 600;
    color: #333;
}

td {
    padding: 12px 20px;
    border-bottom: 1px solid #e0e0e0;
}

tbody tr:hover {
    background: #fafafa;
}

.status {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status.alto {
    background: #d4edda;
    color: #155724;
}

.status.bajo {
    background: #fff3cd;
    color: #856404;
}

.status.critico {
    background: #f8d7da;
    color: #721c24;
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

.empty {
    padding: 40px;
    text-align: center;
    color: #999;
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
    }

    table {
        font-size: 14px;
    }

    th, td {
        padding: 10px;
    }
}
</style>
