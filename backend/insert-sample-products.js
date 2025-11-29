import pool from './config/database.js';

async function insertSampleProducts() {
  try {
    const productos = [
      {
        nombre: 'Monstera Deliciosa',
        descripcion: 'Planta de interior popular con hojas grandes y verdes',
        categoria: 'Interior',
        precio: 45.99,
        imagen_url: 'https://images.unsplash.com/photo-1572442694577-6e97c3ad1e4c?w=400&h=400&fit=crop',
        stock: 15
      },
      {
        nombre: 'Pothos Dorado',
        descripcion: 'Planta trepadora resistente ideal para decorar espacios',
        categoria: 'Interior',
        precio: 25.50,
        imagen_url: 'https://images.unsplash.com/photo-1531069752525-c89ca6ffce51?w=400&h=400&fit=crop',
        stock: 20
      },
      {
        nombre: 'Rosa Roja Premium',
        descripcion: 'Hermosa rosa fresca roja para decoración y ramos',
        categoria: 'Flores',
        precio: 12.99,
        imagen_url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop',
        stock: 50
      },
      {
        nombre: 'Orquídea Blanca',
        descripcion: 'Orquídea elegante y exótica color blanco',
        categoria: 'Flores',
        precio: 35.00,
        imagen_url: 'https://images.unsplash.com/photo-1582136579312-94f3e6e8a3aa?w=400&h=400&fit=crop',
        stock: 10
      },
      {
        nombre: 'Cactus Saguaro',
        descripcion: 'Cactus decorativo resistente al calor y sequedad',
        categoria: 'Suculentas',
        precio: 18.75,
        imagen_url: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop',
        stock: 25
      },
      {
        nombre: 'Lavanda Aromática',
        descripcion: 'Planta aromática con flores púrpuras, perfecta para jardines',
        categoria: 'Aromáticas',
        precio: 15.99,
        imagen_url: 'https://images.unsplash.com/photo-1595784535371-c019d6e30a99?w=400&h=400&fit=crop',
        stock: 35
      },
      {
        nombre: 'Helecho Boston',
        descripcion: 'Planta de interior con hojas verdes exuberantes',
        categoria: 'Interior',
        precio: 18.99,
        imagen_url: 'https://images.unsplash.com/photo-1585594612925-ae0c95f15f5d?w=400&h=400&fit=crop',
        stock: 12
      },
      {
        nombre: 'Aloe Vera',
        descripcion: 'Suculenta medicinal con propiedades terapéuticas',
        categoria: 'Suculentas',
        precio: 22.00,
        imagen_url: 'https://images.unsplash.com/photo-1596547014907-c4c5518401b7?w=400&h=400&fit=crop',
        stock: 30
      }
    ];

    for (const prod of productos) {
      const [result] = await pool.query(
        'INSERT INTO producto (nombre, descripcion, categoria, precio, imagen_url) VALUES (?, ?, ?, ?, ?)',
        [prod.nombre, prod.descripcion, prod.categoria, prod.precio, prod.imagen_url]
      );

      const producto_id = result.insertId;
      await pool.query(
        'INSERT INTO inventario (producto_id, cantidad) VALUES (?, ?)',
        [producto_id, prod.stock]
      );

      console.log(`✓ ${prod.nombre} insertado`);
    }

    console.log('\n✅ Todos los productos han sido insertados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar productos:', error);
    process.exit(1);
  }
}

insertSampleProducts();
