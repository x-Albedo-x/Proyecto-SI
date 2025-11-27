<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <div class="logo">🛍️</div>
                <h1>Tienda Online</h1>
                <p v-if="!showRegister">Inicia sesión en tu cuenta</p>
                <p v-else>Crear nueva cuenta</p>
            </div>

            <!-- LOGIN FORM -->
            <form v-if="!showRegister" @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input 
                        v-model="loginForm.correo" 
                        type="email" 
                        id="email" 
                        class="input-field"
                        placeholder="tu@correo.com"
                        required
                    >
                    <small class="hint">Admin: admin@correo.com | Cliente: cliente@correo.com</small>
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input 
                        v-model="loginForm.password" 
                        type="password" 
                        id="password" 
                        class="input-field"
                        placeholder="••••••••"
                        required
                    >
                </div>

                <button type="submit" class="btn-login">Iniciar Sesión</button>

                <div class="divider">O</div>

                <button type="button" class="btn-register" @click="showRegister = true">
                    Crear Nueva Cuenta (Cliente)
                </button>

                <div class="demo-section">
                    <p class="demo-title">Prueba rápida:</p>
                    <div class="demo-buttons">
                        <button type="button" @click="demoLogin('admin')" class="demo-btn admin-btn">
                            Demo Admin
                        </button>
                        <button type="button" @click="demoLogin('cliente')" class="demo-btn cliente-btn">
                            Demo Cliente
                        </button>
                    </div>
                </div>
            </form>

            <!-- REGISTER FORM -->
            <form v-else @submit.prevent="handleRegister" class="login-form">
                <div class="form-group">
                    <label for="reg-nombre">Nombre Completo</label>
                    <input 
                        v-model="registerForm.nombre" 
                        type="text" 
                        id="reg-nombre" 
                        class="input-field"
                        placeholder="Tu nombre"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="reg-correo">Correo Electrónico</label>
                    <input 
                        v-model="registerForm.correo" 
                        type="email" 
                        id="reg-correo" 
                        class="input-field"
                        placeholder="tu@correo.com"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="reg-telefono">Teléfono</label>
                    <input 
                        v-model="registerForm.telefono" 
                        type="tel" 
                        id="reg-telefono" 
                        class="input-field"
                        placeholder="555-123-4567"
                    >
                </div>

                <div class="form-group">
                    <label for="reg-direccion">Dirección</label>
                    <input 
                        v-model="registerForm.direccion" 
                        type="text" 
                        id="reg-direccion" 
                        class="input-field"
                        placeholder="Calle Principal 123"
                    >
                </div>

                <div class="form-group">
                    <label for="reg-password">Contraseña</label>
                    <input 
                        v-model="registerForm.password" 
                        type="password" 
                        id="reg-password" 
                        class="input-field"
                        placeholder="••••••••"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="reg-confirm">Confirmar Contraseña</label>
                    <input 
                        v-model="registerForm.confirmPassword" 
                        type="password" 
                        id="reg-confirm" 
                        class="input-field"
                        placeholder="••••••••"
                        required
                    >
                </div>

                <button type="submit" class="btn-login btn-register-submit">Crear Cuenta</button>

                <button type="button" class="btn-back" @click="showRegister = false">
                    ← Volver a Iniciar Sesión
                </button>
            </form>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const showRegister = ref(false)

const loginForm = ref({
    correo: '',
    password: ''
})

const registerForm = ref({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: ''
})

const handleLogin = () => {
    const correo = loginForm.value.correo.toLowerCase()
    
    // Detectar automáticamente si es admin o cliente
    const isAdmin = correo.includes('admin')
    
    if (loginForm.value.correo && loginForm.value.password) {
        if (isAdmin) {
            authStore.login({
                usuario_id: 1,
                nombre: 'Admin',
                correo: loginForm.value.correo,
                rol: 'administrador',
                tipo: 'admin'
            })
            router.push('/dashboard')
        } else {
            authStore.login({
                cliente_id: 1,
                nombre: correo.split('@')[0],
                correo: loginForm.value.correo,
                rol: 'cliente',
                tipo: 'cliente'
            })
            router.push('/tienda')
        }
    } else {
        alert('Por favor completa todos los campos')
    }
}

const handleRegister = () => {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
    }
    
    if (registerForm.value.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres')
        return
    }

    authStore.login({
        cliente_id: Date.now(),
        nombre: registerForm.value.nombre,
        correo: registerForm.value.correo,
        rol: 'cliente',
        tipo: 'cliente',
        telefono: registerForm.value.telefono,
        direccion: registerForm.value.direccion
    })
    router.push('/tienda')
}

const demoLogin = (tipo) => {
    if (tipo === 'admin') {
        authStore.login({
            usuario_id: 1,
            nombre: 'Admin Demo',
            correo: 'admin@correo.com',
            rol: 'administrador',
            tipo: 'admin'
        })
        router.push('/dashboard')
    } else {
        authStore.login({
            cliente_id: 1,
            nombre: 'Cliente Demo',
            correo: 'cliente@correo.com',
            rol: 'cliente',
            tipo: 'cliente'
        })
        router.push('/tienda')
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    padding: 20px;
}

.login-box {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 40px;
    width: 100%;
    max-width: 450px;
    animation: slideIn 0.5s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    font-size: 60px;
    margin-bottom: 15px;
}

.login-header h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
}

.login-header p {
    color: #999;
    font-size: 14px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.input-field {
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
    font-family: inherit;
}

.input-field:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.hint {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.btn-login {
    padding: 12px 20px;
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.divider {
    text-align: center;
    color: #999;
    position: relative;
    margin: 10px 0;
    font-size: 14px;
}

.divider::before,
.divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #ddd;
}

.divider::before {
    left: 0;
}

.divider::after {
    right: 0;
}

.btn-register {
    padding: 12px 20px;
    background: white;
    color: #FF6B35;
    border: 2px solid #FF6B35;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-register:hover {
    background: #FF6B35;
    color: white;
}

.btn-back {
    padding: 12px 20px;
    background: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-back:hover {
    background: #e0e0e0;
}

.btn-register-submit {
    margin-top: 10px;
}

.demo-section {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #ddd;
}

.demo-title {
    color: #666;
    font-size: 12px;
    margin-bottom: 15px;
    font-weight: 600;
}

.demo-buttons {
    display: flex;
    gap: 10px;
}

.demo-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 13px;
}

.admin-btn {
    background: #FF6B35;
    color: white;
}

.admin-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.cliente-btn {
    background: #D4845F;
    color: white;
}

.cliente-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 132, 95, 0.3);
}

@media (max-width: 600px) {
    .login-box {
        padding: 30px 20px;
    }

    .login-header h1 {
        font-size: 24px;
    }

    .logo {
        font-size: 48px;
    }
}
</style>
