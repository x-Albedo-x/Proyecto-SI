import pool from '../config/database.js';

// Obtener todos los productos con filtros
export const getProductos = async (req, res) => {
  try {
    const { categoria, precioMin, precioMax, busqueda, ordenar } = req.query;
    
    let query = `
      SELECT 
        p.producto_id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.categoria,
        COALESCE(i.cantidad, 0) as stock
      FROM producto p
      LEFT JOIN inventario i ON p.producto_id = i.producto_id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filtro por categoría
    if (categoria) {
      query += ' AND p.categoria = ?';
      params.push(categoria);
    }
    
    // Filtro por precio mínimo
    if (precioMin) {
      query += ' AND p.precio >= ?';
      params.push(parseFloat(precioMin));
    }
    
    // Filtro por precio máximo
    if (precioMax) {
      query += ' AND p.precio <= ?';
      params.push(parseFloat(precioMax));
    }
    
    // Búsqueda por nombre o descripción
    if (busqueda) {
      query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
    
    // Ordenamiento
    if (ordenar === 'precio_asc') {
      query += ' ORDER BY p.precio ASC';
    } else if (ordenar === 'precio_desc') {
      query += ' ORDER BY p.precio DESC';
    } else if (ordenar === 'nombre') {
      query += ' ORDER BY p.nombre ASC';
    } else {
      query += ' ORDER BY p.producto_id DESC';
    }
    
    const [productos] = await pool.query(query, params);
    
    res.json({
      success: true,
      count: productos.length,
      productos
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener productos', 
      error: error.message 
    });
  }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [productos] = await pool.query(
      `SELECT 
        p.producto_id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.categoria,
        COALESCE(i.cantidad, 0) as stock
      FROM producto p
      LEFT JOIN inventario i ON p.producto_id = i.producto_id
      WHERE p.producto_id = ?`,
      [id]
    );
    
    if (productos.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }
    
    res.json({
      success: true,
      producto: productos[0]
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener producto', 
      error: error.message 
    });
  }
};

// Obtener categorías disponibles
export const getCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query(
      'SELECT DISTINCT categoria FROM producto WHERE categoria IS NOT NULL ORDER BY categoria'
    );
    
    res.json({
      success: true,
      categorias: categorias.map(c => c.categoria)
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener categorías', 
      error: error.message 
    });
  }
};

// Crear producto (solo admin)
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, imagen_url, stock } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ success: false, message: 'Nombre y precio son requeridos' });
    }
    const [result] = await pool.query(
      'INSERT INTO producto (nombre, descripcion, categoria, precio, imagen_url) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion || '', categoria || null, parseFloat(precio), imagen_url || null]
    );
    const producto_id = result.insertId;
    const cantidad = Number.isFinite(parseInt(stock)) ? parseInt(stock) : 0;
    await pool.query('INSERT INTO inventario (producto_id, cantidad) VALUES (?, ?)', [producto_id, cantidad]);
    res.status(201).json({ success: true, producto_id });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ success: false, message: 'Error al crear producto', error: error.message });
  }
};

// Actualizar producto (admin)
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, precio, imagen_url } = req.body;
    await pool.query(
      'UPDATE producto SET nombre = ?, descripcion = ?, categoria = ?, precio = ?, imagen_url = ? WHERE producto_id = ?',
      [nombre, descripcion || '', categoria || null, parseFloat(precio), imagen_url || null, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar producto', error: error.message });
  }
};

// Reponer/actualizar stock (admin)
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body; // cantidad nueva total o incremento
    if (cantidad == null) {
      return res.status(400).json({ success: false, message: 'Cantidad requerida' });
    }
    // Si existe inventario, actualizar; si no, crear
    const [rows] = await pool.query('SELECT inventario_id FROM inventario WHERE producto_id = ?', [id]);
    if (rows.length > 0) {
      await pool.query('UPDATE inventario SET cantidad = ? WHERE producto_id = ?', [parseInt(cantidad), id]);
    } else {
      await pool.query('INSERT INTO inventario (producto_id, cantidad) VALUES (?, ?)', [id, parseInt(cantidad)]);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar stock', error: error.message });
  }
};

// Eliminar producto (admin)
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM producto WHERE producto_id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar producto', error: error.message });
  }
};
