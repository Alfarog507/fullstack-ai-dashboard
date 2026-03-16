# Prueba Técnica — Full Stack Developer (AI-Enabled)

Aplicación full stack que consume datos de una API externa, los procesa mediante un backend propio, integra un modelo de lenguaje (LLM) para análisis de texto y presenta la información en un cliente web moderno.

## Tech Stack

**Backend**
- Node.js + Express (puerto 3001)
- Google Gemini `gemini-2.5-flash` vía `@google/generative-ai`
- Validación de inputs con Zod
- Tests con Jest + Supertest

**Frontend**
- React 18 + Vite (puerto 5173)
- TailwindCSS
- Componentes funcionales con Hooks

**Infraestructura**
- Docker + Docker Compose

## Estructura del Proyecto

```
prueba-fullstack-ai/
├── backend/
│   ├── src/
│   │   ├── clients/          # Clientes HTTP externos (JSONPlaceholder, Gemini)
│   │   ├── controllers/      # Manejo de requests/responses HTTP
│   │   ├── routes/           # Definición de rutas Express
│   │   ├── schemas/          # Esquemas de validación Zod
│   │   ├── services/         # Lógica de negocio
│   │   └── __tests__/        # Tests unitarios e integración
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React reutilizables
│   │   └── App.jsx           # Componente raíz y estado global
│   ├── nginx.conf            # Proxy reverso para producción
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose instalados
- API Key de Google Gemini ([obtener aquí](https://aistudio.google.com/app/apikey))

## Instalación y Ejecución

### Con Docker (recomendado)

```bash
git clone <url-del-repositorio>
cd prueba-fullstack-ai
cp .env.example .env      # completar LLM_API_KEY
docker compose up --build
```

La app queda disponible en `http://localhost:5173`.

### Sin Docker (desarrollo local)

**Backend:**
```bash
cd backend
cp .env.example .env      # completar LLM_API_KEY
npm install
npm start
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```

El frontend en desarrollo usa el proxy de Vite para redirigir `/posts` y `/ai` al backend en `localhost:3001`.

## Variables de Entorno

Copiar `.env.example` a `.env` en la raíz del proyecto:

```env
LLM_API_KEY=your_gemini_api_key_here   # requerido
PORT=3001                               # opcional, default 3001
VITE_API_URL=                           # vacío en dev (usa proxy), completar en producción
```

## API Endpoints

### `GET /posts`

Consume `https://jsonplaceholder.typicode.com/comments`, agrupa los comentarios por `name` y devuelve el resultado ordenado de mayor a menor cantidad.

**Respuesta `200`:**
```json
[
  { "name": "Leanne Graham", "postCount": 5 },
  { "name": "Ervin Howell", "postCount": 3 }
]
```

**Errores:** `500` si falla la API externa.

---

### `POST /ai/analyze-comments`

Recibe una lista de textos, los analiza con Gemini y devuelve un resumen y el sentimiento general.

**Body:**
```json
{ "comments": ["comentario 1", "comentario 2"] }
```

**Validaciones:**
- `comments` es requerido y debe ser un array de strings
- Mínimo 1 elemento, máximo 20

**Respuesta `200`:**
```json
{
  "summary": "Los usuarios comentan principalmente sobre el sistema.",
  "sentiment": "neutral"
}
```

Valores válidos para `sentiment`: `positive`, `neutral`, `negative`.

**Errores:** `400` si el body es inválido, `500` si falla el LLM.

## Tests

```bash
cd backend
npm test
```

17 tests distribuidos en 4 suites:

| Suite | Cobertura |
|---|---|
| `postsService.test.js` | Agrupación, ordenamiento y manejo de errores del servicio |
| `aiService.test.js` | Parsing del LLM, extracción de JSON, validación de respuesta |
| `posts.route.test.js` | Integración del endpoint `GET /posts` |
| `ai.route.test.js` | Integración del endpoint `POST /ai/analyze-comments` |

## Decisiones Técnicas

**Arquitectura en capas:** Se separó el backend en cinco capas — rutas, controladores, servicios, clientes y esquemas — para que cada archivo tenga una única responsabilidad. Los controladores solo manejan HTTP; la lógica de negocio vive exclusivamente en los servicios.

**Validación en dos niveles:** Los inputs del usuario se validan con Zod en el controlador antes de llegar al servicio. La respuesta del LLM también se valida con un schema Zod para garantizar que siempre tenga la forma esperada, independientemente de lo que devuelva Gemini.

**Proxy en producción:** En Docker, el frontend compilado corre sobre Nginx, que actúa como proxy reverso hacia el backend usando el nombre de servicio del compose (`http://backend:3001`). Esto evita exponer el backend directamente al cliente y elimina problemas de CORS.

**Healthcheck en Docker:** El compose espera que el backend esté saludable (`service_healthy`) antes de arrancar el frontend, evitando que Nginx empiece a proxear requests antes de que Express esté listo.

## Uso de IA para Desarrollo

Este proyecto fue desarrollado con asistencia de **Claude Code** (CLI de Anthropic).

### Tareas asistidas por IA

- Generación del esqueleto inicial del proyecto (backend, frontend, Docker)
- Escritura de tests con Jest y Supertest
- Configuración del proxy de Vite y Nginx para producción
- Diagnóstico y corrección de bugs de integración entre capas
- Revisión de calidad de código y mejoras incrementales
