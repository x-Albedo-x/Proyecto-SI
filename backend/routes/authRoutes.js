import express from 'express';
import { 
  registerCliente, 
  loginCliente, 
  loginUsuario,
  login,
  verifyTokenController 
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', registerCliente);
router.post('/login', login); // Login unificado
router.post('/login/cliente', loginCliente); // Mantener por compatibilidad
router.post('/login/usuario', loginUsuario); // Mantener por compatibilidad
router.get('/verify', verifyToken, verifyTokenController);

export default router;
