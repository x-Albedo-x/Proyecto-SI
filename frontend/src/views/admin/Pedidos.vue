<template>
    <div class="admin-section">
        <div class="page-header">
            <h1>Gestión de Pedidos</h1>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pedido in pedidos" :key="pedido.id">
                        <td>#{{ pedido.id }}</td>
                        <td>{{ pedido.cliente }}</td>
                        <td>{{ pedido.fecha }}</td>
                        <td>
                            <span class="estado" :class="pedido.estado">
                                {{ pedido.estado }}
                            </span>
                        </td>
                        <td>${{ pedido.total }}</td>
                        <td class="actions">
                            <button class="btn-icon view">👁</button>
                            <button class="btn-icon delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="pedidos.length === 0" class="empty">No hay pedidos</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const pedidos = ref([])
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

.estado {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.estado.pendiente {
    background: #fff3cd;
    color: #856404;
}

.estado.completado {
    background: #d4edda;
    color: #155724;
}

.estado.cancelado {
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
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn-icon.view {
    background: #e3f2fd;
    color: #1976d2;
}

.btn-icon.view:hover {
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
    padding: 40px;
    text-align: center;
    color: #999;
}

@media (max-width: 768px) {
    table {
        font-size: 14px;
    }

    th, td {
        padding: 10px;
    }
}
</style>
