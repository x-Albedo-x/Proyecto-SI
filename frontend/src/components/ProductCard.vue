<template>
  <div class="product-card">
    <div class="badge" v-if="isBestChoice">✓ Best choice</div>
    <div class="product-image">
      <img :src="product.imagen_url" :alt="product.nombre" />
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.nombre }}</h3>
      <p class="product-description">{{ product.descripcion }}</p>
      <div class="product-footer">
        <span class="product-price">${{ product.precio }}</span>
        <button class="add-btn" @click="addToCart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isBestChoice: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart'])

const addToCart = () => {
  emit('add-to-cart', props.product)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #10B981;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #10B981;
}

.add-btn {
  background: #10B981;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #059669;
  transform: scale(1.1);
}
</style>
