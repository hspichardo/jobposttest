# 🐳 Job Portal - Guía Completa de Docker

Esta guía te permitirá ejecutar todo el proyecto Job Portal utilizando Docker y Docker Compose de manera sencilla y eficiente.

## 📋 Tabla de Contenidos

- [Prerequisitos](#prerequisitos)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Configuración Rápida](#configuración-rápida)
- [Modos de Ejecución](#modos-de-ejecución)
- [Comandos Útiles](#comandos-útiles)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisitos

### Software Requerido
- **Docker**: Versión 20.10+
- **Docker Compose**: Versión 2.0+
- **Git**: Para clonar el repositorio

### Verificar Instalación
```bash
docker --version
docker-compose --version
docker ps
```

## 🏗️ Arquitectura del Proyecto

```
JobPostTest/
├── backend/              # Django REST API
│   ├── Dockerfile        # Imagen del backend
│   ├── entrypoint.sh     # Script de inicialización
│   └── requirements.txt  # Dependencias Python
├── frontend/             # Angular Application
│   ├── Dockerfile        # Imagen del frontend
│   └── nginx.conf        # Configuración Nginx
├── docker-compose.yml    # Producción con PostgreSQL
└── docker-compose.dev.yml # Desarrollo con SQLite
```

### Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **frontend** | 80, 4200 | Angular + Nginx |
| **backend** | 8000 | Django REST API |
| **db** | 5432 | PostgreSQL (solo producción) |

## 🚀 Configuración Rápida

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd JobPostTest
```

### 2. Modo Desarrollo (Recomendado)
```bash
# Construir y levantar servicios
docker-compose -f docker-compose.dev.yml up --build

# En background
docker-compose -f docker-compose.dev.yml up --build -d
```

### 3. Acceder a la Aplicación
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/

### 4. Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `admin1234`
- **Email**: `admin@jobportal.com`

## 🎯 Modos de Ejecución

### 📝 Modo Desarrollo
**Características:**
- ✅ Hot-reload para Angular y Django
- ✅ SQLite (sin configuración)
- ✅ Debugging habilitado
- ✅ Volúmenes montados

```bash
# Levantar desarrollo
docker-compose -f docker-compose.dev.yml up --build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar servicios
docker-compose -f docker-compose.dev.yml down
```

### 🏭 Modo Producción
**Características:**
- ✅ PostgreSQL como base de datos
- ✅ Nginx optimizado
- ✅ Volúmenes persistentes
- ✅ Health checks

```bash
# Levantar producción
docker-compose up --build -d

# Ver estado
docker-compose ps

# Parar servicios
docker-compose down
```

## 🛠️ Comandos Útiles

### Gestión de Contenedores
```bash
# Ver todos los contenedores
docker ps -a

# Logs de servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Ejecutar comandos en contenedor
docker-compose exec backend bash
docker-compose exec backend python manage.py shell

# Reiniciar servicio
docker-compose restart backend
```

### Gestión de Base de Datos
```bash
# Ejecutar migraciones
docker-compose exec backend python manage.py migrate

# Crear superusuario
docker-compose exec backend python manage.py createsuperuser

# Cargar datos de muestra
docker-compose exec backend python create_sample_data.py

# Backup PostgreSQL
docker-compose exec db pg_dump -U jobportal_user jobportal > backup.sql
```

### Limpieza del Sistema
```bash
# Limpiar sistema completo
docker system prune -a

# Limpiar contenedores parados
docker container prune

# Limpiar imágenes sin usar
docker image prune -a

# Limpiar volúmenes
docker volume prune
```

## 🐞 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Ver qué usa el puerto
lsof -i :8000
netstat -tulpn | grep :8000

# Cambiar puerto en docker-compose.yml
ports:
  - "8001:8000"  # Puerto 8001 en lugar de 8000
```

#### 2. Base de datos no conecta
```bash
# Ver logs de DB
docker-compose logs db

# Verificar salud
docker-compose exec db pg_isready -U jobportal_user

# Reiniciar con orden
docker-compose down
docker-compose up -d db
sleep 10
docker-compose up backend
```

#### 3. Frontend no carga
```bash
# Ver logs del frontend
docker-compose logs frontend

# Reconstruir imagen
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Verificar Nginx
docker-compose exec frontend nginx -t
```

#### 4. Permisos de archivos (Linux)
```bash
sudo chown -R $USER:$USER ./backend
sudo chown -R $USER:$USER ./frontend
```

### Debugging
```bash
# Todos los logs
docker-compose logs

# Logs con timestamps
docker-compose logs -f -t backend

# Últimas 100 líneas
docker-compose logs --tail=100 frontend

# Ver uso de recursos
docker stats
```

## ⚙️ Variables de Entorno

Crear archivo `.env` en la raíz:

```bash
# Backend Configuration
DEBUG=False
SECRET_KEY=tu-clave-secreta-super-segura
ADMIN_PASSWORD=admin1234
LOAD_SAMPLE_DATA=true

# Database Configuration
DATABASE_URL=postgresql://jobportal_user:jobportal_password@db:5432/jobportal
POSTGRES_DB=jobportal
POSTGRES_USER=jobportal_user
POSTGRES_PASSWORD=jobportal_password
```

## 🏭 Producción

### Script de Despliegue
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando despliegue..."

git pull origin main

docker-compose down
docker-compose build --no-cache
docker-compose up -d

docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic --noinput

echo "✅ Despliegue completado!"
```

### Health Check
```bash
#!/bin/bash
# health_check.sh

if curl -f -s http://localhost:8000/api/ > /dev/null; then
    echo "✅ Backend OK"
else
    echo "❌ Backend DOWN"
fi

if curl -f -s http://localhost:4200 > /dev/null; then
    echo "✅ Frontend OK"  
else
    echo "❌ Frontend DOWN"
fi
```

## 📊 Comandos Avanzados

### Backup Completo
```bash
# Backup de volúmenes
docker run --rm -v jobposttest_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Backup de código
tar -czf backup_$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=.git .
```

### Monitoring
```bash
# Ver recursos en tiempo real
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Logs con filtros
docker-compose logs --since="1h" backend | grep ERROR
```

## 🎉 ¡Listo!

Tu Job Portal ahora está funcionando con Docker. 

### Accesos Rápidos:
- **App**: http://localhost:4200
- **API**: http://localhost:8000/api/
- **Docs**: http://localhost:8000/api/docs/
- **Admin**: http://localhost:8000/admin/

### Próximos Pasos:
1. Personalizar la aplicación
2. Configurar CI/CD
3. Implementar tests
4. Optimizar performance
5. Desplegar a producción

---
**Hecho con ❤️ y 🐳 Docker** 