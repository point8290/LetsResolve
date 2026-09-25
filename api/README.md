# LetsResolve — API

The Express 4 + TypeScript API. See the [repository README](../README.md) for the
full architecture, feature list, and setup instructions covering both this service
and the `lets-resolve/` front end that calls it.

## Local development

```bash
npm i
cp .env.example .env.local
npm run dev      # http://localhost:4000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with reload (nodemon) |
| `npm run build` | Compile to `build/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest + Supertest against a mocked DynamoDB client |
