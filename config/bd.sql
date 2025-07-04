-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inmohouse;
USE inmohouse;

-- Tabla de roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Tabla de propiedades
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  agent_id INT,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de clientes
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  agent_id INT,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla intermedia (opcional si un usuario puede tener varios roles)
-- CREATE TABLE user_roles (
--   user_id INT,
--   role_id INT,
--   PRIMARY KEY (user_id, role_id),
--   FOREIGN KEY (user_id) REFERENCES users(id),
--   FOREIGN KEY (role_id) REFERENCES roles(id)
-- );

-- Insertar roles iniciales
INSERT INTO roles (name) VALUES ('admin'), ('agent'), ('client');
