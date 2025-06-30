# Guía de Configuración - Portal de Empleo

## Requisitos Previos

- Python 3.8+ instalado
- Node.js 16+ y npm instalados
- Git instalado

## Configuración del Backend (Django + DRF)

### 1. Navegar al directorio del backend
```bash
cd backend
```

### 2. Crear entorno virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

### 5. Ejecutar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear superusuario
```bash
python manage.py createsuperuser
```

### 7. Crear usuarios de prueba (opcional)
```bash
python manage.py shell
```

```python
from users.models import User

# Crear admin de prueba
admin_user = User.objects.create_user(
    username='admin',
    email='admin@example.com',
    password='admin123',
    role='admin',
    first_name='Admin',
    last_name='Usuario'
)

# Crear aplicante de prueba
applicant_user = User.objects.create_user(
    username='usuario',
    email='usuario@example.com',
    password='usuario123',
    role='applicant',
    first_name='Usuario',
    last_name='Aplicante'
)
```

### 8. Ejecutar servidor de desarrollo
```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

## Configuración del Frontend (Angular 14+)

### 1. Navegar al directorio del frontend
```bash
cd frontend
```

### 2. Instalar Angular CLI (si no está instalado)
```bash
npm install -g @angular/cli@14
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecutar servidor de desarrollo
```bash
ng serve
```

El frontend estará disponible en `http://localhost:4200`

## Uso de la Aplicación

### Para Administradores:
1. Iniciar sesión con credenciales de admin
2. Acceder al dashboard de administración
3. Crear, editar y eliminar ofertas de trabajo
4. Revisar y gestionar aplicaciones
5. Cambiar estado de aplicaciones

### Para Aplicantes:
1. Registrarse o iniciar sesión
2. Navegar por las ofertas de trabajo
3. Aplicar a trabajos de interés
4. Ver estado de sus aplicaciones

### Funcionalidades Públicas:
- Ver lista de trabajos disponibles
- Filtrar por categoría, ubicación y texto
- Ver detalles de cada trabajo

## Estructura de la Base de Datos

### Modelos Principales:
- **User**: Usuario extendido con roles (admin/applicant)
- **JobPost**: Ofertas de trabajo con todos los detalles
- **Application**: Aplicaciones a trabajos con estado y documentos

## API Endpoints

### Autenticación:
- `POST /api/auth/register/` - Registro
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Renovar token

### Trabajos:
- `GET /api/jobs/` - Listar trabajos (público)
- `GET /api/jobs/{id}/` - Detalle del trabajo
- `POST /api/admin/jobs/create/` - Crear trabajo (admin)
- `PUT /api/admin/jobs/{id}/update/` - Actualizar trabajo (admin)
- `DELETE /api/admin/jobs/{id}/delete/` - Eliminar trabajo (admin)

### Aplicaciones:
- `POST /api/jobs/{id}/apply/` - Aplicar a trabajo
- `GET /api/my-applications/` - Mis aplicaciones
- `GET /api/applications/` - Todas las aplicaciones (admin)
- `PATCH /api/applications/{id}/update/` - Actualizar estado (admin)

## Características Implementadas

### Backend:
✅ Autenticación JWT con refresh tokens
✅ Sistema de roles (admin/applicant)
✅ Modelos completos con validaciones
✅ API REST con permisos por rol
✅ Paginación y filtrado
✅ CORS configurado para frontend
✅ Admin de Django personalizado

### Frontend:
✅ Angular 14+ con PrimeNG
✅ Guards de rutas por rol
✅ Formularios reactivos con validación
✅ Interceptor HTTP para tokens JWT
✅ Componentes reutilizables
✅ Diseño responsivo
✅ Manejo de estados de carga
✅ Notificaciones toast

## Uso de IA en el Desarrollo

Durante el desarrollo se utilizaron herramientas de IA para:

1. **Generación de código base**: Modelos, serializers, vistas y componentes
2. **Configuración de autenticación**: JWT y manejo de tokens
3. **Estructura de componentes Angular**: Servicios y guards
4. **Integración PrimeNG**: Configuración y uso de componentes
5. **Resolución de problemas**: Debugging y optimización

## Comandos Útiles

### Backend:
```bash
# Crear nueva app
python manage.py startapp nombre_app

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test
```

### Frontend:
```bash
# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio

# Build para producción
ng build --prod

# Ejecutar tests
ng test
```

## Próximos Pasos

1. Implementar tests unitarios y de integración
2. Configurar CI/CD
3. Optimizar performance
4. Agregar más filtros y búsqueda avanzada
5. Implementar notificaciones en tiempo real
6. Agregar carga de archivos para CVs
7. Implementar sistema de calificaciones
8. Agregar analytics y reportes 