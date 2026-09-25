# LetsResolve — web

The Next.js 14 (App Router) front end. See the [repository README](../README.md)
for the full architecture, feature list, and setup instructions covering both this
app and the `api/` service it talks to.

## Local development

```bash
npm i
cp .env.example .env.local
npm run dev      # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (`next lint`) |
| `npm test` | Jest + React Testing Library |
