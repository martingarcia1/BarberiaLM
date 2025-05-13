-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_barberia;
USE sistema_barberia;

-- Tabla admin
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_admin VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla empleado (barberos)
CREATE TABLE empleado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    especialidad VARCHAR(100),
    salario DECIMAL(10,2) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla cliente
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    genero ENUM('Masculino', 'Femenino', 'Otro'),
    email VARCHAR(100) NOT NULL UNIQUE,
    dni VARCHAR(15) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contraseña VARCHAR(255) NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla servicio
CREATE TABLE servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion INT NOT NULL, -- duración en minutos
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_nombre_servicio (nombre_servicio)
);

-- Tabla puntos_cliente
CREATE TABLE puntos_cliente (
    cliente_id INT PRIMARY KEY,
    puntos INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_puntos_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla canje_puntos
CREATE TABLE canje_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servicio_id INT NOT NULL,
    puntos_requeridos INT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_canje_servicio FOREIGN KEY (servicio_id)
        REFERENCES servicio(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla cita (turnos)
CREATE TABLE cita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    empleado_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    pagado_con_puntos BOOLEAN DEFAULT FALSE,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada') DEFAULT 'Pendiente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_cliente FOREIGN KEY (cliente_id) 
        REFERENCES cliente(id_cliente) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cita_empleado FOREIGN KEY (empleado_id) 
        REFERENCES empleado(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cita_servicio FOREIGN KEY (servicio_id) 
        REFERENCES servicio(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla metodo_pago
CREATE TABLE metodo_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_metodo_pago VARCHAR(50) NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_nombre_metodo (nombre_metodo_pago)
);

-- Tabla pago
CREATE TABLE pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    metodo_pago_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'Completado', 'Cancelado') DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pago_cita FOREIGN KEY (cita_id) 
        REFERENCES cita(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pago_metodo FOREIGN KEY (metodo_pago_id) 
        REFERENCES metodo_pago(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla producto
CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    imagen_url VARCHAR(255),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla venta_producto
CREATE TABLE venta_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    total DECIMAL(10,2) NOT NULL,
    fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_venta_cliente FOREIGN KEY (cliente_id) 
        REFERENCES cliente(id_cliente) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_venta_producto FOREIGN KEY (producto_id) 
        REFERENCES producto(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla historial_puntos
CREATE TABLE historial_puntos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    tipo ENUM('ganado', 'usado') NOT NULL,
    puntos INT NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX idx_cita_cliente ON cita(cliente_id);
CREATE INDEX idx_cita_empleado ON cita(empleado_id);
CREATE INDEX idx_cita_servicio ON cita(servicio_id);
CREATE INDEX idx_cita_fecha ON cita(fecha_hora);
CREATE INDEX idx_pago_cita ON pago(cita_id);
CREATE INDEX idx_venta_cliente ON venta_producto(cliente_id);
CREATE INDEX idx_venta_producto ON venta_producto(producto_id);

-- Vistas útiles
CREATE VIEW vista_citas_programadas AS
SELECT 
    c.id AS cita_id,
    CONCAT(cli.nombre, ' ', cli.apellido) AS cliente,
    CONCAT(e.nombre, ' ', e.apellido) AS barbero,
    s.nombre_servicio,
    c.fecha_hora,
    c.estado,
    c.pagado_con_puntos
FROM cita c
JOIN cliente cli ON c.cliente_id = cli.id_cliente
JOIN empleado e ON c.empleado_id = e.id
JOIN servicio s ON c.servicio_id = s.id;

CREATE VIEW vista_puntos_cliente AS
SELECT 
    c.id_cliente,
    CONCAT(c.nombre, ' ', c.apellido) AS cliente,
    p.puntos,
    c.email,
    c.telefono
FROM cliente c
LEFT JOIN puntos_cliente p ON c.id_cliente = p.cliente_id;

CREATE VIEW vista_productos_bajo_stock AS
SELECT 
    id AS producto_id,
    nombre_producto,
    stock,
    precio
FROM producto
WHERE stock <= 5 AND estado = 'activo';

-- Procedimientos almacenados para puntos
DELIMITER //
CREATE PROCEDURE sumar_puntos(
    IN p_cliente_id INT,
    IN p_puntos INT,
    IN p_descripcion TEXT
)
BEGIN
    DECLARE existe INT;
    
    SELECT COUNT(*) INTO existe FROM puntos_cliente WHERE cliente_id = p_cliente_id;
    
    IF existe = 0 THEN
        INSERT INTO puntos_cliente (cliente_id, puntos) VALUES (p_cliente_id, p_puntos);
    ELSE
        UPDATE puntos_cliente SET puntos = puntos + p_puntos WHERE cliente_id = p_cliente_id;
    END IF;
    
    INSERT INTO historial_puntos (cliente_id, tipo, puntos, descripcion) 
    VALUES (p_cliente_id, 'ganado', p_puntos, p_descripcion);
END //
DELIMITER ;
-
DELIMITER //
CREATE PROCEDURE canjear_puntos(
    IN p_cliente_id INT,
    IN p_servicio_id INT,
    IN p_cita_id INT
)
BEGIN
    DECLARE puntos_actuales INT;
    DECLARE puntos_necesarios INT;
    
    SELECT puntos INTO puntos_actuales FROM puntos_cliente WHERE cliente_id = p_cliente_id;
    SELECT puntos_requeridos INTO puntos_necesarios FROM canje_puntos WHERE servicio_id = p_servicio_id;

    IF puntos_actuales >= puntos_necesarios THEN
        UPDATE puntos_cliente SET puntos = puntos_actuales - puntos_necesarios 
        WHERE cliente_id = p_cliente_id;
        
        UPDATE cita SET pagado_con_puntos = TRUE WHERE id = p_cita_id;
        
        INSERT INTO historial_puntos (cliente_id, tipo, puntos, descripcion) 
        VALUES (p_cliente_id, 'usado', puntos_necesarios, 'Canje de puntos por servicio');
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Puntos insuficientes para canje';
    END IF;
END //
DELIMITER ;