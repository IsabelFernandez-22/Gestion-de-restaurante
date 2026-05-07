# 🍗🍔 Doña Choca - Sistema de Gestión de Restaurante

[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com)

Sistema de punto de venta (POS) para restaurantes de pollos y hamburguesas. Gestiona pedidos, cocina, facturación y reportes en tiempo real.

---

## 📋 Tabla de Contenidos

1. [Características](#características)
2. [Tecnologías](#tecnologías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación](#instalación)
6. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
7. [Credenciales por Defecto](#credenciales-por-defecto)
8. [API Endpoints](#api-endpoints)
9. [Funcionalidades por Rol](#funcionalidades-por-rol)
10. [Base de Datos](#base-de-datos)
11. [Licencia](#licencia)

---

## ✨ Características

### 🧾 Caja (Cajero)
- Crear pedidos con selección de productos
- Gestionar carrito de compras (agregar/quitar items)
- Generar facturas automáticas
- Ver pedidos activos en tiempo real
- Cierre de caja al final del turno

### 👨‍🍳 Cocina (Cocinero)
- Ver pedidos pendientes en tiempo real
- Actualizar estado de pedidos (En preparación → Listo → Entregado)
- Control de stock (marcar productos como disponibles/agotados)
- Notificaciones de productos agotados

### 📊 Administrador
- Reporte de caja (diario y por rango de fechas)
- Reporte de platos y bebidas vendidas
- Reporte de rendimiento por cajero
- Gestión de usuarios (crear, editar, eliminar)
- Ver todas las facturas generadas
- Control de inventario

---

## 🛠️ Tecnologías

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React | 19.x |
| Backend | Node.js | - |
| Servidor API | Express.js | 5.x |
| Base de Datos | MySQL | 8.x |
| Autenticación | JWT (jsonwebtoken) | 9.x |
| Encriptación | bcrypt | 6.x |
| driver MySQL | mysql2 | 3.x |

---

## 📁 Estructura del Proyecto

```
mi-app/
│
├── api/                        # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js         # Configuración de conexión MySQL
│   ├── controllers/
│   │   ├── facturasController.js
│   │   ├── notificacionesController.js
│   │   ├── pedidosController.js
│   │   ├── productosController.js
│   │   ├── reportesController.js
│   │   └── usuariosController.js
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── facturas.js
│   │   ├── notificaciones.js
│   │   ├── pedidos.js
│   │   ├── productos.js
│   │   ├── reportes.js
│   │   └── usuarios.js
│   └── index.js                 # Servidor Express
│
├── src/                        # Frontend (React)
│   ├── estilos/                 # Archivos CSS
│   │   ├── Admin.css
│   │   ├── Caja.css
│   │   ├── Cocina.css
│   │   ├── CierreCaja.css
│   │   ├── Facturas.css
│   │   └── Login.css
│   ├── servicios/
│   │   └── api.js               # Cliente API
│   ├── vistas/                  # Componentes de vistas
│   │   ├── Admin.js
│   │   ├── Caja.js
│   │   ├── Cocina.js
│   │   ├── CierreCaja.js
│   │   ├── Facturas.js
│   │   └── Login.js
│   ├── App.js                   # Router principal
│   ├── App.css
│   ├── index.js                 # Punto de entrada
│   └── index.css
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── manifest.json
│
├── package.json
└── dona_choca.sql               # Schema de base de datos
```

---

## 📦 Requisitos Previos

- **Node.js** (v14 o superior)
- **MySQL** (v8.0 o superior)
- **npm** o **yarn**

---

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd mi-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos

1. Abrir MySQL (phpMyAdmin, XAMPP, MySQL Workbench, etc.)
2. Crear una nueva base de datos llamada `dona_choca`
3. Importar el archivo `dona_choca.sql`:

```bash
mysql -u root -p dona_choca < dona_choca.sql
```

O desde phpMyAdmin:
- Seleccionar la base de datos
- Ir a "Importar" → seleccionar `dona_choca.sql` → "Continuar"

### 4. Configurar credenciales de MySQL (opcional)

El proyecto está configurado por defecto con:
- **Host**: localhost
- **Usuario**: root
- **Contraseña**: (vacía)
- **Base de datos**: dona_choca

Si necesitas cambiar esto, editar `api/config/database.js`.

---

## ▶️ Ejecutar el Proyecto

### Opción 1: Ejecutar ambos servidores (recomendado)

```bash
npm run dev
```

Esto iniciara:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:3000`

### Opción 2: Ejecutar por separado

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm start
```

---

## 👤 Credenciales por Defecto

| Rol | Usuario | Contraseña | Descripción |
|-----|---------|------------|-------------|
| Administrador | `admin` | `admin123` | Acceso total al sistema |
| Cajero | `cajero` | `cajero123` | Punto de venta y facturación |
| Cocina | `cocina` | `cocina123` | Gestión de pedidos y stock |

---

## 🌐 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/usuarios/login` | Iniciar sesión |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| PUT | `/api/productos/:id/disponibilidad` | Actualizar disponibilidad |

### Pedidos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Listar pedidos (con filtros de fecha) |
| GET | `/api/pedidos/en-preparacion` | Pedidos en preparación |
| POST | `/api/pedidos` | Crear nuevo pedido |
| PUT | `/api/pedidos/:id/estado` | Actualizar estado del pedido |
| DELETE | `/api/pedidos/:id` | Eliminar pedido |

### Facturas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/facturas` | Listar facturas (con filtros de fecha) |
| GET | `/api/facturas/:id` | Ver detalles de una factura |
| POST | `/api/facturas` | Crear factura |

### Reportes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reportes/caja` | Reporte de caja por fecha |
| GET | `/api/reportes/caja-fechas` | Reporte por rango de fechas |
| GET | `/api/reportes/platos` | Platos y bebidas vendidas |
| GET | `/api/reportes/cajeros` | Rendimiento por cajero |
| GET | `/api/reportes/cierre-caja` | Datos para cierre de caja |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id/password` | Cambiar contraseña |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

---

## 👥 Funcionalidades por Rol

### Administrador (admin)
- ✅ Ver todos los pedidos y facturas
- ✅ Generar reportes de ventas
- ✅ Gestionar usuarios (crear, editar, eliminar)
- ✅ Control de inventario
- ✅ Ver historial de transacciones

### Cajero (cajero)
- ✅ Crear nuevos pedidos
- ✅ Gestionar carrito de compras
- ✅ Generar facturas
- ✅ Ver pedidos activos
- ✅ Realizar cierre de caja

### Cocina (cocina)
- ✅ Ver pedidos pendientes
- ✅ Actualizar estado de pedidos
- ✅ Control de stock (disponible/agotado)
- ✅ Recibir notificaciones de productos

---

## 🗄️ Base de Datos

### Tablas del Sistema

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios del sistema (admin, cajero, cocina) |
| `productos` | Menú del restaurante |
| `pedidos` | Pedidos realizados |
| `detalle_pedidos` | Items de cada pedido |
| `facturas` | Facturas generadas |
| `notificaciones` | Alertas de productos agotados |

### Productos del Menú (por defecto)

**Pollo:**
- Cuarto de pollo - Bs. 25.00
- Octavo de pollo - Bs. 15.00

**Hamburguesas:**
- Hamburguesa simple - Bs. 30.00
- Hamburguesa con papas - Bs. 45.00

**Sodas 2 Litros:**
- Coca-Cola 2L - Bs. 25.00
- Fanta 2L - Bs. 25.00
- Sprite 2L - Bs. 25.00

**Sodas Popular:**
- Coca-Cola popular - Bs. 12.00
- Fanta popular - Bs. 12.00
- Sprite popular - Bs. 12.00

---

## 📄 Licencia

Proyecto académico - Diseño Web II

---

## 🐛 Solución de Problemas

### Error de conexión a MySQL
Verificar que MySQL esté ejecutándose y que las credenciales en `api/config/database.js` sean correctas.

### Puerto en uso
Si el puerto 3000 o 3001 está en uso, cerrar las aplicaciones que los estén usando o cambiar los puertos en la configuración.

### Token expirado
Cerrar sesión y volver a iniciar para obtener un nuevo token JWT.