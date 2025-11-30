import express from 'express';
import { 
  getProductos, 
  getProductoById,
  getCategorias,
  createProducto,
  updateProducto,
  updateStock,
  deleteProducto
} from '../controllers/productoController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas de productos
router.get('/', getProductos);
router.get('/categorias', getCategorias);
router.get('/:id', getProductoById);
router.post('/', verifyAdmin, createProducto);
router.put('/:id', verifyAdmin, updateProducto);
router.put('/:id/stock', verifyAdmin, updateStock);
router.delete('/:id', verifyAdmin, deleteProducto);

export default router;
