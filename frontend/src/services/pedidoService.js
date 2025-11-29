import api from './api'

export const pedidoService = {
  async crearPedido(items) {
    try {
      const response = await api.post('/pedidos/crear', { items })
      return response.data
    } catch (error) {
      console.error('Error al crear pedido:', error)
      throw error
    }
  },

  async misPedidos() {
    try {
      const response = await api.get('/pedidos/mis-pedidos')
      return response.data
    } catch (error) {
      console.error('Error al obtener mis pedidos:', error)
      throw error
    }
  },

  async obtenerTodosPedidos() {
    try {
      const response = await api.get('/pedidos/admin/todos')
      return response.data
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
      throw error
    }
  },

  async obtenerEstadisticasHora() {
    try {
      const response = await api.get('/pedidos/admin/estadisticas-hora')
      return response.data
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      throw error
    }
  },

  async obtenerEstadisticas() {
    try {
      const response = await api.get('/pedidos/admin/estadisticas')
      return response.data
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error)
      throw error
    }
  }
}
