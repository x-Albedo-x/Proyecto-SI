import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Registro de cliente
export const registerCliente = async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion, password } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son requeridos' });
    }

    // Verificar si el correo ya existe
    const [existingCliente] = await pool.query(
      'SELECT cliente_id FROM cliente WHERE correo = ?',
      [correo]
    );

    if (existingCliente.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo cliente
    const [result] = await pool.query(
      'INSERT INTO cliente (nombre, correo, telefono, direccion, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, telefono, direccion, hashedPassword]
    );

    res.status(201).json({
      message: 'Cliente registrado exitosamente',
      cliente_id: result.insertId
    });
  } catch (error) {
    console.error('Error en registro de cliente:', error);
    res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
  }
};

// Login de cliente
export const loginCliente = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Buscar cliente
    const [clientes] = await pool.query(
      'SELECT cliente_id, nombre, correo, password, telefono, direccion FROM cliente WHERE correo = ?',
      [correo]
    );

    if (clientes.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const cliente = clientes[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, cliente.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: cliente.cliente_id, 
        correo: cliente.correo,
        tipo: 'cliente'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover password de la respuesta
    delete cliente.password;

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        ...cliente,
        tipo: 'cliente'
      }
    });
  } catch (error) {
    console.error('Error en login de cliente:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Login de usuario (administrador/vendedor)
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario
    const [usuarios] = await pool.query(
      'SELECT usuario_id, nombre, correo, password, rol FROM usuario WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, usuario.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.usuario_id, 
        correo: usuario.correo,
        rol: usuario.rol,
        tipo: 'usuario'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover password de la respuesta
    delete usuario.password;

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        ...usuario,
        tipo: 'usuario'
      }
    });
  } catch (error) {
    console.error('Error en login de usuario:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Login unificado - detecta automáticamente si es cliente o usuario
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Primero buscar en tabla cliente
    const [clientes] = await pool.query(
      'SELECT cliente_id as id, nombre, correo, password, telefono, direccion FROM cliente WHERE correo = ?',
      [correo]
    );

    if (clientes.length > 0) {
      const cliente = clientes[0];
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, cliente.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: cliente.id, 
          correo: cliente.correo,
          tipo: 'cliente'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remover password de la respuesta
      delete cliente.password;

      return res.json({
        message: 'Login exitoso',
        token,
        user: {
          ...cliente,
          tipo: 'cliente'
        }
      });
    }

    // Si no es cliente, buscar en tabla usuario
    const [usuarios] = await pool.query(
      'SELECT usuario_id as id, nombre, correo, password, rol FROM usuario WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, usuario.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id, 
        correo: usuario.correo,
        rol: usuario.rol,
        tipo: 'usuario'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover password de la respuesta
    delete usuario.password;

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        ...usuario,
        tipo: 'usuario'
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Verificar token
export const verifyTokenController = async (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.user
  });
};
