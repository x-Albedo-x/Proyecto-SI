# Dutch Roots - Sistema de Vivero de Plantas

## Configuración del Proyecto

### 1. Base de Datos

1. Asegúrate de tener MySQL instalado y corriendo
2. Ejecuta el archivo `backend/database.sql` para crear la base de datos y las tablas:

```bash
mysql -u root -p < backend/database.sql
```

O importa el archivo desde MySQL Workbench o phpMyAdmin.

### 2. Configurar Backend

1. Navega al directorio backend:
```bash
cd backend
```

2. Las dependencias ya están instaladas, pero si necesitas reinstalar:
```bash
npm install
```

3. Configura el archivo `.env` con tus credenciales de MySQL:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=dutch_roots
JWT_SECRET=tu_clave_secreta_muy_segura
```

4. Crear usuario administrador:
Ejecuta este script en MySQL para crear un usuario admin de prueba:
```sql
USE dutch_roots;
-- Password: admin123
INSERT INTO usuario (nombre, correo, password, rol) VALUES 
('Administrador', 'admin@dutchroots.com', '$2b$10$rQJ5xKxW8vX.zZ5qZ5qZ5O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'administrador');
```

5. Inicia el servidor backend:
```bash
npm run dev
```

El backend estará corriendo en `http://localhost:3000`

### 3. Configurar Frontend

1. En otra terminal, navega al directorio frontend:
```bash
cd frontend
```

2. Las dependencias ya están instaladas (incluyendo axios)

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## Estructura del Proyecto

```
proyecto-si/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a MySQL
│   ├── controllers/
│   │   └── authController.js    # Controladores de autenticación
│   ├── middleware/
│   │   └── auth.js              # Middleware de verificación de token
│   ├── routes/
│   │   └── authRoutes.js        # Rutas de autenticación
│   ├── .env                     # Variables de entorno
│   ├── database.sql             # Script de creación de BD
│   ├── package.json
│   └── server.js                # Servidor principal
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── NavBar.vue
    │   │   └── ProductCard.vue
    │   ├── services/
    │   │   ├── api.js           # Configuración de axios
    │   │   └── authService.js   # Servicios de autenticación
    │   ├── views/
    │   │   ├── HomeView.vue
    │   │   ├── LoginView.vue
    │   │   ├── RegisterView.vue
    │   │   └── DashboardView.vue
    │   ├── router/
    │   │   └── index.js
    │   └── App.vue
    └── package.json

## Flujo de Autenticación

### Registro de Cliente
1. El cliente llena el formulario en `/register`
2. Los datos se envían a `POST /api/auth/register`
3. El backend hashea la contraseña con bcrypt
4. Se crea el registro en la tabla `cliente`
5. Redirige al login

### Login (Unificado)
1. El usuario ingresa correo y contraseña
2. Los datos se envían a `POST /api/auth/login`
3. El backend detecta si el correo pertenece a `cliente` o `usuario`
4. Si las credenciales son correctas, genera un JWT token
5. El frontend guarda el token en `localStorage` y consulta `/api/perfil` para completar el perfil
6. Redirecciones sugeridas:
  - Cliente → `/` (Home)
  - Usuario (admin/vendedor) → `/dashboard`

## Endpoints API (actual)

### Autenticación

- **POST** `/api/auth/register`
  - Body: `{ nombre, correo, telefono?, direccion?, password }`
  - Respuesta: `{ message, cliente_id }`

- **POST** `/api/auth/login` (unificado)
  - Body: `{ correo, password }`
  - Respuesta: `{ message, token, user }` (user incluye `tipo: 'cliente'|'usuario'` y para `usuario` el `rol`)

- (Compat) **POST** `/api/auth/login/cliente` y `/api/auth/login/usuario`
  - Mantendidos para compatibilidad con clientes antiguos

- **GET** `/api/auth/verify`
  - Headers: `Authorization: Bearer <token>`
  - Respuesta: `{ message, user }`

### Perfil

- **GET** `/api/perfil`
  - Headers: `Authorization: Bearer <token>`
  - Respuesta: Perfil del usuario/cliente autenticado

- **PUT** `/api/perfil`
  - Body: `{ nombre?, correo?, telefono?, direccion?, avatar_url? }`
  - Actualiza datos del perfil. Para `usuario` (admin/vendedor) no aplica `telefono`/`direccion`.

- **POST** `/api/perfil/cambiar-contrasena`
  - Body: `{ contrasenaActual, contrasenaNueva, confirmar }`

### Productos

- **GET** `/api/productos`
  - Query opcional: `categoria`, `precioMin`, `precioMax`, `busqueda`, `ordenar`
  - Respuesta: `{ success, count, productos }` con `stock` desde `inventario`

- **GET** `/api/productos/categorias`
- **GET** `/api/productos/:id`

- (Admin) **POST** `/api/productos`
- (Admin) **PUT** `/api/productos/:id`
- (Admin) **PUT** `/api/productos/:id/stock`
- (Admin) **DELETE** `/api/productos/:id`

### Pedidos

- (Cliente) **POST** `/api/pedidos/crear`
  - Body: `{ items: [{ producto_id, cantidad, precio }] }`

- (Cliente) **GET** `/api/pedidos/mis-pedidos`

- (Admin - testing) **GET** `/api/pedidos/admin/todos`
- (Admin - testing) **GET** `/api/pedidos/admin/estadisticas-hora`
- (Admin - testing) **GET** `/api/pedidos/admin/estadisticas`

### Comunidad

- **GET** `/api/comunidad/comentarios`
- **GET** `/api/comunidad/comentarios/:productoId`
- **POST** `/api/comunidad/comentarios` (autenticado)
- **DELETE** `/api/comunidad/comentarios/:comentarioId` (autenticado y dueño)

## Usuarios de Prueba

### Administrador
- Email: `admin@dutchroots.com`
- Password: `admin123`

### Cliente
Regístrate desde `/register`

## Tecnologías Utilizadas

### Backend
- Node.js + Express
- MySQL2 (conexión a base de datos)
- bcrypt (hash de contraseñas)
- jsonwebtoken (autenticación JWT)
- cors (manejo de CORS)
- dotenv (variables de entorno)

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Axios (peticiones HTTP)
- Vite (build tool)

## Próximos Pasos

- [ ] Implementar guards de autenticación en rutas
- [ ] Crear CRUD de productos
- [ ] Implementar carrito de compras
- [ ] Sistema de pedidos
- [ ] Panel de administración completo
- [ ] Integración de pagos

## Notas de despliegue y ejecución

- Asegúrate de ejecutar `backend/update-productos.sql` si vienes de una BD creada con `database.sql` antiguo, para añadir la columna `categoria` usada por el frontend/backend:

```bash
mysql -u root -p < backend/update-productos.sql
```

- En Windows PowerShell, comandos típicos:

```pwsh
cd "C:\Escuela\LenguajesModernos\Proyecto-SI\backend"
npm install
node server.js

cd "C:\Escuela\LenguajesModernos\Proyecto-SI\frontend"
npm install
npm run dev
```

- Variables de entorno requeridas por el backend: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.

- Seguridad: los endpoints `/api/pedidos/admin/*` están sin guard de admin por testing. En producción, proteger con middleware `verifyAdmin` y validar `rol==='administrador'`.
