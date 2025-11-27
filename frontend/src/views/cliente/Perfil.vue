<template>
    <div class="perfil">
        <h1>Mi Perfil</h1>

        <div class="perfil-container">
            <section class="perfil-card">
                <h2>Información Personal</h2>
                <form @submit.prevent="saveProfile" class="form">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input v-model="profile.nombre" type="text" required>
                    </div>

                    <div class="form-group">
                        <label>Correo Electrónico</label>
                        <input v-model="profile.correo" type="email" required>
                    </div>

                    <div class="form-group">
                        <label>Teléfono</label>
                        <input v-model="profile.telefono" type="tel">
                    </div>

                    <div class="form-group">
                        <label>Dirección</label>
                        <textarea v-model="profile.direccion" rows="3"></textarea>
                    </div>

                    <button type="submit" class="btn-save">Guardar Cambios</button>
                </form>
            </section>

            <section class="perfil-card">
                <h2>Cambiar Contraseña</h2>
                <form @submit.prevent="changePassword" class="form">
                    <div class="form-group">
                        <label>Contraseña Actual</label>
                        <input v-model="passwordForm.current" type="password" required>
                    </div>

                    <div class="form-group">
                        <label>Nueva Contraseña</label>
                        <input v-model="passwordForm.new" type="password" required>
                    </div>

                    <div class="form-group">
                        <label>Confirmar Contraseña</label>
                        <input v-model="passwordForm.confirm" type="password" required>
                    </div>

                    <button type="submit" class="btn-save">Cambiar Contraseña</button>
                </form>
            </section>

            <section class="perfil-card danger">
                <h2>Opciones de Cuenta</h2>
                <div class="danger-actions">
                    <button @click="confirmDelete" class="btn-delete">Eliminar Cuenta</button>
                    <p class="warning">Esta acción no se puede deshacer. Se eliminarán todos tus datos.</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()

const profile = ref({
    nombre: authStore.user?.nombre || 'Cliente Demo',
    correo: authStore.user?.correo || 'cliente@correo.com',
    telefono: authStore.user?.telefono || '555-123-4567',
    direccion: authStore.user?.direccion || ''
})

const passwordForm = ref({
    current: '',
    new: '',
    confirm: ''
})

const saveProfile = () => {
    alert('Perfil actualizado correctamente')
    passwordForm.value = { current: '', new: '', confirm: '' }
}

const changePassword = () => {
    if (passwordForm.value.new === passwordForm.value.confirm) {
        alert('Contraseña cambiada correctamente')
        passwordForm.value = { current: '', new: '', confirm: '' }
    } else {
        alert('Las contraseñas no coinciden')
    }
}

const confirmDelete = () => {
    if (confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
        alert('Cuenta eliminada')
        authStore.logout()
    }
}
</script>

<style scoped>
.perfil {
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

.perfil h1 {
    font-size: 32px;
    color: #333;
    margin-bottom: 30px;
}

.perfil-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
}

.perfil-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.perfil-card h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e0e0e0;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.form-group input,
.form-group textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.btn-save {
    padding: 12px;
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.btn-save:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.perfil-card.danger {
    border-left: 4px solid #d32f2f;
}

.danger-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.btn-delete {
    padding: 12px;
    background: #d32f2f;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-delete:hover {
    background: #b71c1c;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

.warning {
    color: #d32f2f;
    font-size: 13px;
    margin: 0;
}

@media (max-width: 768px) {
    .perfil-container {
        grid-template-columns: 1fr;
    }

    .perfil h1 {
        font-size: 24px;
    }
}
</style>
