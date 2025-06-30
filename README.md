# Portal de Empleo - Job Portal

Una aplicación web completa para la gestión de ofertas de trabajo con Django + DRF como backend y Angular 14+ como frontend.

## Características Principales

### Backend (Django + DRF)
- Autenticación basada en tokens JWT
- Sistema de roles (admin y aplicante)
- CRUD completo para ofertas de trabajo
- Sistema de aplicaciones
- Paginación y filtrado
- Permisos basados en roles

### Frontend (Angular 14+)
- Interfaz moderna con PrimeNG
- Autenticación con guards de rutas
- Lista y detalle de trabajos
- Dashboard de administración
- Formularios reactivos
- Diseño responsivo

## Tecnologías Utilizadas

### Backend
- Django 4.2+
- Django REST Framework
- Django REST Framework JWT
- Django CORS Headers
- SQLite (desarrollo)

### Frontend
- Angular 14+
- PrimeNG
- Angular JWT
- RxJS
- TypeScript

## Instalación y Configuración

### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Crear superusuario:
```bash
python manage.py createsuperuser
```

6. Ejecutar el servidor:
```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

### Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor de desarrollo:
```bash
ng serve
```

El frontend estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
JobPostTest/
├── backend/
│   ├── job_portal/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── jobs/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── users/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── models/
│   │   └── environments/
│   └── angular.json
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrar usuario
- `POST /api/auth/refresh/` - Refrescar token

### Trabajos
- `GET /api/jobs/` - Listar trabajos
- `GET /api/jobs/{id}/` - Detalle del trabajo
- `POST /api/jobs/` - Crear trabajo (admin)
- `PUT /api/jobs/{id}/` - Actualizar trabajo (admin)
- `DELETE /api/jobs/{id}/` - Eliminar trabajo (admin)

### Aplicaciones
- `POST /api/applications/` - Enviar aplicación
- `GET /api/applications/` - Listar aplicaciones (admin)
- `GET /api/applications/{id}/` - Detalle de aplicación

## Uso de Herramientas de IA

Durante el desarrollo de este proyecto, se utilizaron herramientas de IA para:

1. **Generación de código boilerplate**: Modelos, serializers y vistas básicas
2. **Configuración de autenticación JWT**: Implementación de tokens y permisos
3. **Componentes de Angular**: Estructura inicial de componentes y servicios
4. **Configuración de PrimeNG**: Integración y uso de componentes
5. **Resolución de problemas**: Debugging y optimización de código

## Credenciales de Prueba

### Admin
- Username: admin
- Password: admin123

### Usuario Regular
- Username: user
- Password: user123

## Características Implementadas

### Backend
- ✅ Autenticación JWT
- ✅ Modelos de datos
- ✅ API REST completa
- ✅ Permisos por roles
- ✅ Paginación y filtrado
- ✅ CORS configurado

### Frontend
- ✅ Autenticación con guards
- ✅ Interfaz con PrimeNG
- ✅ Lista de trabajos
- ✅ Dashboard de admin
- ✅ Formularios reactivos
- ✅ Diseño responsivo

## Licencia

Este proyecto está bajo la Licencia MIT. 