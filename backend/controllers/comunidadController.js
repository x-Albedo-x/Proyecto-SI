import pool from '../config/database.js'

// Obtener todos los comentarios de la comunidad
export const obtenerComentarios = async (req, res) => {
  try {
    const [comentarios] = await pool.query(`
      SELECT 
        c.id,
        c.cliente_id,
        c.producto_id,
        c.texto,
        c.calificacion,
        c.fecha,
        c.imagen_url,
        cl.nombre,
        cl.avatar_url,
        p.nombre as producto_nombre
      FROM comentarios_comunidad c
      JOIN cliente cl ON c.cliente_id = cl.cliente_id
      LEFT JOIN producto p ON c.producto_id = p.producto_id
      ORDER BY c.fecha DESC
    `)

    res.json({ comentarios })
  } catch (error) {
    console.error('Error al obtener comentarios:', error)
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}

// Crear un nuevo comentario
export const crearComentario = async (req, res) => {
  try {
    const { userId } = req.user
    const { texto, producto_id, calificacion, imagen_url } = req.body

    if (!texto || texto.trim().length === 0) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' })
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' })
    }

    // Verificar que el cliente existe
    const [cliente] = await pool.query(
      'SELECT cliente_id FROM cliente WHERE cliente_id = ?',
      [userId]
    )

    if (cliente.length === 0) {
      return res.status(403).json({ error: 'Solo los clientes pueden comentar' })
    }

    // Insertar comentario
    const [result] = await pool.query(
      `INSERT INTO comentarios_comunidad (cliente_id, producto_id, texto, calificacion, imagen_url, fecha)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, producto_id || null, texto, calificacion, imagen_url || null]
    )

    const comentarioId = result.insertId

    // Retornar el comentario creado
    const [nuevoComentario] = await pool.query(`
      SELECT 
        c.id,
        c.cliente_id,
        c.producto_id,
        c.texto,
        c.calificacion,
        c.fecha,
        c.imagen_url,
        cl.nombre,
        cl.avatar_url,
        p.nombre as producto_nombre
      FROM comentarios_comunidad c
      JOIN cliente cl ON c.cliente_id = cl.cliente_id
      LEFT JOIN producto p ON c.producto_id = p.producto_id
      WHERE c.id = ?
    `, [comentarioId])

    res.status(201).json({
      message: 'Comentario publicado exitosamente',
      comentario: nuevoComentario[0]
    })
  } catch (error) {
    console.error('Error al crear comentario:', error)
    res.status(500).json({ error: 'Error al publicar el comentario' })
  }
}

// Eliminar comentario
export const eliminarComentario = async (req, res) => {
  try {
    const { userId } = req.user
    const { comentarioId } = req.params

    // Verificar que el comentario existe y pertenece al usuario
    const [comentario] = await pool.query(
      'SELECT * FROM comentarios_comunidad WHERE id = ?',
      [comentarioId]
    )

    if (comentario.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    if (comentario[0].cliente_id !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' })
    }

    // Eliminar comentario
    await pool.query(
      'DELETE FROM comentarios_comunidad WHERE id = ?',
      [comentarioId]
    )

    res.json({ message: 'Comentario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    res.status(500).json({ error: 'Error al eliminar el comentario' })
  }
}

// Obtener comentarios de un producto específico
export const obtenerComentariosProducto = async (req, res) => {
  try {
    const { productoId } = req.params

    const [comentarios] = await pool.query(`
      SELECT 
        c.id,
        c.cliente_id,
        c.producto_id,
        c.texto,
        c.calificacion,
        c.fecha,
        c.imagen_url,
        cl.nombre,
        cl.avatar_url
      FROM comentarios_comunidad c
      JOIN cliente cl ON c.cliente_id = cl.cliente_id
      WHERE c.producto_id = ?
      ORDER BY c.fecha DESC
    `, [productoId])

    res.json({ comentarios })
  } catch (error) {
    console.error('Error al obtener comentarios del producto:', error)
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}
