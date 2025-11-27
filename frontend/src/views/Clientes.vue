<template>
    <div class="clientes">
        <div class="page-header">
            <h1>Gestión de Clientes</h1>
            <button class="btn-primary" @click="openModal">+ Nuevo Cliente</button>
        </div>

        <div class="clients-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clientes" :key="cliente.id">
                        <td>{{ cliente.id }}</td>
                        <td>{{ cliente.nombre }}</td>
                        <td>{{ cliente.telefono }}</td>
                        <td>{{ cliente.direccion }}</td>
                        <td class="actions">
                            <button class="btn-edit">Editar</button>
                            <button class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="clientes.length === 0" class="empty-state">
                <p>No hay clientes registrados</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const clientes = ref([
    { id: 1, nombre: 'Juan Pérez', telefono: '555-123-4567', direccion: 'Av. Principal 123' },
    { id: 2, nombre: 'María López', telefono: '555-987-6543', direccion: 'Calle Secundaria 456' }
])

const openModal = () => {
    alert('Formulario para nuevo cliente')
}
</script>

<style scoped>
.clientes {
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
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.clients-table {
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

.actions {
    display: flex;
    gap: 10px;
}

.btn-edit,
.btn-delete {
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
}

.btn-edit {
    background: #C8E6C9;
    color: #1B5E20;
}

.btn-edit:hover {
    background: #1B5E20;
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
