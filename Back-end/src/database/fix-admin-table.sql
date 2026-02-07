-- Script para corregir la tabla admin y agregar valores por defecto a updated_at
-- Ejecutar este script si la tabla admin no tiene los valores por defecto correctos

USE sistema_barberia;

-- Verificar y modificar la tabla admin si es necesario
ALTER TABLE admin 
MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Si necesitas actualizar registros existentes sin updated_at
UPDATE admin 
SET updated_at = created_at 
WHERE updated_at IS NULL;

