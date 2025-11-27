<template>
    <div class="perfil-container">
        <div class="perfil-header">
            <h1>Mi Perfil</h1>
        </div>

        <div class="perfil-content">
            <div class="profile-card">
                <div class="profile-avatar-section">
                    <div class="avatar-container">
                        <img v-if="profileImage" :src="profileImage" :alt="authStore.userName" class="avatar-image" />
                        <div v-else class="avatar-placeholder">
                            {{ authStore.userName?.charAt(0).toUpperCase() }}
                        </div>
                        <label class="upload-label">
                            <input 
                                type="file" 
                                accept="image/*" 
                                @change="handleImageUpload"
                                class="file-input"
                            />
                            <span class="upload-btn">Cambiar Foto</span>
                        </label>
                    </div>
                </div>

                <div class="profile-info">
                    <div class="info-section">
                        <h2>Información Personal</h2>
                        
                        <div class="form-group">
                            <label>Nombre</label>
                            <input 
                                v-model="formData.nombre" 
                                type="text" 
                                placeholder="Tu nombre completo"
                                @blur="validateField('nombre')"
                            />
                            <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
                        </div>

                        <div class="form-group">
                            <label>Correo Electrónico</label>
                            <input 
                                v-model="formData.correo" 
                                type="email" 
                                placeholder="tu@email.com"
                                @blur="validateField('correo')"
                            />
                            <span v-if="errors.correo" class="error-message">{{ errors.correo }}</span>
                        </div>

                        <div class="form-group">
                            <label>Teléfono</label>
                            <input 
                                v-model="formData.telefono" 
                                type="tel" 
                                placeholder="123-456-7890"
                            />
                        </div>

                        <div class="form-group">
                            <label>Dirección</label>
                            <input 
                                v-model="formData.direccion" 
                                type="text" 
                                placeholder="Tu dirección"
                            />
                        </div>

                        <div class="form-group">
                            <label>Rol</label>
                            <input 
                                :value="authStore.userRole" 
                                type="text" 
                                disabled
                                class="disabled-field"
                            />
                        </div>
                    </div>

                    <div class="info-section">
                        <h2>Cambiar Contraseña</h2>
                        
                        <div class="form-group">
                            <label>Contraseña Actual</label>
                            <input 
                                v-model="passwordData.actual" 
                                type="password" 
                                placeholder="Ingresa tu contraseña actual"
                            />
                        </div>

                        <div class="form-group">
                            <label>Nueva Contraseña</label>
                            <input 
                                v-model="passwordData.nueva" 
                                type="password" 
                                placeholder="Ingresa tu nueva contraseña"
                            />
                        </div>

                        <div class="form-group">
                            <label>Confirmar Contraseña</label>
                            <input 
                                v-model="passwordData.confirmar" 
                                type="password" 
                                placeholder="Confirma tu contraseña"
                            />
                            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                        </div>

                        <button class="btn-password" @click="changePassword">Cambiar Contraseña</button>
                    </div>
                </div>
            </div>

            <div class="button-group">
                <button class="btn-save" @click="saveProfile">Guardar Cambios</button>
                <button class="btn-cancel" @click="resetForm">Cancelar</button>
            </div>

            <div v-if="successMessage" class="success-message">
                {{ successMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()
const profileImage = ref(null)
const successMessage = ref('')

const formData = reactive({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
})

const passwordData = reactive({
    actual: '',
    nueva: '',
    confirmar: ''
})

const errors = reactive({
    nombre: '',
    correo: '',
    password: ''
})

const originalFormData = reactive({})

onMounted(() => {
    loadProfileData()
})

const loadProfileData = () => {
    const userData = authStore.user || {}
    formData.nombre = userData.nombre || authStore.userName || ''
    formData.correo = userData.correo || ''
    formData.telefono = userData.telefono || ''
    formData.direccion = userData.direccion || ''
    
    Object.assign(originalFormData, formData)
    
    const savedImage = localStorage.getItem('profileImage')
    if (savedImage) {
        profileImage.value = savedImage
    }
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            profileImage.value = e.target.result
            localStorage.setItem('profileImage', e.target.result)
        }
        reader.readAsDataURL(file)
    }
}

const validateField = (field) => {
    if (field === 'nombre') {
        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido'
        } else if (formData.nombre.trim().length < 3) {
            errors.nombre = 'El nombre debe tener al menos 3 caracteres'
        } else {
            errors.nombre = ''
        }
    } else if (field === 'correo') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.correo.trim()) {
            errors.correo = 'El correo es requerido'
        } else if (!emailRegex.test(formData.correo)) {
            errors.correo = 'El correo no es válido'
        } else {
            errors.correo = ''
        }
    }
}

const changePassword = () => {
    errors.password = ''
    
    if (!passwordData.actual || !passwordData.nueva || !passwordData.confirmar) {
        errors.password = 'Todos los campos de contraseña son requeridos'
        return
    }
    
    if (passwordData.nueva.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres'
        return
    }
    
    if (passwordData.nueva !== passwordData.confirmar) {
        errors.password = 'Las contraseñas no coinciden'
        return
    }
    
    // Simulación - en producción esto iría a una API
    successMessage.value = 'Contraseña cambiada exitosamente'
    setTimeout(() => {
        successMessage.value = ''
        passwordData.actual = ''
        passwordData.nueva = ''
        passwordData.confirmar = ''
    }, 3000)
}

const saveProfile = () => {
    validateField('nombre')
    validateField('correo')
    
    if (errors.nombre || errors.correo) {
        return
    }
    
    // Simulación - en producción esto iría a una API
    const updatedUser = {
        ...authStore.user,
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
        direccion: formData.direccion
    }
    
    localStorage.setItem('user', JSON.stringify(updatedUser))
    Object.assign(originalFormData, formData)
    
    successMessage.value = 'Perfil actualizado exitosamente'
    setTimeout(() => {
        successMessage.value = ''
    }, 3000)
}

const resetForm = () => {
    Object.assign(formData, originalFormData)
    passwordData.actual = ''
    passwordData.nueva = ''
    passwordData.confirmar = ''
    errors.nombre = ''
    errors.correo = ''
    errors.password = ''
    successMessage.value = ''
}
</script>

<style scoped>
.perfil-container {
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

.perfil-header {
    margin-bottom: 30px;
}

.perfil-header h1 {
    font-size: 32px;
    color: #2C3E50;
}

.perfil-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    padding: 40px;
}

.profile-card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    margin-bottom: 30px;
}

.profile-avatar-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.avatar-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.avatar-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #FF6B35;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.avatar-placeholder {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    color: white;
    font-weight: bold;
    border: 4px solid #FF6B35;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.file-input {
    display: none;
}

.upload-label {
    cursor: pointer;
}

.upload-btn {
    padding: 10px 20px;
    background: #FF6B35;
    color: white;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.upload-btn:hover {
    background: #D4845F;
    transform: translateY(-2px);
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.info-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-section h2 {
    font-size: 18px;
    color: #2C3E50;
    font-weight: 600;
    margin-bottom: 10px;
    border-bottom: 2px solid #FF6B35;
    padding-bottom: 10px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.form-group input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
}

.disabled-field {
    background-color: #f5f5f5 !important;
}

.error-message {
    color: #C62828;
    font-size: 12px;
    font-weight: 500;
}

.success-message {
    background: #C8E6C9;
    color: #1B5E20;
    padding: 15px;
    border-radius: 6px;
    font-weight: 600;
    margin-top: 20px;
    text-align: center;
}

.button-group {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}

.btn-save,
.btn-cancel,
.btn-password {
    padding: 12px 30px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.btn-save {
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
}

.btn-save:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-cancel {
    background: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
}

.btn-cancel:hover {
    background: #e0e0e0;
}

.btn-password {
    background: #FF6B35;
    color: white;
    width: 100%;
    margin-top: 10px;
}

.btn-password:hover {
    background: #D4845F;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .perfil-content {
        padding: 20px;
    }

    .profile-card {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .button-group {
        flex-direction: column;
    }

    .btn-save,
    .btn-cancel {
        width: 100%;
    }
}
</style>
