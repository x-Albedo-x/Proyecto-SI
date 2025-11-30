import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Actualizar perfil del usuario/cliente (nombre, email, teléfono, dirección, avatar)
export async function actualizarPerfil(req, res) {
  try {
    console.log('=== ACTUALIZAR PERFIL ===');
    const { userId, tipo } = req.user; // tipo: 'cliente' o 'usuario'
    const { nombre, correo, telefono, direccion, avatar_url } = req.body;

    console.log('userId:', userId, 'tipo:', tipo);
    console.log('Body recibido:', { nombre, correo, telefono, direccion, avatar_url });

    // Determinar tabla según tipo de usuario
    const tabla = tipo === 'cliente' ? 'cliente' : 'usuario';
    const idField = tipo === 'cliente' ? 'cliente_id' : 'usuario_id';

    // Validar que el usuario existe
    const [user] = await pool.query(
      `SELECT * FROM ${tabla} WHERE ${idField} = ?`,
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se intenta cambiar el correo, verificar que sea único
    if (correo && correo !== user[0].correo) {
      const [existing] = await pool.query(
        `SELECT * FROM ${tabla} WHERE correo = ?`,
        [correo]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
    }

    // Construir query dinámica según campos a actualizar
    const updates = [];
    const values = [];

    if (nombre) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (correo) {
      updates.push('correo = ?');
      values.push(correo);
    }
    
    // Solo actualizar telefono y direccion si es cliente (tabla cliente tiene esas columnas)
    if (tipo === 'cliente') {
      if (telefono !== undefined) {
        updates.push('telefono = ?');
        values.push(telefono || null);
      }
      if (direccion !== undefined) {
        updates.push('direccion = ?');
        values.push(direccion || null);
      }
    }
    
    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      values.push(avatar_url || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    values.push(userId);

    const query = `UPDATE ${tabla} SET ${updates.join(', ')} WHERE ${idField} = ?`;
    console.log('Query:', query, 'Values:', values);
    
    const updateResult = await pool.query(query, values);
    console.log('Update result:', updateResult);

    // Retornar usuario actualizado
    const selectFields = tipo === 'cliente' 
      ? `${idField} as id, nombre, correo, telefono, direccion, avatar_url, 'cliente' as tipo`
      : `${idField} as id, nombre, correo, avatar_url, 'usuario' as tipo`;
      
    console.log('Fetching updated user with query:', `SELECT ${selectFields} FROM ${tabla} WHERE ${idField} = ?`, 'userId:', userId);
    
    const [updated] = await pool.query(
      `SELECT ${selectFields} FROM ${tabla} WHERE ${idField} = ?`,
      [userId]
    );

    console.log('Updated data:', updated);

    if (!updated || updated.length === 0) {
      console.error('No se encontró el usuario actualizado');
      return res.status(404).json({ error: 'Usuario no encontrado después de actualizar' });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      usuario: updated[0]
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil', details: error.message });
  }
}

// Cambiar contraseña del usuario/cliente
export async function cambiarContrasena(req, res) {
  try {
    const { userId, tipo } = req.user;
    const { contrasenaActual, contrasenaNueva, confirmar } = req.body;

    // Validaciones
    if (!contrasenaActual || !contrasenaNueva || !confirmar) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (contrasenaNueva !== confirmar) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    if (contrasenaNueva.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres' });
    }

    // Determinar tabla según tipo
    const tabla = tipo === 'cliente' ? 'cliente' : 'usuario';
    const idField = tipo === 'cliente' ? 'cliente_id' : 'usuario_id';

    // Obtener usuario actual
    const [user] = await pool.query(
      `SELECT * FROM ${tabla} WHERE ${idField} = ?`,
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasenaActual, user[0].password);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(contrasenaNueva, 10);

    // Actualizar contraseña
    await pool.query(
      `UPDATE ${tabla} SET password = ? WHERE ${idField} = ?`,
      [hashedPassword, userId]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
}

// Obtener perfil actual
export async function obtenerPerfil(req, res) {
  try {
    console.log('=== OBTENER PERFIL ===');
    console.log('req.user:', req.user);
    
    if (!req.user) {
      console.error('No req.user found');
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { userId, tipo } = req.user;
    
    console.log('userId:', userId, 'tipo:', tipo);

    if (!userId || !tipo) {
      return res.status(400).json({ error: 'Datos de usuario incompletos en token' });
    }

    const tabla = tipo === 'cliente' ? 'cliente' : 'usuario';
    const idField = tipo === 'cliente' ? 'cliente_id' : 'usuario_id';

    console.log('Buscando en tabla:', tabla, 'con id:', idField, '=', userId);

    const selectFields = tipo === 'cliente' 
      ? `${idField} as id, nombre, correo, telefono, direccion, avatar_url, created_at, 'cliente' as tipo`
      : `${idField} as id, nombre, correo, avatar_url, created_at, 'usuario' as tipo`;

    const query = `SELECT ${selectFields} FROM ${tabla} WHERE ${idField} = ?`;
    console.log('Query:', query);
    
    const [user] = await pool.query(query, [userId]);
    
    console.log('Usuario encontrado:', user);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Asegurar que telefono y direccion existan para admin
    if (tipo === 'usuario') {
      user[0].telefono = user[0].telefono || '';
      user[0].direccion = user[0].direccion || '';
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
