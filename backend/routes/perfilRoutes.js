import express from 'express';
import {
  actualizarPerfil,
  cambiarContrasena,
  obtenerPerfil
} from '../controllers/perfilController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta de prueba sin autenticación para debug
router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working', authHeader: req.headers.authorization });
});

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener perfil actual
router.get('/', obtenerPerfil);

// Actualizar perfil (nombre, email, teléfono, dirección, avatar)
router.put('/', actualizarPerfil);

// Cambiar contraseña
router.post('/cambiar-contrasena', cambiarContrasena);

export default router;
