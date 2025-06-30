#!/bin/bash

# Script de configuración inicial para Job Portal con Docker
# Autor: Job Portal Team
# Versión: 1.0

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🐳 JOB PORTAL DOCKER SETUP               ║"
echo "║                                                              ║"
echo "║  Este script configurará automáticamente tu entorno Docker  ║"
echo "║  para el proyecto Job Portal completo.                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar prerequisitos
log "🔍 Verificando prerequisitos..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Por favor instala Docker primero."
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
fi

# Verificar que Docker esté corriendo
if ! docker info &> /dev/null; then
    error "Docker no está corriendo. Por favor inicia Docker primero."
fi

log "✅ Docker está instalado y corriendo"
log "   Docker version: $(docker --version)"
log "   Docker Compose version: $(docker-compose --version)"

# Preguntar modo de ejecución
echo ""
echo -e "${YELLOW}Selecciona el modo de ejecución:${NC}"
echo "1) 📝 Desarrollo (SQLite, hot-reload)"
echo "2) 🏭 Producción (PostgreSQL, optimizado)"
echo "3) 🧪 Solo backend (para desarrollo de API)"
echo ""
read -p "Ingresa tu opción (1-3): " mode

case $mode in
    1)
        COMPOSE_FILE="docker-compose.dev.yml"
        MODE_NAME="Desarrollo"
        ;;
    2)
        COMPOSE_FILE="docker-compose.yml"
        MODE_NAME="Producción"
        ;;
    3)
        COMPOSE_FILE="docker-compose.dev.yml"
        MODE_NAME="Solo Backend"
        SERVICES="backend"
        ;;
    *)
        error "Opción inválida. Debe ser 1, 2 o 3."
        ;;
esac

log "🎯 Modo seleccionado: ${MODE_NAME}"

# Limpiar contenedores existentes
log "🧹 Limpiando contenedores existentes..."
docker-compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null || true

# Limpiar imágenes old si existen
if [ "$(docker images -q jobposttest* 2> /dev/null)" != "" ]; then
    warning "Limpiando imágenes anteriores del proyecto..."
    docker images jobposttest* -q | xargs docker rmi -f 2>/dev/null || true
fi

# Crear directorios necesarios
log "📁 Creando directorios necesarios..."
mkdir -p backend/staticfiles backend/media

# Preguntar si cargar datos de muestra
if [ "$mode" != "3" ]; then
    echo ""
    read -p "¿Cargar datos de muestra? (y/n): " load_sample
    if [ "$load_sample" = "y" ] || [ "$load_sample" = "Y" ]; then
        export LOAD_SAMPLE_DATA=true
        log "📊 Se cargarán datos de muestra"
    fi
fi

# Construir imágenes
log "🏗️ Construyendo imágenes Docker..."
if [ "$mode" = "3" ]; then
    docker-compose -f $COMPOSE_FILE build $SERVICES
else
    docker-compose -f $COMPOSE_FILE build
fi

# Levantar servicios
log "🚀 Levantando servicios..."
if [ "$mode" = "3" ]; then
    docker-compose -f $COMPOSE_FILE up -d $SERVICES
else
    docker-compose -f $COMPOSE_FILE up -d
fi

# Esperar a que los servicios estén listos
log "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de servicios
log "🔍 Verificando estado de servicios..."
docker-compose -f $COMPOSE_FILE ps

# URLs de acceso
echo ""
echo -e "${GREEN}✅ ¡Configuración completada exitosamente!${NC}"
echo ""
echo -e "${BLUE}🔗 URLs de acceso:${NC}"

if [ "$mode" != "3" ]; then
    echo "   📱 Frontend: http://localhost:4200"
fi

echo "   🔧 Backend API: http://localhost:8000"
echo "   📚 API Documentation: http://localhost:8000/api/docs/"
echo "   🛠️ Django Admin: http://localhost:8000/admin/"

echo ""
echo -e "${BLUE}👤 Credenciales por defecto:${NC}"
echo "   Usuario: admin"
echo "   Contraseña: admin1234"

echo ""
echo -e "${BLUE}📋 Comandos útiles:${NC}"
echo "   Ver logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   Parar servicios: docker-compose -f $COMPOSE_FILE down"
echo "   Reiniciar: docker-compose -f $COMPOSE_FILE restart"

if [ "$mode" = "2" ]; then
    echo ""
    echo -e "${YELLOW}💡 Nota para producción:${NC}"
    echo "   - Cambia las credenciales por defecto"
    echo "   - Configura variables de entorno seguras"
    echo "   - Implementa backups regulares"
fi

echo ""
log "🎉 ¡Disfruta desarrollando con Job Portal!" 