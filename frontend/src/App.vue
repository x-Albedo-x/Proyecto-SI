<template>
    <div id="app">
        <NavbarAdmin v-if="isAdminUser" />
        <NavbarCliente v-else-if="isClienteUser" />
        
        <main v-if="isAuthenticated" class="main-content">
            <RouterView />
        </main>
        <main v-else class="main-content-full">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import NavbarAdmin from './components/NavbarAdmin.vue'
import NavbarCliente from './components/NavbarCliente.vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdminUser = computed(() => authStore.user?.tipo === 'admin')
const isClienteUser = computed(() => authStore.user?.tipo === 'cliente')
</script>

<style scoped>
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    margin-top: 70px;
    padding: 40px;
    overflow-y: auto;
}

.main-content-full {
    flex: 1;
    padding: 0;
    overflow-y: auto;
}
</style>
