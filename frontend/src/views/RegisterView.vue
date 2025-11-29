<template>
  <div class="auth-container">
    <div class="left-section">
      <div class="blob-container">
        <div class="blob"></div>
        <div class="image-circle">
          <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=400&fit=crop" alt="Plant" />
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="form-container">
        <h1 class="title">Crea tu Cuenta Gratis</h1>
        
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <input 
              type="text" 
              id="nombre"
              v-model="formData.nombre"
              placeholder="Ingresa tu nombre completo"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input 
              type="email" 
              id="correo"
              v-model="formData.correo"
              placeholder="Ingresa tu correo"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input 
              type="tel" 
              id="telefono"
              v-model="formData.telefono"
              placeholder="Ingresa tu teléfono"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="direccion">Dirección</label>
            <input 
              type="text" 
              id="direccion"
              v-model="formData.direccion"
              placeholder="Ingresa tu dirección"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password"
                v-model="formData.password"
                placeholder="Ingresa tu contraseña"
                :disabled="loading"
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword" :disabled="loading">
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
          </button>
        </form>

        <p class="toggle-text">
          ¿Ya tienes una cuenta? <router-link to="/login" class="link">Inicia Sesión</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()

const formData = ref({
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    await authService.registerCliente(formData.value)
    
    success.value = 'Registro exitoso. Redirigiendo al login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Error al registrar. Por favor intenta de nuevo.'
    console.error('Error en registro:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 100%);
}

.blob-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f4d03f 0%, #f9e79f 50%, #f7dc6f 100%);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 8s ease-in-out infinite;
  filter: blur(1px);
}

@keyframes morph {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
    transform: rotate(90deg) scale(1.1);
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
    transform: rotate(180deg) scale(0.9);
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
    transform: rotate(270deg) scale(1.05);
  }
}

.image-circle {
  position: relative;
  z-index: 2;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.image-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
}

.form-container {
  width: 100%;
  max-width: 450px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #1a1a1a;
  text-align: left;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
}

.alert-success {
  background-color: #efe;
  border: 1px solid #cfc;
  color: #3c3;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 14px 18px;
  border: none;
  border-radius: 12px;
  background-color: #e8edf2;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #999;
}

.form-group input:focus {
  outline: none;
  background-color: #dce3ea;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover:not(:disabled) {
  color: #10B981;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.submit-btn {
  margin-top: 16px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f4d03f 0%, #f9e79f 100%);
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 208, 63, 0.4);
}

.toggle-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.link {
  color: #f4d03f;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: #e6c030;
}

.divider {
  text-align: center;
  margin: 30px 0;
  color: #999;
  font-size: 14px;
  position: relative;
}

.divider span {
  background: white;
  padding: 0 15px;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #e0e0e0;
}

.social-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.social-btn {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.social-btn:hover {
  background: #f8f8f8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.footer-text {
  text-align: center;
  margin-top: 40px;
  color: #999;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .auth-container {
    flex-direction: column;
  }

  .left-section {
    min-height: 300px;
  }

  .blob {
    width: 350px;
    height: 350px;
  }

  .image-circle {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 640px) {
  .social-buttons {
    flex-direction: column;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>
