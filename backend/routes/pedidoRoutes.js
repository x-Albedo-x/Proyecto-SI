import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  crearPedido,
  obtenerPedidos,
  misPedidos,
  estadisticasComprasPorHora,
  estadisticasGenerales
} from '../controllers/pedidoController.js'

const router = express.Router()

// Rutas públicas (con autenticación)
router.post('/crear', verifyToken, crearPedido)
router.get('/mis-pedidos', verifyToken, misPedidos)

// Rutas admin (sin autenticación por ahora para testing)
router.get('/admin/todos', obtenerPedidos)
router.get('/admin/estadisticas-hora', estadisticasComprasPorHora)
router.get('/admin/estadisticas', estadisticasGenerales)

export default router
