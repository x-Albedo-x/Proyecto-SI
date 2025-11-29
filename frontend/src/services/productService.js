import api from './api'

export const productService = {
  async list(params = {}) {
    const res = await api.get('/productos', { params })
    return res.data.productos
  },
  async categories() {
    const res = await api.get('/productos/categorias')
    return res.data.categorias
  },
  async create(payload) {
    const res = await api.post('/productos', payload)
    return res.data
  }
  ,
  async update(id, payload) {
    const res = await api.put(`/productos/${id}`, payload)
    return res.data
  },
  async updateStock(id, cantidad) {
    const res = await api.put(`/productos/${id}/stock`, { cantidad })
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/productos/${id}`)
    return res.data
  }
}
