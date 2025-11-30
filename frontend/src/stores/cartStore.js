import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  })

  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.cantidad, 0)
  })

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const itemExistente = items.value.find(item => item.producto_id === producto.producto_id)
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad
    } else {
      items.value.push({
        ...producto,
        cantidad
      })
    }
  }

  const removeFromCart = (productoId) => {
    items.value = items.value.filter(item => item.producto_id !== productoId)
  }

  const updateCantidad = (productoId, cantidad) => {
    const item = items.value.find(item => item.producto_id === productoId)
    if (item) {
      if (cantidad <= 0) {
        removeFromCart(productoId)
      } else {
        item.cantidad = cantidad
      }
    }
  }

  const vaciarCarrito = () => {
    items.value = []
  }

  return {
    items,
    cartTotal,
    cartCount,
    agregarAlCarrito,
    removeFromCart,
    updateCantidad,
    vaciarCarrito
  }
})
