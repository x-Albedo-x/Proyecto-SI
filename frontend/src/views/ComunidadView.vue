<template>
  <div class="comunidad-page">
    <NavBar />
    
    <div class="comunidad-container">
      <div class="header-section">
        <h1>Comunidad Verde & Raíces</h1>
        <p>Comparte tus experiencias con nuestras plantas. Recomienda, comenta y conecta con otros amantes de la naturaleza.</p>
      </div>

      <div class="comunidad-content">
        <!-- Formulario para agregar comentario -->
        <div class="new-post-section">
          <div class="new-post-header">
            <div class="user-avatar">
              <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.nombre" />
              <span v-else>{{ userInitial }}</span>
            </div>
            <textarea
              v-model="nuevoComentario.texto"
              placeholder="Comparte tu experiencia con una planta..."
              class="new-comment-input"
            ></textarea>
          </div>

          <!-- Preview de imagen -->
          <div v-if="nuevoComentario.imagen_url" class="preview-section">
            <div class="preview-image">
              <img :src="nuevoComentario.imagen_url" :alt="nuevoComentario.texto" />
              <button type="button" @click="nuevoComentario.imagen_url = ''" class="remove-image">×</button>
            </div>
          </div>
          
          <div class="post-actions">
            <div class="select-producto">
              <select v-model="nuevoComentario.producto_id" class="producto-select">
                <option value="">Selecciona una planta (opcional)</option>
                <option v-for="producto in productos" :key="producto.producto_id" :value="producto.producto_id">
                  {{ producto.nombre }}
                </option>
              </select>
            </div>
            
            <div class="rating-section">
              <label>Calificación:</label>
              <div class="star-rating">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="nuevoComentario.calificacion = star"
                  :class="{ active: nuevoComentario.calificacion >= star }"
                  class="star-btn"
                >
                  ★
                </button>
              </div>
            </div>

            <div class="image-upload-section">
              <label class="image-upload-label">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleImageUpload" 
                  hidden 
                />
                📸 Agregar Imagen
              </label>
            </div>

            <button @click="publicarComentario" :disabled="!nuevoComentario.texto.trim()" class="btn-publish">
              Publicar
            </button>
          </div>
        </div>

        <!-- Comentarios publicados -->
        <div class="comentarios-section">
          <h2 v-if="comentarios.length === 0" class="no-comments">No hay comentarios aún. ¡Sé el primero en compartir!</h2>
          
          <div v-for="comentario in comentariosOrdenados" :key="comentario.id" class="comentario-card">
            <div class="comentario-header">
              <div class="user-info">
                <div class="avatar">
                  <img v-if="comentario.avatar_url" :src="comentario.avatar_url" :alt="comentario.nombre" />
                  <span v-else>{{ comentario.nombre.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="user-details">
                  <p class="user-name">{{ comentario.nombre }}</p>
                  <p class="comment-date">{{ formatDate(comentario.fecha) }}</p>
                </div>
              </div>

              <div class="rating-display">
                <span class="stars">{{ '★'.repeat(comentario.calificacion) }}{{ '☆'.repeat(5 - comentario.calificacion) }}</span>
              </div>
            </div>

            <div class="comentario-body">
              <p v-if="comentario.producto_nombre" class="producto-tag">
                🌿 {{ comentario.producto_nombre }}
              </p>
              <p class="comentario-texto">{{ comentario.texto }}</p>
              <img v-if="comentario.imagen_url" :src="comentario.imagen_url" :alt="comentario.texto" class="comentario-imagen" />
            </div>

            <div class="comentario-actions">
              <button v-if="esOwner(comentario.cliente_id)" @click="eliminarComentario(comentario.id)" class="btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import api from '../services/api'
import { productService } from '../services/productService'

const comentarios = ref([])
const productos = ref([])
const user = ref(null)
const nuevoComentario = ref({
  texto: '',
  producto_id: '',
  calificacion: 5,
  imagen_url: ''
})

const userInitial = computed(() => {
  return user.value?.nombre ? user.value.nombre.charAt(0).toUpperCase() : 'U'
})

const comentariosOrdenados = computed(() => {
  return [...comentarios.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

const formatDate = (date) => {
  if (!date) return '—'
  const fechaObj = new Date(date)
  const ahora = new Date()
  const diferencia = ahora - fechaObj
  
  const minutos = Math.floor(diferencia / 60000)
  const horas = Math.floor(diferencia / 3600000)
  const dias = Math.floor(diferencia / 86400000)
  
  if (minutos < 1) return 'Hace unos segundos'
  if (minutos < 60) return `Hace ${minutos}m`
  if (horas < 24) return `Hace ${horas}h`
  if (dias < 7) return `Hace ${dias}d`
  
  return fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const esOwner = (clienteId) => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  return userData.cliente_id === clienteId || userData.usuario_id === clienteId
}

const cargarProductos = async () => {
  try {
    const result = await productService.list()
    productos.value = result || []
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

const cargarComentarios = async () => {
  try {
    const response = await api.get('/comunidad/comentarios')
    comentarios.value = response.data.comentarios || []
  } catch (error) {
    console.error('Error al cargar comentarios:', error)
  }
}

const publicarComentario = async () => {
  if (!nuevoComentario.value.texto.trim()) {
    alert('Por favor escribe un comentario')
    return
  }

  try {
    await api.post('/comunidad/comentarios', {
      texto: nuevoComentario.value.texto,
      producto_id: nuevoComentario.value.producto_id || null,
      calificacion: nuevoComentario.value.calificacion,
      imagen_url: nuevoComentario.value.imagen_url || null
    })

    nuevoComentario.value = {
      texto: '',
      producto_id: '',
      calificacion: 5,
      imagen_url: ''
    }

    await cargarComentarios()
  } catch (error) {
    console.error('Error al publicar comentario:', error)
    alert('Error al publicar el comentario')
  }
}

const eliminarComentario = async (id) => {
  if (!confirm('¿Estás seguro que deseas eliminar este comentario?')) return

  try {
    await api.delete(`/comunidad/comentarios/${id}`)
    await cargarComentarios()
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    alert('Error al eliminar el comentario')
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona una imagen válida')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen no debe superar 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    nuevoComentario.value.imagen_url = e.target?.result || ''
  }
  reader.readAsDataURL(file)
}

const cargarDatos = async () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  user.value = userData
  
  await Promise.all([
    cargarProductos(),
    cargarComentarios()
  ])
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.comunidad-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9f5f0 100%);
}

.comunidad-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  animation: slideDown 0.6s ease;
}

.header-section h1 {
  font-size: 2.5rem;
  color: #10B981;
  margin-bottom: 10px;
  font-weight: 700;
}

.header-section p {
  color: #6B7280;
  font-size: 1.1rem;
  line-height: 1.6;
}

.comunidad-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* New Post Section */
.new-post-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.6s ease;
}

.new-post-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #10B981, #34D399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-comment-input {
  flex: 1;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;
}

.new-comment-input:focus {
  outline: none;
  border-color: #10B981;
  background-color: #F0FDF4;
}

.preview-section {
  padding: 15px;
  margin-bottom: 15px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.preview-image {
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image img {
  width: 100%;
  height: auto;
  display: block;
  max-height: 300px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.remove-image:hover {
  background: #DC2626;
  transform: scale(1.1);
}

.post-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.select-producto {
  flex: 1;
  min-width: 200px;
}

.producto-select {
  width: 100%;
  padding: 10px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.3s;
}

.producto-select:focus {
  outline: none;
  border-color: #10B981;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-section label {
  font-weight: 600;
  color: #374151;
}

.star-rating {
  display: flex;
  gap: 5px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #D1D5DB;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.star-btn:hover,
.star-btn.active {
  color: #FCD34D;
  transform: scale(1.2);
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.image-upload-label {
  background: #F3E8FF;
  color: #7C3AED;
  border: 2px dashed #C4B5FD;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.image-upload-label:hover {
  background: #EDE9FE;
  border-color: #A78BFA;
}

.btn-publish {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-publish:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Comentarios Section */
.comentarios-section {
  animation: slideUp 0.8s ease;
}

.no-comments {
  text-align: center;
  color: #9CA3AF;
  padding: 40px 20px;
  font-size: 1.1rem;
}

.comentario-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.comentario-card:hover {
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
}

.comentario-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.user-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #10B981, #34D399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.comment-date {
  color: #9CA3AF;
  font-size: 0.85rem;
  margin: 0;
}

.rating-display {
  white-space: nowrap;
}

.stars {
  font-size: 1.1rem;
  color: #FCD34D;
}

.comentario-body {
  margin-bottom: 15px;
}

.comentario-imagen {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin-top: 10px;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.producto-tag {
  display: inline-block;
  background: #F0FDF4;
  color: #10B981;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.comentario-texto {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.comentario-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-delete {
  background: #FEE2E2;
  color: #DC2626;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover {
  background: #FCA5A5;
  transform: translateY(-1px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header-section h1 {
    font-size: 1.8rem;
  }

  .post-actions {
    flex-direction: column;
  }

  .select-producto {
    min-width: 100%;
  }

  .rating-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .comentario-header {
    flex-direction: column;
  }
}
</style>
