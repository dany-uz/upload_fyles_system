# 📁 File Upload System

Una aplicación web moderna para la subida de archivos PDF con validaciones robustas, progreso en tiempo real y manejo de errores avanzado.

## 🚀 Características Principales

- ✅ **Subida múltiple de archivos PDF** (hasta 10 archivos, 5MB cada uno)
- ✅ **Drag & Drop interactivo** con retroalimentación visual
- ✅ **Validación en tiempo real** con mensajes de error descriptivos
- ✅ **Progreso de subida en tiempo real** con cancelación y reintento
- ✅ **Interfaz responsive** optimizada para móvil y desktop
- ✅ **Accesibilidad completa** (ARIA, navegación por teclado)
- ✅ **Notificaciones toast** para feedback del usuario
- ✅ **Clean Architecture** con componentes modulares

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend:** [React 19](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Formularios:** [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup)
- **Notificaciones:** [Sonner](https://sonner.emilkowal.ski/)
- **Linting:** [ESLint](https://eslint.org/)

## 📦 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18.17 o superior
- **npm** o **yarn**

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/dany-uz/upload_fyles_system.git
cd upload_files_system

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev        # Ejecuta el servidor de desarrollo

# Producción
npm run build      # Construye la aplicación para producción
npm run start      # Ejecuta la aplicación en modo producción

# Calidad de código
npm run lint       # Ejecuta ESLint para revisar el código
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes (Mock endpoints)
│   │   ├── upload/        # Endpoint para subida de archivos
│   │   └── submit/        # Endpoint para envío del formulario
│   ├── upload/            # Página principal de subida
│   └── layout.tsx         # Layout raíz con providers
├── components/            # Componentes reutilizables
│   ├── FileUpload.tsx     # Zona de drag & drop
│   ├── FileList.tsx       # Lista/tabla de archivos
│   └── HelpSection.tsx    # Panel de ayuda lateral
├── hooks/                 # Custom hooks
│   ├── useFileUpload.ts   # Lógica de subida de archivos
│   └── useFormSubmit.ts   # Lógica de envío del formulario
├── types/                 # Definiciones de TypeScript
│   ├── file.ts           # Tipos para FileDescriptor
│   └── api.ts            # Tipos para API requests/responses
└── utils/                 # Funciones utilitarias
    └── fileFormatters.ts  # Formateo de tamaños de archivo
```

## 🎯 Funcionalidades Detalladas

### 📄 Subida de Archivos

- **Formatos soportados:** Solo archivos PDF
- **Límites:** Máximo 10 archivos, 5MB por archivo
- **Métodos de selección:**
  - Drag & drop en la zona designada
  - Click para abrir selector de archivos
  - Navegación por teclado (Enter/Espacio)

### 📊 Estados de Archivos

| Estado      | Descripción           | Acciones Disponibles |
|-------------|-----------------------|----------------------|
| `idle`      | En espera de subida   | Eliminar             |
| `uploading` | Subiendo con progreso | Cancelar             |
| `done`      | Subida completada     | Eliminar             |
| `error`     | Error en la subida    | Reintentar, Eliminar |
| `canceled`  | Subida cancelada      | Reintentar, Eliminar |

### 🎨 Diseño Responsive

- **Mobile First:** Optimizado para dispositivos móviles
- **Vista móvil:** Cards con información compacta
- **Vista desktop:** Tabla detallada con columnas organizadas
- **Breakpoints:** Tailwind CSS (sm: 640px+)

### ♿ Accesibilidad

- **ARIA Labels:** Descripción completa para lectores de pantalla
- **Navegación por teclado:** Soporte completo
- **Contraste:** Cumple estándares WCAG
- **Focus management:** Indicadores visuales claros

## 🔌 API Endpoints

### POST `/api/upload`

Sube un archivo individual.

**Request:**
```typescript
FormData {
  file: File
}
```

**Response:**
```typescript
{
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}
```

### POST `/api/submit`

Envía el formulario completo con metadatos.

**Request:**
```typescript
{
  title: string;
  description: string;
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
}
```

**Response:**
```typescript
{
  ok: boolean;
  submissionId: string;
  message: string;
  data: {
    title: string;
    description: string;
    files: Array<FileMetadata>;
  };
  timestamp: string;
}
```

## 🎛️ Configuración

### Variables de Entorno

Actualmente no se requieren variables de entorno. Todos los endpoints son mock locales.

### Límites Configurables

Los siguientes valores pueden modificarse en `src/app/upload/page.tsx`:

```typescript
const MAX_FILES = 10;                    // Número máximo de archivos
const MAX_FILE_SIZE = 5 * 1024 * 1024;   // 5MB por archivo
const ALLOWED_TYPES = ['application/pdf']; // Tipos MIME permitidos
```

## 🧪 Testing

### Casos de Prueba Recomendados

1. **Subida exitosa:** Subir archivos PDF válidos
2. **Validaciones:** Intentar subir archivos no válidos
3. **Límites:** Superar límites de cantidad/tamaño
4. **Cancelación:** Cancelar subidas en progreso
5. **Reintento:** Reintentar archivos con error o cancelados
6. **Responsive:** Probar en diferentes tamaños de pantalla
7. **Accesibilidad:** Navegación solo con teclado

### Simulación de Errores

La API mock incluye:
- **20% probabilidad** de error simulado en `/api/submit`
- **Timeouts aleatorios** para simular latencia de red
- **Validación de tipos** de archivo y tamaños

## 🚀 Deployment

### Build para Producción

```bash
npm run build
npm run start
```

## 🛡️ Seguridad

### Validaciones Implementadas

- ✅ **Client-side:** Validación de tipos MIME y tamaños
- ✅ **Type Safety:** TypeScript estricto en toda la aplicación
- ✅ **Sanitización:** Nombres de archivo y datos de entrada
- ✅ **Error Handling:** Manejo robusto de errores de red

## 🤝 Contribución

### Guidelines

1. **Fork** el repositorio
2. **Crear rama** para nueva feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear Pull Request**

### Estándares de Código

- **ESLint:** Seguir reglas configuradas
- **TypeScript:** Tipado estricto obligatorio
- **Tailwind:** Clases utilitarias preferidas
- **Commits:** Conventional Commits format

## 📄 Licencia

Este proyecto es parte de una prueba técnica y es para fines educativos/demostrativos.

## 📞 Soporte

Para preguntas o issues, crear un issue en el repositorio o contactar al desarrollador.

---

**⚡ Desarrollado con Next.js, TypeScript y mucho ☕**