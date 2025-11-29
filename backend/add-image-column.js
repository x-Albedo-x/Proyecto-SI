import pool from './config/database.js'

async function addImageColumn() {
  try {
    const sql = 'ALTER TABLE comentarios_comunidad ADD COLUMN imagen_url LONGTEXT'
    await pool.query(sql)
    console.log('✓ Columna imagen_url agregada a comentarios_comunidad')
    process.exit(0)
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Columna imagen_url ya existe')
      process.exit(0)
    }
    console.error('Error:', error.message)
    process.exit(1)
  }
}

addImageColumn()
