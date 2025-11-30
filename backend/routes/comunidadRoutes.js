import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  obtenerComentarios,
  crearComentario,
  eliminarComentario,
  obtenerComentariosProducto
} from '../controllers/comunidadController.js'

const router = express.Router()

// Obtener todos los comentarios (público)
router.get('/comentarios', obtenerComentarios)

// Obtener comentarios de un producto (público)
router.get('/comentarios/:productoId', obtenerComentariosProducto)

// Crear comentario (requiere autenticación)
router.post('/comentarios', verifyToken, crearComentario)

// Eliminar comentario (requiere autenticación y ser el dueño)
router.delete('/comentarios/:comentarioId', verifyToken, eliminarComentario)

export default router
