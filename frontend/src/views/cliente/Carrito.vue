<template>
    <div class="carrito">
        <h1>Carrito de Compras</h1>

        <div v-if="carrito.length > 0" class="carrito-container">
            <div class="carrito-items">
                <div v-for="(item, index) in carrito" :key="index" class="cart-item">
                    <div class="item-image">{{ item.imagen || 'IMG' }}</div>
                    <div class="item-info">
                        <h3>{{ item.nombre }}</h3>
                        <p class="item-description">{{ item.descripcion }}</p>
                        <p class="item-price">${{ item.precio }}</p>
                    </div>
                    <div class="item-quantity">
                        <button @click="updateQuantity(index, item.quantity - 1)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button @click="updateQuantity(index, item.quantity + 1)">+</button>
                    </div>
                    <div class="item-total">
                        ${{ (item.precio * item.quantity).toFixed(2) }}
                    </div>
                    <button class="btn-remove" @click="removeFromCart(index)">Eliminar</button>
                </div>
            </div>

            <div class="carrito-resumen">
                <h2>Resumen del Pedido</h2>
                <div class="resumen-item">
                    <span>Subtotal:</span>
                    <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="resumen-item">
                    <span>Impuestos (10%):</span>
                    <span>${{ (subtotal * 0.1).toFixed(2) }}</span>
                </div>
                <div class="resumen-item">
                    <span>Envío:</span>
                    <span>${{ shipping.toFixed(2) }}</span>
                </div>
                <div class="resumen-total">
                    <span>Total:</span>
                    <span>${{ total.toFixed(2) }}</span>
                </div>
                <button class="btn-checkout">Proceder al Pago</button>
                <RouterLink to="/tienda" class="btn-continue">Continuar Comprando</RouterLink>
            </div>
        </div>

        <div v-else class="carrito-vacio">
            <div class="empty-icon">Carrito</div>
            <h2>Tu carrito está vacío</h2>
            <p>¡Empieza a comprar!</p>
            <RouterLink to="/tienda" class="btn-continue">Ir a la Tienda</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const carrito = ref([
    { id: 1, nombre: 'Laptop HP', descripcion: 'Laptop 15 pulgadas', precio: 12000.00, quantity: 1, imagen: 'IMG' },
    { id: 2, nombre: 'Mouse Logitech', descripcion: 'Mouse inalámbrico', precio: 350.00, quantity: 2, imagen: 'IMG' }
])

const shipping = ref(100.00)

const subtotal = computed(() => {
    return carrito.value.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
})

const total = computed(() => {
    const tax = subtotal.value * 0.1
    return subtotal.value + tax + shipping.value
})

const updateQuantity = (index, newQuantity) => {
    if (newQuantity > 0) {
        carrito.value[index].quantity = newQuantity
    }
}

const removeFromCart = (index) => {
    carrito.value.splice(index, 1)
}
</script>

<style scoped>
.carrito {
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

.carrito h1 {
    font-size: 32px;
    color: #333;
    margin-bottom: 30px;
}

.carrito-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

.carrito-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cart-item {
    background: white;
    border-radius: 12px;
    padding: 15px;
    display: grid;
    grid-template-columns: 100px 1fr 80px 120px 40px;
    gap: 15px;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.cart-item:hover {
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.15);
}

.item-image {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #FF6B35 0%, #D4845F 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
}

.item-info h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    color: #333;
}

.item-description {
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #666;
}

.item-price {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #FF6B35;
}

.item-quantity {
    display: flex;
    gap: 5px;
    align-items: center;
}

.item-quantity button {
    width: 28px;
    height: 28px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    color: #FF6B35;
    transition: all 0.2s ease;
}

.item-quantity button:hover {
    background: #FF6B35;
    color: white;
    border-color: #FF6B35;
}

.item-quantity span {
    width: 30px;
    text-align: center;
    font-weight: 600;
}

.item-total {
    text-align: right;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.btn-remove {
    background: #FFCDD2;
    color: #C62828;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn-remove:hover {
    background: #C62828;
    color: white;
}

.carrito-resumen {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    height: fit-content;
    position: sticky;
    top: 100px;
}

.carrito-resumen h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
}

.resumen-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #666;
    font-size: 14px;
}

.resumen-total {
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    border-top: 2px solid #e0e0e0;
    font-weight: bold;
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
}

.btn-checkout {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #FF6B35, #D4845F);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 10px;
}

.btn-checkout:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-continue {
    display: block;
    width: 100%;
    padding: 12px;
    text-align: center;
    border: 2px solid #FF6B35;
    border-radius: 8px;
    color: #FF6B35;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-continue:hover {
    background: #FF6B35;
    color: white;
}

.carrito-vacio {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
}

.carrito-vacio h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.carrito-vacio p {
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
}

@media (max-width: 768px) {
    .carrito-container {
        grid-template-columns: 1fr;
    }

    .cart-item {
        grid-template-columns: 80px 1fr 30px;
    }

    .item-quantity,
    .item-total,
    .btn-remove {
        grid-column: span 1;
    }

    .carrito-resumen {
        position: static;
        top: auto;
    }
}
</style>
