<template>
    <div class="admin-section">
        <div class="page-header">
            <h1>Gestión de Clientes</h1>
            <button class="btn-primary">+ Nuevo Cliente</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clientes" :key="cliente.id">
                        <td>#{{ cliente.id }}</td>
                        <td>{{ cliente.nombre }}</td>
                        <td>{{ cliente.correo }}</td>
                        <td>{{ cliente.telefono }}</td>
                        <td>{{ cliente.direccion }}</td>
                        <td class="actions">
                            <button class="btn-icon edit">Editar</button>
                            <button class="btn-icon delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="clientes.length === 0" class="empty">No hay clientes</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const clientes = ref([
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@correo.com', telefono: '555-123-4567', direccion: 'Av. Principal 123' },
    { id: 2, nombre: 'María López', correo: 'maria@correo.com', telefono: '555-987-6543', direccion: 'Calle Secundaria 456' }
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

.btn-icon.edit {
    background: #e3f2fd;
    color: #1976d2;
}

.btn-icon.edit:hover {
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
