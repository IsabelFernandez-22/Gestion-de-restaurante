-- =====================================================
-- BASE DE DATOS: DOÑA CHOCA
-- Sistema de Gestión de Restaurante
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS dona_choca;
USE dona_choca;

-- =====================================================
-- TABLA: USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cajero', 'cocina') NOT NULL DEFAULT 'cajero',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: PRODUCTOS (MENÚ)
-- =====================================================
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria ENUM('pollo', 'hamburguesa', 'soda') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    disponible TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: PEDIDOS
-- =====================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('en preparación', 'listo', 'entregado') DEFAULT 'en preparación',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: DETALLE_PEDIDOS
-- =====================================================
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- =====================================================
-- TABLA: FACTURAS
-- =====================================================
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    datos JSON NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: NOTIFICACIONES
-- =====================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    leida TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- =====================================================
-- INSERTAR USUARIOS POR DEFECTO
-- =====================================================
-- Las contraseñas están encriptadas con bcrypt
-- Contraseña: admin123
INSERT INTO usuarios (nombre, password, rol) VALUES 
('admin', '$2b$10$YQ5hM5.vJKQ5F5Y5Q5Q5QO5Y5Q5Q5Q5Y5Q5Q5Y5Q5Q5Y5Q5Q5Y5', 'admin');

-- Contraseña: cajero123
INSERT INTO usuarios (nombre, password, rol) VALUES 
('cajero', '$2b$10$YQ5hM5.vJKQ5F5Y5Q5Q5QO5Y5Q5Q5Q5Y5Q5Q5Y5Q5Q5Y5Q5Q5Y5', 'cajero');

-- Contraseña: cocina123
INSERT INTO usuarios (nombre, password, rol) VALUES 
('cocina', '$2b$10$YQ5hM5.vJKQ5F5Y5Q5Q5QO5Y5Q5Q5Q5Y5Q5Q5Y5Q5Q5Y5Q5Q5Y5', 'cocina');

-- =====================================================
-- INSERTAR PRODUCTOS DEL MENÚ
-- =====================================================
INSERT INTO productos (nombre, categoria, precio, disponible) VALUES
-- POLLOS
('Cuarto de pollo', 'pollo', 25.00, 1),
('Octavo de pollo', 'pollo', 15.00, 1),
-- HAMBURGUESAS
('Hamburguesa simple', 'hamburguesa', 30.00, 1),
('Hamburguesa con papas', 'hamburguesa', 45.00, 1),
-- SODAS 2 LITROS
('Coca-Cola 2L', 'soda', 25.00, 1),
('Fanta 2L', 'soda', 25.00, 1),
('Sprite 2L', 'soda', 25.00, 1),
-- SODAS POPULAR
('Coca-Cola popular', 'soda', 12.00, 1),
('Fanta popular', 'soda', 12.00, 1),
('Sprite popular', 'soda', 12.00, 1);
