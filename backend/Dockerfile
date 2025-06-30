# Dockerfile para Backend Django
FROM python:3.11-slim

# Establecer variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=job_portal.settings

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        default-libmysqlclient-dev \
        pkg-config \
        curl \
        bash \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements y instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Hacer el script de entrada ejecutable
RUN chmod +x entrypoint.sh

# Crear directorio para archivos estáticos y media
RUN mkdir -p /app/staticfiles /app/media

# Crear usuario no-root para seguridad
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8000

# Usar el script de entrada
ENTRYPOINT ["./entrypoint.sh"]

# Comando por defecto
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 