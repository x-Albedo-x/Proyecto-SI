import pool from './config/database.js'

async function createCommunitiesTable() {
  try {
    const sql = `CREATE TABLE IF NOT EXISTS comentarios_comunidad (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cliente_id INT NOT NULL,
      producto_id INT,
      texto TEXT NOT NULL,
      calificacion INT NOT NULL DEFAULT 5 CHECK (calificacion BETWEEN 1 AND 5),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id) ON DELETE CASCADE,
      FOREIGN KEY (producto_id) REFERENCES producto(producto_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    
    await pool.query(sql)
    console.log('✓ Tabla comentarios_comunidad creada exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('Error al crear tabla:', error.message)
    process.exit(1)
  }
}

createCommunitiesTable()
