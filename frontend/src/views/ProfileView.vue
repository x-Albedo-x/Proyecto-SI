<template>
  <div class="profile-page" :class="{ 'admin-layout': isAdmin }">
    <!-- NavBar para clientes o AdminSidebar para admin -->
    <NavBar v-if="!isAdmin" />
    <AdminSidebar v-else />
    
    <div class="profile-container" :class="{ 'admin-container': isAdmin }">
      <!-- Header con Foto y Datos -->
      <div v-if="loading" class="profile-skeleton">
        <SkeletonLoader type="card" :avatar="true" :lines="3" />
        <SkeletonLoader type="list" :lines="4" />
      </div>
      <template v-else>
      <div class="profile-header-card">
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar-container">
              <img v-if="userInfo.avatar_url" :src="userInfo.avatar_url" :alt="userInfo.nombre" />
              <span v-else>{{ userInitial }}</span>
              <label class="avatar-upload-label">
                <input type="file" accept="image/*" @change="handlePhotoUpload" hidden />
              </label>
            </div>
          </div>
          
          <div class="user-header-info">
            <h1>{{ userInfo.nombre }}</h1>
            <p>{{ userInfo.email }}</p>
            <span class="user-type" v-if="userType === 'cliente'">Cliente</span>
            <span class="user-type admin" v-else>Administrador</span>
          </div>
        </div>
      </div>

      <!-- Información Personal -->
      <div class="profile-section">
        <div class="section-title">
          <h2>Información Personal</h2>
          <span v-if="!editingProfile" class="edit-btn" @click="editingProfile = true">Editar</span>
        </div>

        <div v-if="!editingProfile" class="info-display">
          <div class="info-item" v-if="!isAdmin">
            <label>Teléfono</label>
            <p>{{ userInfo.telefono || 'No especificado' }}</p>
          </div>
          <div class="info-item" v-if="!isAdmin">
            <label>Dirección</label>
            <p>{{ userInfo.direccion || 'No especificada' }}</p>
          </div>
          <div class="info-item">
            <label>Miembro desde</label>
            <p>{{ formatDate(userInfo.created_at) }}</p>
          </div>
        </div>

        <form v-else @submit.prevent="guardarPerfil" class="edit-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="profileForm.nombre" type="text" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="profileForm.email" type="email" />
            </div>
            <div class="form-group" v-if="!isAdmin">
              <label>Teléfono</label>
              <input v-model="profileForm.telefono" type="tel" />
            </div>
            <div class="form-group" v-if="!isAdmin">
              <label>Dirección</label>
              <input v-model="profileForm.direccion" type="text" />
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" @click="editingProfile = false">Cancelar</button>
            <button type="submit" class="btn btn-save">Guardar Cambios</button>
          </div>
        </form>
      </div>

      <!-- Seguridad -->
      <div class="profile-section">
        <div class="section-title">
          <h2>Seguridad</h2>
        </div>

        <form @submit.prevent="cambiarContrasena" class="security-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Contraseña Actual</label>
              <input v-model="passwordForm.actual" type="password" placeholder="••••••••" required />
            </div>
            <div class="form-group full-width">
              <label>Nueva Contraseña</label>
              <input v-model="passwordForm.nueva" type="password" placeholder="••••••••" required />
            </div>
            <div class="form-group full-width">
              <label>Confirmar Contraseña</label>
              <input v-model="passwordForm.confirmar" type="password" placeholder="••••••••" required />
            </div>
          </div>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          <div class="form-actions">
            <button type="submit" class="btn btn-save">Actualizar Contraseña</button>
          </div>
        </form>
      </div>

      <!-- Toast Notification -->
      <div v-if="toast.visible" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import api from '../services/api'

const isAdmin = computed(() => userType.value === 'usuario')

const userInfo = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  avatar_url: '',
  created_at: null
})

const profileForm = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: ''
})

const passwordForm = ref({
  actual: '',
  nueva: '',
  confirmar: ''
})

const editingProfile = ref(false)
const passwordError = ref('')
const userType = ref('cliente')
const loading = ref(false)

const userInitial = computed(() => {
  return userInfo.value.nombre ? userInfo.value.nombre.charAt(0).toUpperCase() : 'U'
})

const toast = ref({
  visible: false,
  message: '',
  type: 'success'
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, message: mensaje, type: tipo }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

const cargarPerfil = async () => {
  try {
    loading.value = true
    // Simular delay para ver skeleton
    await new Promise(resolve => setTimeout(resolve, 500))
    const response = await api.get('/perfil')
    
    const user = response.data
    userType.value = user.tipo || 'cliente'
    
    userInfo.value = {
      nombre: user.nombre || 'Usuario',
      email: user.correo || user.email || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      avatar_url: user.avatar_url || '',
      created_at: user.created_at || new Date().toISOString()
    }
    
    profileForm.value = {
      nombre: userInfo.value.nombre,
      email: userInfo.value.email,
      telefono: userInfo.value.telefono,
      direccion: userInfo.value.direccion
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error)
    // Si hay error, cargar desde localStorage como fallback
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    userType.value = user.tipo || 'cliente'
    
    userInfo.value = {
      nombre: user.nombre || 'Usuario',
      email: user.email || user.correo || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      avatar_url: user.avatar_url || '',
      created_at: user.created_at || new Date().toISOString()
    }
    
    profileForm.value = { ...userInfo.value }
  } finally {
    loading.value = false
  }
}

const guardarPerfil = async () => {
  try {
    loading.value = true
    
    const updateData = {
      nombre: profileForm.value.nombre,
      correo: profileForm.value.email,
      telefono: profileForm.value.telefono || '',
      direccion: profileForm.value.direccion || ''
    }
    
    console.log('Enviando datos al backend:', updateData)
    
    const response = await api.put('/perfil', updateData)
    
    console.log('Respuesta del backend:', response.data)
    
    // Actualizar userInfo con los datos de la respuesta
    if (response.data.usuario) {
      const usuarioActualizado = response.data.usuario
      userInfo.value = {
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.correo,
        telefono: usuarioActualizado.telefono || '',
        direccion: usuarioActualizado.direccion || '',
        avatar_url: usuarioActualizado.avatar_url || userInfo.value.avatar_url,
        created_at: userInfo.value.created_at
      }
      
      // También actualizar profileForm para que refleje los cambios
      profileForm.value = {
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.correo,
        telefono: usuarioActualizado.telefono || '',
        direccion: usuarioActualizado.direccion || ''
      }
    }
    
    editingProfile.value = false
    
    // Actualizar localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    user.nombre = response.data.usuario?.nombre
    user.email = response.data.usuario?.correo
    user.correo = response.data.usuario?.correo
    user.telefono = response.data.usuario?.telefono
    user.direccion = response.data.usuario?.direccion
    user.avatar_url = response.data.usuario?.avatar_url || user.avatar_url
    localStorage.setItem('user', JSON.stringify(user))
    
    window.dispatchEvent(new CustomEvent('userAvatarUpdated', { detail: { avatar: userInfo.value.avatar_url } }))
    
    mostrarToast('Perfil actualizado correctamente', 'success')
  } catch (error) {
    console.error('Error al guardar perfil:', error.response?.data || error.message)
    mostrarToast(error.response?.data?.error || 'Error al guardar los cambios', 'error')
  } finally {
    loading.value = false
  }
}

const cambiarContrasena = async () => {
  passwordError.value = ''
  
  if (passwordForm.value.nueva !== passwordForm.value.confirmar) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (passwordForm.value.nueva.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  try {
    loading.value = true
    
    await api.post('/perfil/cambiar-contrasena', {
      contrasenaActual: passwordForm.value.actual,
      contrasenaNueva: passwordForm.value.nueva,
      confirmar: passwordForm.value.confirmar
    })
    
    passwordForm.value = { actual: '', nueva: '', confirmar: '' }
    mostrarToast('Contraseña actualizada correctamente', 'success')
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    const errorMsg = error.response?.data?.error || 'Error al cambiar la contraseña'
    mostrarToast(errorMsg, 'error')
    passwordError.value = errorMsg
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    mostrarToast('Por favor selecciona una imagen válida', 'error')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    mostrarToast('La imagen no debe superar 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const imageUrl = e.target?.result
      
      userInfo.value.avatar_url = imageUrl
      profileForm.value.avatar_url = imageUrl
      
      // Guardar en BD
      await api.put('/perfil', {
        avatar_url: imageUrl
      })
      
      // Actualizar localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.avatar_url = imageUrl
      localStorage.setItem('user', JSON.stringify(user))
      
      window.dispatchEvent(new CustomEvent('userAvatarUpdated', { detail: { avatar: imageUrl } }))
      
      mostrarToast('Foto de perfil actualizada', 'success')
    } catch (error) {
      console.error('Error al guardar foto:', error)
      mostrarToast('Error al guardar la foto de perfil', 'error')
    }
  }
  reader.readAsDataURL(file)
}

onMounted(() => {
  cargarPerfil()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.profile-page.admin-layout {
  padding-left: 250px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 20px 60px;
  width: 100%;
}

.profile-container.admin-container {
  max-width: 100%;
  padding: 32px;
  padding-top: 32px;
  margin: 0;
}

/* Header Card */
.profile-header-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: white;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload-label {
  position: absolute;
  inset: 0;
  cursor: pointer;
}

.user-header-info h1 {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.user-header-info p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.user-type {
  display: inline-block;
  padding: 6px 12px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.user-type.admin {
  background: #fef3c7;
  color: #92400e;
}

/* Sections */
.profile-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.edit-btn {
  color: #10B981;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  color: #059669;
}

/* Info Display */
.info-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-item label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.info-item p {
  font-size: 15px;
  color: #1f2937;
  margin: 0;
}

/* Forms */
.edit-form,
.security-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save {
  background: #10B981;
  color: white;
}

.btn-save:hover {
  background: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.error-message {
  padding: 10px 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  z-index: 9999;
}

.toast.success {
  background: #10B981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.profile-skeleton {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 100px 16px 40px;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .info-display {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
