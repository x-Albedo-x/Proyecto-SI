<template>
  <div v-if="producto" class="modal-overlay" @click="cerrar">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="cerrar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="modal-body">
        <div class="modal-image">
          <img :src="producto.imagen_url" :alt="producto.nombre" />
        </div>

        <div class="modal-info">
          <h2>{{ producto.nombre }}</h2>
          
          <div class="modal-details">
            <div class="detail-item">
              <span class="detail-label">Categoría:</span>
              <span class="detail-value">{{ producto.categoria || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Stock disponible:</span>
              <span class="detail-value">{{ producto.stock }} unidades</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Precio:</span>
              <span class="detail-value detail-price">${{ producto.precio.toFixed(2) }}</span>
            </div>
          </div>

          <div class="modal-description">
            <h3>Descripción</h3>
            <p>{{ producto.descripcion }}</p>
          </div>

          <div class="modal-actions">
            <button 
              @click.stop="emit('add-to-cart', producto)"
              class="btn-add-cart"
              :disabled="producto.stock === 0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {{ producto.stock === 0 ? 'Producto Agotado' : 'Agregar al Carrito' }}
            </button>
            <button @click="cerrar" class="btn-close">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  producto: Object,
  default: null
})

const emit = defineEmits(['close', 'add-to-cart'])

const cerrar = () => {
  emit('close')
}
</script>

<style scoped>
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  z-index: 2001;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #1f2937;
  transform: rotate(90deg);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 32px;
}

.modal-image {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
}

.detail-value {
  color: #1f2937;
  font-weight: 500;
}

.detail-price {
  font-size: 24px;
  color: #10B981;
  font-weight: 700;
}

.modal-description {
  margin-bottom: 24px;
}

.modal-description h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.modal-description p {
  color: #6b7280;
  line-height: 1.6;
  font-size: 15px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn-add-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-cart:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.btn-add-cart:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.btn-close {
  padding: 12px 20px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .modal-image {
    height: 300px;
  }

  .modal-content {
    width: 95%;
  }

  .modal-info h2 {
    font-size: 24px;
  }
}
</style>
