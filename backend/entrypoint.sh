#!/bin/bash

# Script de entrada para el contenedor Django
set -e

echo "🚀 Iniciando Job Portal Backend..."

# Esperar a que la base de datos esté lista
if [ "$DATABASE_URL" ]; then
    echo "📡 Esperando a que la base de datos esté lista..."
    
    # Función para esperar PostgreSQL
    until python -c "
import psycopg2
import os
import time
from urllib.parse import urlparse

def wait_for_db():
    db_url = os.environ.get('DATABASE_URL', '')
    if not db_url:
        return
    
    parsed = urlparse(db_url)
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            conn = psycopg2.connect(
                host=parsed.hostname,
                port=parsed.port or 5432,
                user=parsed.username,
                password=parsed.password,
                database=parsed.path[1:]  # Remove leading slash
            )
            conn.close()
            print('✅ Base de datos conectada exitosamente!')
            return
        except psycopg2.OperationalError:
            retry_count += 1
            print(f'⏳ Reintento {retry_count}/{max_retries}...')
            time.sleep(2)
    
    raise Exception('❌ No se pudo conectar a la base de datos')

wait_for_db()
"; do
        echo "⏳ Base de datos no está lista, esperando..."
        sleep 2
    done
else
    echo "📝 Usando SQLite (desarrollo local)"
fi

# Ejecutar migraciones
echo "📋 Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate

# Recopilar archivos estáticos
echo "🎨 Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

# Crear superusuario si no existe
echo "👤 Verificando superusuario..."
python manage.py shell << EOF
from users.models import User
import os

# Crear superusuario admin si no existe
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@jobportal.com',
        password=os.environ.get('ADMIN_PASSWORD', 'admin1234'),
        first_name='Admin',
        last_name='User'
    )
    print('✅ Superusuario admin creado')
else:
    print('ℹ️ Superusuario admin ya existe')
EOF

# Cargar datos de muestra si es necesario
if [ "$LOAD_SAMPLE_DATA" = "true" ]; then
    echo "📊 Cargando datos de muestra..."
    python create_sample_data.py
fi

echo "✅ Inicialización completada!"

# Ejecutar el comando proporcionado
exec "$@" 