import db from '../config/database.js'

// Crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { items } = req.body
    const { userId, tipo } = req.user
    
    console.log('Creando pedido - req.user:', req.user)
    console.log('userId:', userId, 'tipo:', tipo)
    
    // Solo clientes pueden crear pedidos
    if (tipo !== 'cliente') {
      return res.status(403).json({ error: 'Solo los clientes pueden crear pedidos' })
    }
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' })
    }

    // Obtener dirección del cliente
    const [clienteData] = await db.query(
      'SELECT direccion FROM cliente WHERE cliente_id = ?',
      [userId]
    )
    
    if (clienteData.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    
    const direccionEnvio = clienteData[0].direccion || 'No especificada'

    // Calcular total
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

    // Crear pedido con la dirección del cliente
    const [resultPedido] = await db.query(
      'INSERT INTO pedido (cliente_id, total, estado, direccion_envio) VALUES (?, ?, ?, ?)',
      [userId, total, 'entregado', direccionEnvio]
    )

    const pedidoId = resultPedido.insertId

    // Insertar detalles del pedido y actualizar inventario
    for (const item of items) {
      // Insertar detalle del pedido
      await db.query(
        'INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, item.producto_id, item.cantidad, item.precio, item.precio * item.cantidad]
      )
      
      // Restar cantidad del inventario
      console.log(`Restando ${item.cantidad} del producto ${item.producto_id}`)
      await db.query(
        'UPDATE inventario SET cantidad = cantidad - ? WHERE producto_id = ?',
        [item.cantidad, item.producto_id]
      )
    }

    res.json({
      success: true,
      pedidoId,
      total,
      message: 'Compra realizada exitosamente'
    })
  } catch (error) {
    console.error('Error al crear pedido:', error)
    res.status(500).json({ error: 'Error al procesar la compra' })
  }
}

// Obtener todos los pedidos (admin)
export const obtenerPedidos = async (req, res) => {
  try {
    const [pedidos] = await db.query(`
      SELECT p.*, c.nombre as cliente_nombre, c.correo
      FROM pedido p
      JOIN cliente c ON p.cliente_id = c.cliente_id
      ORDER BY p.fecha DESC
    `)

    res.json({ pedidos })
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}

// Obtener pedidos del cliente logueado
export const misPedidos = async (req, res) => {
  try {
    const { userId, tipo } = req.user
    
    // Solo clientes pueden ver sus propios pedidos
    if (tipo !== 'cliente') {
      return res.status(403).json({ error: 'Solo los clientes pueden ver sus pedidos' })
    }

    const [pedidos] = await db.query(`
      SELECT p.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'producto_id', pd.producto_id,
          'nombre', prod.nombre,
          'cantidad', pd.cantidad,
          'precio_unitario', pd.precio_unitario,
          'imagen_url', prod.imagen_url
        )) FROM pedido_detalle pd 
        JOIN producto prod ON pd.producto_id = prod.producto_id
        WHERE pd.pedido_id = p.pedido_id) as items
      FROM pedido p
      WHERE p.cliente_id = ?
      ORDER BY p.fecha DESC
    `, [userId])

    res.json({ pedidos })
  } catch (error) {
    console.error('Error al obtener mis pedidos:', error)
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}

// Obtener estadísticas de compras por hora (últimas 24 horas)
export const estadisticasComprasPorHora = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        HOUR(fecha) as hora,
        DATE(fecha) as fecha,
        COUNT(*) as cantidad_pedidos,
        SUM(total) as total_ventas
      FROM pedido
      WHERE fecha >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY DATE(fecha), HOUR(fecha)
      ORDER BY fecha DESC, hora DESC
    `)

    res.json({ stats })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

// Obtener estadísticas completas
export const estadisticasGenerales = async (req, res) => {
  try {
    const [totalVentas] = await db.query(`
      SELECT COUNT(*) as total_pedidos, SUM(total) as total_ingresos
      FROM pedido
    `)

    const [ventasPorProducto] = await db.query(`
      SELECT 
        p.nombre,
        p.producto_id,
        SUM(pd.cantidad) as total_cantidad,
        SUM(pd.subtotal) as total_ventas
      FROM pedido_detalle pd
      JOIN producto p ON pd.producto_id = p.producto_id
      GROUP BY p.producto_id, p.nombre
      ORDER BY total_cantidad DESC
    `)

    res.json({
      totalVentas: totalVentas[0],
      ventasPorProducto
    })
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}
