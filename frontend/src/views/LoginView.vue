<template>
  <div class="auth-container">
    <div class="left-section">
      <div class="blob-container">
        <div class="blob"></div>
        <div class="image-circle">
          <img src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400&h=400&fit=crop" alt="Hot air balloon" />
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="form-container">
        <h1 class="title">¡Bienvenido de Vuelta!</h1>
        <p class="subtitle">Inicia sesión para continuar</p>
        
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
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
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              v-model="formData.password"
              placeholder="Ingresa tu contraseña"
              required
              :disabled="loading"
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p class="toggle-text">
          ¿No tienes una cuenta? <router-link to="/register" class="link">Regístrate</router-link>
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
  correo: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await authService.login(formData.value)
    
    // Redirigir según el tipo de usuario
    if (response.user.tipo === 'cliente') {
      router.push('/') // Redirigir al home para clientes
    } else {
      router.push('/dashboard') // Redirigir al dashboard para usuarios/admin
    }

    console.log('Login exitoso:', response)
  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.'
    console.error('Error en login:', err)
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
  margin-bottom: 8px;
  color: #1a1a1a;
  text-align: left;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.remember-me input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.forgot-password {
  font-size: 14px;
  color: #f4d03f;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #e6c030;
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
