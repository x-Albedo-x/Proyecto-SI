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

### Login
1. El usuario selecciona si es Cliente o Administrador
2. Ingresa correo y contraseña
3. Los datos se envían a:
   - Cliente: `POST /api/auth/login/cliente`
   - Admin: `POST /api/auth/login/usuario`
4. El backend verifica las credenciales
5. Si son correctas, genera un JWT token
6. El frontend guarda el token en localStorage
7. Redirige según el tipo:
   - Cliente → `/` (Home)
   - Admin → `/dashboard`

## Endpoints API

### Autenticación

- **POST** `/api/auth/register`
  - Body: `{ nombre, correo, telefono?, direccion?, password }`
  - Respuesta: `{ message, cliente_id }`

- **POST** `/api/auth/login/cliente`
  - Body: `{ correo, password }`
  - Respuesta: `{ message, token, user }`

- **POST** `/api/auth/login/usuario`
  - Body: `{ correo, password }`
  - Respuesta: `{ message, token, user }`

- **GET** `/api/auth/verify`
  - Headers: `Authorization: Bearer <token>`
  - Respuesta: `{ message, user }`

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
