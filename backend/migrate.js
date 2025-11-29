import pool from './config/database.js';

async function migrateDatabase() {
  try {
    console.log('Iniciando migración de base de datos...');

    // Agregar columna avatar_url a tabla usuario
    console.log('Agregando columna avatar_url a tabla usuario...');
    try {
      await pool.query('ALTER TABLE usuario ADD COLUMN avatar_url LONGTEXT');
      console.log('✓ Columna avatar_url agregada a usuario');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('✓ Columna avatar_url ya existe en usuario');
      } else {
        throw error;
      }
    }

    // Agregar columna avatar_url a tabla cliente
    console.log('Agregando columna avatar_url a tabla cliente...');
    try {
      await pool.query('ALTER TABLE cliente ADD COLUMN avatar_url LONGTEXT');
      console.log('✓ Columna avatar_url agregada a cliente');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('✓ Columna avatar_url ya existe en cliente');
      } else {
        throw error;
      }
    }

    console.log('\n✓ Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en migración:', error);
    process.exit(1);
  }
}

migrateDatabase();
