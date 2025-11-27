<template>
    <div class="pedidos">
        <div class="page-header">
            <h1>Gestión de Pedidos</h1>
            <button class="btn-primary" @click="openModal">+ Nuevo Pedido</button>
        </div>

        <div class="pedidos-table">
            <table>
                <thead>
                    <tr>
                        <th>ID Pedido</th>
                        <th>Cliente</th>
                        <th>Vendedor</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pedido in pedidos" :key="pedido.id">
                        <td>{{ pedido.id }}</td>
                        <td>{{ pedido.cliente }}</td>
                        <td>{{ pedido.vendedor }}</td>
                        <td>{{ pedido.fecha }}</td>
                        <td>
                            <span class="estado" :class="pedido.estado">
                                {{ pedido.estado }}
                            </span>
                        </td>
                        <td class="actions">
                            <button class="btn-view">👁</button>
                            <button class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="pedidos.length === 0" class="empty-state">
                <p>No hay pedidos registrados</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const pedidos = ref([])

const openModal = () => {
    alert('Formulario para nuevo pedido')
}
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
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.pedidos-table {
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
    padding: 20px;
    text-align: left;
    font-weight: 600;
    color: #333;
}

td {
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
}

tbody tr:hover {
    background: #fafafa;
}

.estado {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
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
    gap: 10px;
}

.btn-view,
.btn-delete {
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
}

.btn-view {
    background: #e3f2fd;
    color: #1976d2;
}

.btn-view:hover {
    background: #1976d2;
    color: white;
}

.btn-delete {
    background: #ffebee;
    color: #d32f2f;
}

.btn-delete:hover {
    background: #d32f2f;
    color: white;
}

.empty-state {
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
