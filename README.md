# LetsResolve

A support desk: raise tickets with file attachments, and publish knowledge-base articles that
answer them. Next.js 14 (App Router) front end with Cognito-backed auth, talking to an
Express + TypeScript API over DynamoDB and S3.

## Features

- **Tickets** — create, edit, view and delete, each with multiple file attachments
- **Knowledge base** — articles with the same create/edit/view/delete lifecycle
- **Auth** — sign-up, e-mail confirmation, login, password reset, and profile/e-mail/password
  updates, all through Amazon Cognito
- **Route protection** — Next.js middleware resolves the Cognito session server-side and gates
  `/dashboard`, with `/dashboard/admin` restricted to admin users
- **Light and dark themes**

## Architecture

```
lets-resolve/   Next.js 14 App Router · TypeScript · Tailwind · AWS Amplify
    app/        routes: auth flows, dashboard, tickets, articles, profile
    ui/         presentational components, grouped by feature
    lib/        data actions + server actions for cache revalidation
    middleware.ts   server-side session check and admin gate

api/            Express 4 · TypeScript
    routes/     /ticket, /article, /user
    controller/ DynamoDB access via @aws-sdk/client-dynamodb
    util/       multer-s3 upload pipeline, validators
```

Tickets and articles are stored in DynamoDB tables (`Ticket`, `Article`); attachments stream
straight to S3 through `multer-s3` and are referenced by key on the record. The front end reaches
the API through server actions, so DynamoDB and S3 credentials never touch the browser.

## Running it locally

```bash
# API
cd api && npm i
cp .env.example .env.local        # AWS credentials, region, S3 bucket
npm run dev                       # http://localhost:4000

# Front end
cd lets-resolve && npm i
cp .env.example .env.local        # Cognito user-pool id + client id, region, API URL
npm run dev                       # http://localhost:3000
```

You need a Cognito user pool, a DynamoDB table each for `Ticket` and `Article`, and an S3 bucket.

## Known gaps

Worth stating plainly, since this is a personal build rather than production:

- The API trusts its caller — Cognito protects the front end, but the Express routes themselves
  carry no token verification.
- List endpoints use a DynamoDB `Scan` with no pagination.
- The API base URL is hard-coded in `lib/` rather than read from `NEXT_API_URL`.
- Ticket ids come from `Math.random()`, so collisions are possible at volume.
