-- Script de inicialización para PostgreSQL
-- Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar timezone
SET TIME ZONE 'UTC';

-- Crear índices adicionales (se ejecutarán después de las migraciones de Django)
-- Estos comandos pueden fallar si las tablas no existen aún, pero eso está bien
-- Django creará las tablas con sus propios índices

-- Mensaje de confirmación
SELECT 'Base de datos inicializada correctamente para Job Portal' AS message; 