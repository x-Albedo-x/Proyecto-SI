import api from './api';

export const authService = {
  // Registro de cliente
  async registerCliente(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrar' };
    }
  },

  // Login unificado (detecta automáticamente cliente o usuario)
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Guardar usuario inicial
        let userData = response.data.user;
        
        // Intentar cargar el perfil completo desde BD (con avatar)
        try {
          const profileResponse = await api.get('/perfil');
          // Combinar datos del login con datos del perfil
          userData = {
            ...userData,
            ...profileResponse.data,
            avatar_url: profileResponse.data.avatar_url || userData.avatar_url
          };
        } catch (error) {
          console.warn('No se pudo cargar perfil completo:', error);
          // Usar datos del login si falla
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Login de cliente (mantener por compatibilidad)
  async loginCliente(credentials) {
    try {
      const response = await api.post('/auth/login/cliente', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        let userData = response.data.user;
        
        // Intentar cargar el perfil completo desde BD
        try {
          const profileResponse = await api.get('/perfil');
          userData = {
            ...userData,
            ...profileResponse.data,
            avatar_url: profileResponse.data.avatar_url || userData.avatar_url
          };
        } catch (error) {
          console.warn('No se pudo cargar perfil completo:', error);
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Login de usuario (admin/vendedor) - mantener por compatibilidad
  async loginUsuario(credentials) {
    try {
      const response = await api.post('/auth/login/usuario', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        let userData = response.data.user;
        
        // Intentar cargar el perfil completo desde BD
        try {
          const profileResponse = await api.get('/perfil');
          userData = {
            ...userData,
            ...profileResponse.data,
            avatar_url: profileResponse.data.avatar_url || userData.avatar_url
          };
        } catch (error) {
          console.warn('No se pudo cargar perfil completo:', error);
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Verificar token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token inválido' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
