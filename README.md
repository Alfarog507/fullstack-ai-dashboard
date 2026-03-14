# Prueba Técnica — Full Stack Developer (AI-Enabled)

Aplicación full stack que consume datos de una API externa, los procesa mediante un backend propio, integra un modelo de lenguaje (LLM) para análisis de texto y presenta la información en un cliente web moderno.

## Tech Stack

**Backend**
- Node.js + Express
- Integración con LLM (OpenAI / Anthropic / Gemini / Groq)

**Frontend**
- React 18 (o Vue 3)
- TailwindCSS
- Programación funcional (Hooks / Composition API)

**Infraestructura**
- Docker + Docker Compose

## Estructura del Proyecto

```
/backend
  ├── Dockerfile
  ├── src/
  └── ...

/frontend
  ├── Dockerfile
  ├── src/
  └── ...

docker-compose.yml
.dockerignore
README.md
```

## Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose instalados
- API Key de un proveedor de LLM (OpenAI, Anthropic, Gemini, Groq, etc.)

## Instalación y Ejecución

### Con Docker (recomendado)

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd prueba-fullstack-ai
   ```

2. Crear el archivo `.env` en la raíz del proyecto (o en `/backend`) con las variables de entorno necesarias:
   ```env
   LLM_API_KEY=tu_api_key_aqui
   ```

3. Levantar los servicios:
   ```bash
   docker compose up
   ```

### Sin Docker

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### `GET /posts`

Consume los datos de la API externa, agrupa los comentarios por nombre de usuario y cuenta cuántos tiene cada uno.

**Respuesta:**
```json
[
  { "name": "Pedro Gonzalez", "postCount": 10 },
  { "name": "Fabricio Perez", "postCount": 8 }
]
```

**Errores:**
- `500` — Fallo al consumir la API externa.

---

### `POST /ai/analyze-comments`

Recibe una lista de comentarios, los envía a un LLM y devuelve un análisis automático con resumen y sentimiento general.

**Body:**
```json
{
  "comments": ["comentario 1", "comentario 2", "..."]
}
```

**Respuesta:**
```json
{
  "summary": "Los usuarios comentan principalmente sobre el sistema y la experiencia de uso.",
  "sentiment": "neutral"
}
```

## Frontend

- **Vista principal:** Tabla con columnas *Usuario* y *Cantidad de Posts*.
- **Búsqueda:** Campo de texto para filtrar por nombre de usuario.
- **Análisis con IA:** Botón "Analizar comentarios con IA" que envía los comentarios al endpoint de análisis y muestra el resumen y sentimiento generados.

## Tests

```bash
cd backend
npm test
```

## Funcionalidades Opcionales

- [ ] Clasificación automática de comentarios
- [ ] Búsqueda semántica con embeddings
- [ ] Streaming de respuestas del LLM
- [ ] Despliegue en servicio cloud

## Uso de IA para Desarrollo

### Herramientas utilizadas

<!-- Completar con las herramientas que uses -->
- Ejemplo: Claude Code, GitHub Copilot, ChatGPT, Cursor, etc.

### Tareas en las que ayudaron

<!-- Completar -->
- Generación de código
- Debugging
- Tests
- Documentación

### Ejemplos de prompts utilizados

<!-- Completar con prompts reales que hayas usado -->

```
Ejemplo: "Genera un endpoint en Express que consuma la API de posts y agrupe los comentarios por usuario."
```