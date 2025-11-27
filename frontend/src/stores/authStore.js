import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)
    const userRole = computed(() => user.value?.rol)
    const userName = computed(() => user.value?.nombre)

    const login = (userData) => {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        user.value = null
        localStorage.removeItem('user')
    }

    const loadUserFromStorage = () => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            user.value = JSON.parse(storedUser)
        }
    }

    return {
        user,
        isAuthenticated,
        userRole,
        userName,
        login,
        logout,
        loadUserFromStorage
    }
})
