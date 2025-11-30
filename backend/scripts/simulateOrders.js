import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function simulateOrders() {
  const connection = await pool.getConnection()
  
  try {
    console.log('Iniciando simulación de pedidos...')
    
    // Obtener clientes existentes
    const [clientes] = await connection.query('SELECT cliente_id FROM cliente LIMIT 5')
    
    if (clientes.length === 0) {
      console.log('No hay clientes en la BD. Creando cliente de prueba...')
      await connection.query(
        'INSERT INTO cliente (usuario_id, nombre, apellido, direccion, telefono) VALUES (?, ?, ?, ?, ?)',
        [1, 'Test', 'Cliente', 'Calle Principal 123', '1234567890']
      )
      const [newClientes] = await connection.query('SELECT cliente_id FROM cliente LIMIT 1')
      clientes.push(...newClientes)
    }

    // Obtener productos existentes
    const [productos] = await connection.query('SELECT producto_id, nombre, precio FROM producto LIMIT 10')
    
    if (productos.length === 0) {
      console.log('No hay productos en la BD')
      return
    }

    console.log(`Clientes disponibles: ${clientes.length}`)
    console.log(`Productos disponibles: ${productos.length}`)

    // Simular 24 pedidos distribuidos en las últimas 24 horas
    for (let hora = 0; hora < 24; hora++) {
      const numPedidos = Math.floor(Math.random() * 5) + 1 // 1-5 pedidos por hora
      
      for (let p = 0; p < numPedidos; p++) {
        const clienteId = clientes[Math.floor(Math.random() * clientes.length)].cliente_id
        
        // Crear timestamp hace X horas
        const ahora = new Date()
        ahora.setHours(ahora.getHours() - hora)
        ahora.setMinutes(Math.floor(Math.random() * 60))
        ahora.setSeconds(Math.floor(Math.random() * 60))
        
        // Seleccionar 1-3 productos aleatorios
        const numItems = Math.floor(Math.random() * 3) + 1
        const itemsSeleccionados = new Set()
        while (itemsSeleccionados.size < numItems) {
          itemsSeleccionados.add(Math.floor(Math.random() * productos.length))
        }
        
        let totalPedido = 0
        const items = []
        
        Array.from(itemsSeleccionados).forEach(idx => {
          const cantidad = Math.floor(Math.random() * 5) + 1
          const subtotal = productos[idx].precio * cantidad
          totalPedido += subtotal
          items.push({
            producto_id: productos[idx].producto_id,
            cantidad,
            precio_unitario: productos[idx].precio,
            subtotal
          })
        })

        // Insertar pedido
        const [result] = await connection.query(
          'INSERT INTO pedido (cliente_id, total, estado, fecha, direccion_envio) VALUES (?, ?, ?, ?, ?)',
          [clienteId, totalPedido, 'entregado', ahora, 'Dirección de envío']
        )

        const pedidoId = result.insertId

        // Insertar detalles del pedido
        for (const item of items) {
          await connection.query(
            'INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
            [pedidoId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
          )
        }

        console.log(`✓ Pedido #${pedidoId} creado - Total: $${totalPedido.toFixed(2)} (hace ${hora}h)`)
      }
    }

    console.log('\n✅ Simulación completada!')
    
    // Mostrar estadísticas
    const [stats] = await connection.query(`
      SELECT 
        COUNT(*) as total_pedidos,
        SUM(total) as total_ventas,
        DATE(fecha) as fecha
      FROM pedido
      WHERE fecha >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY DATE(fecha)
    `)
    
    console.log('\nEstadísticas de hoy:')
    console.log(stats)

  } catch (error) {
    console.error('Error durante la simulación:', error)
  } finally {
    await connection.release()
    await pool.end()
  }
}

simulateOrders()
