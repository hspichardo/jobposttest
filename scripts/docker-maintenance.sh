#!/bin/bash

# Script de mantenimiento para Job Portal Docker
# Autor: Job Portal Team
# Versión: 1.0

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                 🔧 JOB PORTAL MAINTENANCE                     ║"
echo "║                                                               ║"
echo "║  Script de mantenimiento para gestionar tu entorno Docker    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Función para mostrar menú
show_menu() {
    echo ""
    echo -e "${YELLOW}Selecciona una opción:${NC}"
    echo "1)  📊 Ver estado de servicios"
    echo "2)  📋 Ver logs de servicios"
    echo "3)  🔄 Reiniciar servicios"
    echo "4)  🛑 Parar todos los servicios"
    echo "5)  🚀 Levantar servicios"
    echo "6)  🏗️  Reconstruir imágenes"
    echo "7)  💾 Backup de base de datos"
    echo "8)  📈 Backup de volúmenes"
    echo "9)  🧹 Limpieza de sistema"
    echo "10) 📱 Abrir URLs principales"
    echo "11) 🔍 Diagnóstico completo"
    echo "12) ❓ Ayuda"
    echo "0)  🚪 Salir"
    echo ""
}

# Función para detectar docker-compose file
detect_compose_file() {
    if [ -f "docker-compose.dev.yml" ] && docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo "docker-compose.dev.yml"
    elif [ -f "docker-compose.yml" ] && docker-compose -f docker-compose.yml ps | grep -q "Up"; then
        echo "docker-compose.yml"
    elif [ -f "docker-compose.dev.yml" ]; then
        echo "docker-compose.dev.yml"
    elif [ -f "docker-compose.yml" ]; then
        echo "docker-compose.yml"
    else
        error "No se encontró archivo docker-compose.yml válido"
    fi
}

# Función para mostrar estado
show_status() {
    local compose_file=$(detect_compose_file)
    log "📊 Estado de servicios (usando $compose_file):"
    docker-compose -f $compose_file ps
    echo ""
    log "💻 Uso de recursos:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# Función para mostrar logs
show_logs() {
    local compose_file=$(detect_compose_file)
    echo ""
    echo "Servicios disponibles:"
    docker-compose -f $compose_file config --services
    echo ""
    read -p "¿De qué servicio quieres ver los logs? (o 'all' para todos): " service
    
    if [ "$service" = "all" ]; then
        docker-compose -f $compose_file logs --tail=50 -f
    else
        docker-compose -f $compose_file logs --tail=50 -f $service
    fi
}

# Función para reiniciar servicios
restart_services() {
    local compose_file=$(detect_compose_file)
    echo ""
    echo "Servicios disponibles:"
    docker-compose -f $compose_file config --services
    echo ""
    read -p "¿Qué servicio reiniciar? (o 'all' para todos): " service
    
    if [ "$service" = "all" ]; then
        log "🔄 Reiniciando todos los servicios..."
        docker-compose -f $compose_file restart
    else
        log "🔄 Reiniciando $service..."
        docker-compose -f $compose_file restart $service
    fi
    log "✅ Reinicio completado"
}

# Función para parar servicios
stop_services() {
    local compose_file=$(detect_compose_file)
    warning "⚠️ Esto parará todos los servicios de Job Portal"
    read -p "¿Estás seguro? (y/n): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        log "🛑 Parando servicios..."
        docker-compose -f $compose_file down
        log "✅ Servicios detenidos"
    else
        log "❌ Operación cancelada"
    fi
}

# Función para levantar servicios
start_services() {
    echo ""
    echo "Archivos compose disponibles:"
    ls -la docker-compose*.yml 2>/dev/null || echo "No se encontraron archivos compose"
    echo ""
    echo "1) docker-compose.dev.yml (Desarrollo)"
    echo "2) docker-compose.yml (Producción)"
    read -p "¿Qué archivo usar? (1-2): " choice
    
    case $choice in
        1)
            compose_file="docker-compose.dev.yml"
            ;;
        2)
            compose_file="docker-compose.yml"
            ;;
        *)
            error "Opción inválida"
            ;;
    esac
    
    log "🚀 Levantando servicios con $compose_file..."
    docker-compose -f $compose_file up -d
    sleep 5
    docker-compose -f $compose_file ps
}

# Función para reconstruir imágenes
rebuild_images() {
    local compose_file=$(detect_compose_file)
    warning "⚠️ Esto reconstruirá todas las imágenes (puede tomar tiempo)"
    read -p "¿Continuar? (y/n): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        log "🏗️ Reconstruyendo imágenes..."
        docker-compose -f $compose_file build --no-cache
        log "🔄 Reiniciando servicios..."
        docker-compose -f $compose_file up -d
        log "✅ Reconstrucción completada"
    else
        log "❌ Operación cancelada"
    fi
}

# Función para backup de base de datos
backup_database() {
    local compose_file=$(detect_compose_file)
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    if docker-compose -f $compose_file ps | grep -q "db.*Up"; then
        log "💾 Creando backup de PostgreSQL..."
        mkdir -p backups
        docker-compose -f $compose_file exec -T db pg_dump -U jobportal_user jobportal > "backups/db_backup_${timestamp}.sql"
        log "✅ Backup guardado en: backups/db_backup_${timestamp}.sql"
    else
        warning "⚠️ No hay servicio de base de datos PostgreSQL corriendo"
        log "💾 Creando backup de SQLite..."
        mkdir -p backups
        if [ -f "backend/db.sqlite3" ]; then
            cp backend/db.sqlite3 "backups/db_sqlite_${timestamp}.sqlite3"
            log "✅ Backup SQLite guardado en: backups/db_sqlite_${timestamp}.sqlite3"
        else
            warning "No se encontró base de datos SQLite"
        fi
    fi
}

# Función para backup de volúmenes
backup_volumes() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    log "📈 Creando backup de volúmenes..."
    mkdir -p backups
    
    # Backup de datos PostgreSQL si existe
    if docker volume ls | grep -q "postgres_data"; then
        docker run --rm -v jobposttest_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres_volume_${timestamp}.tar.gz -C /data .
        log "✅ Backup de volumen PostgreSQL creado"
    fi
    
    # Backup de archivos estáticos
    if docker volume ls | grep -q "backend_static"; then
        docker run --rm -v jobposttest_backend_static:/data -v $(pwd)/backups:/backup alpine tar czf /backup/static_${timestamp}.tar.gz -C /data .
        log "✅ Backup de archivos estáticos creado"
    fi
    
    # Backup de archivos media
    if docker volume ls | grep -q "backend_media"; then
        docker run --rm -v jobposttest_backend_media:/data -v $(pwd)/backups:/backup alpine tar czf /backup/media_${timestamp}.tar.gz -C /data .
        log "✅ Backup de archivos media creado"
    fi
    
    log "✅ Backups guardados en directorio: backups/"
}

# Función para limpieza
cleanup_system() {
    warning "⚠️ Esto limpiará contenedores, imágenes y volúmenes no utilizados"
    read -p "¿Continuar? (y/n): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        log "🧹 Limpiando contenedores detenidos..."
        docker container prune -f
        
        log "🧹 Limpiando imágenes sin usar..."
        docker image prune -f
        
        log "🧹 Limpiando redes sin usar..."
        docker network prune -f
        
        read -p "¿También limpiar volúmenes? (y/n): " clean_volumes
        if [ "$clean_volumes" = "y" ] || [ "$clean_volumes" = "Y" ]; then
            warning "⚠️ CUIDADO: Esto eliminará datos persistentes"
            read -p "¿Estás REALMENTE seguro? (y/n): " really_sure
            if [ "$really_sure" = "y" ] || [ "$really_sure" = "Y" ]; then
                docker volume prune -f
                log "✅ Volúmenes limpiados"
            fi
        fi
        
        log "✅ Limpieza completada"
        docker system df
    else
        log "❌ Operación cancelada"
    fi
}

# Función para abrir URLs
open_urls() {
    log "📱 URLs principales de Job Portal:"
    echo ""
    echo "🌐 Frontend: http://localhost:4200"
    echo "🔧 Backend API: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/api/docs/"
    echo "🛠️ Django Admin: http://localhost:8000/admin/"
    echo ""
    
    # Intentar abrir en el navegador (si está disponible)
    if command -v xdg-open &> /dev/null; then
        read -p "¿Abrir frontend en navegador? (y/n): " open_browser
        if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
            xdg-open http://localhost:4200
        fi
    elif command -v open &> /dev/null; then
        read -p "¿Abrir frontend en navegador? (y/n): " open_browser
        if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
            open http://localhost:4200
        fi
    fi
}

# Función de diagnóstico
diagnostic() {
    log "🔍 Ejecutando diagnóstico completo..."
    echo ""
    
    echo -e "${BLUE}📋 Información del sistema:${NC}"
    echo "Docker version: $(docker --version)"
    echo "Docker Compose version: $(docker-compose --version)"
    echo "Sistema operativo: $(uname -a)"
    echo ""
    
    echo -e "${BLUE}📊 Estado de Docker:${NC}"
    docker info --format '{{.ServerVersion}}' && echo "✅ Docker corriendo" || echo "❌ Docker no disponible"
    echo ""
    
    echo -e "${BLUE}🐳 Contenedores Job Portal:${NC}"
    docker ps --filter "name=jobportal" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    echo -e "${BLUE}💾 Volúmenes:${NC}"
    docker volume ls | grep jobposttest || echo "No hay volúmenes del proyecto"
    echo ""
    
    echo -e "${BLUE}🌐 Conectividad:${NC}"
    curl -s -o /dev/null -w "Backend API: %{http_code}\n" http://localhost:8000/api/ || echo "Backend API: No disponible"
    curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:4200 || echo "Frontend: No disponible"
    echo ""
    
    echo -e "${BLUE}💻 Uso de recursos:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "No hay contenedores corriendo"
    echo ""
    
    log "✅ Diagnóstico completado"
}

# Función de ayuda
show_help() {
    echo -e "${BLUE}"
    echo "📖 GUÍA DE USO DEL SCRIPT DE MANTENIMIENTO"
    echo ""
    echo "Este script te ayuda a gestionar tu entorno Docker de Job Portal."
    echo ""
    echo "COMANDOS PRINCIPALES:"
    echo "• Estado de servicios: Muestra qué contenedores están corriendo"
    echo "• Ver logs: Accede a los logs de servicios específicos"
    echo "• Reiniciar servicios: Reinicia servicios sin perder datos"
    echo "• Reconstruir imágenes: Útil cuando cambias Dockerfile"
    echo "• Backup: Crea copias de seguridad de datos importantes"
    echo "• Limpieza: Libera espacio eliminando recursos no utilizados"
    echo ""
    echo "UBICACIÓN DE ARCHIVOS:"
    echo "• Logs: Usar 'docker-compose logs'"
    echo "• Backups: ./backups/"
    echo "• Configuración: docker-compose*.yml"
    echo ""
    echo "SOLUCIÓN DE PROBLEMAS:"
    echo "• Si un servicio no arranca: Ver logs y reiniciar"
    echo "• Si hay errores de imagen: Reconstruir imágenes"
    echo "• Si falta espacio: Ejecutar limpieza"
    echo ""
    echo -e "${NC}"
}

# Loop principal
while true; do
    show_menu
    read -p "Selecciona una opción (0-12): " choice
    
    case $choice in
        1) show_status ;;
        2) show_logs ;;
        3) restart_services ;;
        4) stop_services ;;
        5) start_services ;;
        6) rebuild_images ;;
        7) backup_database ;;
        8) backup_volumes ;;
        9) cleanup_system ;;
        10) open_urls ;;
        11) diagnostic ;;
        12) show_help ;;
        0) 
            log "👋 ¡Hasta luego!"
            exit 0
            ;;
        *) 
            error "Opción inválida. Selecciona un número del 0 al 12."
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done 