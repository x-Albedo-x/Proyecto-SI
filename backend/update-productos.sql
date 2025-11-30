USE dutch_roots;

-- Agregar columna categoría si no existe
ALTER TABLE producto ADD COLUMN categoria VARCHAR(50) AFTER descripcion;

-- Actualizar productos existentes
UPDATE producto SET categoria = 'Árboles' WHERE producto_id IN (1, 2, 3, 4);

-- Insertar nuevos productos
INSERT INTO producto (nombre, descripcion, categoria, precio, imagen_url) VALUES
('Lavanda', 'Planta aromática con flores púrpuras, perfecta para jardines mediterráneos.', 'Aromáticas', 15.99, 'https://images.unsplash.com/photo-1595784535371-c019d6e30a99?w=400&h=400&fit=crop'),
('Rosal Rojo', 'Hermoso rosal de flores rojas vibrantes, ideal para decoración.', 'Flores', 25.99, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop'),
('Helecho Boston', 'Planta de interior con hojas verdes exuberantes.', 'Interior', 18.99, 'https://images.unsplash.com/photo-1585594612925-ae0c95f15f5d?w=400&h=400&fit=crop'),
('Cactus Saguaro', 'Cactus imponente perfecto para jardines desérticos.', 'Cactus', 35.99, 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Agregar inventario para nuevos productos
INSERT INTO inventario (producto_id, cantidad) 
SELECT p.producto_id, 30 
FROM producto p 
LEFT JOIN inventario i ON p.producto_id = i.producto_id 
WHERE i.inventario_id IS NULL;
