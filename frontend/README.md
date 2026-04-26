# AssetFlow Frontend

React + Vite frontend for AssetFlow.

## Requirements

- Node.js 22+
- npm

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create env file:

   ```bash
   cp .env.example .env
   ```

3. Set API base URL in `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Run dev server:

   ```bash
   npm run dev
   ```

## Build and quality checks

```bash
npm run lint
npm run build
```

## Docker

Build and run frontend image:

```bash
docker build -t assetflow-frontend .
docker run --rm -p 8081:80 assetflow-frontend
```
