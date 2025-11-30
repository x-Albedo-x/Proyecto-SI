import pool from '../config/database.js';

async function seed() {
  try {
    const products = [
      { nombre: 'Lavanda', descripcion: 'Planta aromática con flores púrpuras, perfecta para jardines mediterráneos.', categoria: 'Aromáticas', precio: 15.99, imagen_url: 'https://images.unsplash.com/photo-1595784535371-c019d6e30a99?w=600&h=400&fit=crop' },
      { nombre: 'Rosal Rojo', descripcion: 'Hermoso rosal de flores rojas vibrantes, ideal para decoración.', categoria: 'Flores', precio: 25.99, imagen_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop' },
      { nombre: 'Helecho Boston', descripcion: 'Planta de interior con hojas verdes exuberantes.', categoria: 'Interior', precio: 18.99, imagen_url: 'https://images.unsplash.com/photo-1585594612925-ae0c95f15f5d?w=600&h=400&fit=crop' },
      { nombre: 'Cactus Saguaro', descripcion: 'Cactus imponente perfecto para jardines desérticos.', categoria: 'Cactus', precio: 35.99, imagen_url: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&h=400&fit=crop' },
      { nombre: 'Roble Americano', descripcion: 'Árbol robusto ideal para sombra y paisajismo.', categoria: 'Árboles', precio: 69.99, imagen_url: 'https://images.unsplash.com/photo-1558583082-c61b9bb6e14e?w=600&h=400&fit=crop' },
      { nombre: 'Pino Enano', descripcion: 'Conífera perenne de bajo mantenimiento.', categoria: 'Árboles', precio: 39.99, imagen_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop' }
    ];

    // Ensure categoria column exists
    await pool.query("ALTER TABLE producto ADD COLUMN IF NOT EXISTS categoria VARCHAR(50) AFTER descripcion");

    // Insert products
    for (const p of products) {
      const [res] = await pool.query(
        'INSERT INTO producto (nombre, descripcion, categoria, precio, imagen_url) VALUES (?, ?, ?, ?, ?)',
        [p.nombre, p.descripcion, p.categoria, p.precio, p.imagen_url]
      );
      const producto_id = res.insertId;
      await pool.query('INSERT INTO inventario (producto_id, cantidad) VALUES (?, ?)', [producto_id, 30]);
    }

    console.log('Seed de productos completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err.message);
    process.exit(1);
  }
}

seed();
