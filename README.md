Gitwallet: A toolkit for maintainers to build, sell and manage support tiers. 

## Getting Started

- Clone this repo
- Run `pnpm install`
- Run `pnpm dev`
- Go To http://gitwallet.local:3000 (See Hosts file instructions below)

## Deploying

1. merge to `main`
1. CD will automatically run migrations (even destructive ones! for now)

## Preview branches

NB preview builds use their own db, so it does not affect prod

1. Push any build to a branch that builds successfully
1. CD will automatically deploy a [preview build](https://vercel.com/lab0324/gitwallet-web/deployments?environment=preview)

## Local Development

Local Development Setup for Prisma with PostgreSQL

1. Create User and Database in PostgreSQL:
Run the following commands in your PostgreSQL terminal to set up the user and database:

```bash
CREATE USER gitwallet WITH PASSWORD 'gitwallet_dev' CREATEDB;
CREATE DATABASE gitwallet_dev OWNER gitwallet;
```

2. Set up Environment Variable:
Create a .env file in your project root and add the following line:

```env
POSTGRES_PRISMA_URL="postgresql://gitwallet:gitwallet_dev@localhost:5432/gitwallet_dev?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://gitwallet:gitwallet_dev@localhost:5432/gitwallet_dev?schema=public"
```

3. Install Dependencies:
Run the following command to install necessary Node.js packages:

```bash
pnpm install
```

4. Load Schema:

Overwite your local dev database with the contents of `prisma.schema`.

```bash
pnpm prisma db push
```

5. Populate db tables (required)

```bash
pnpm sync:services
```

6. Set up hosts

```
127.0.0.1 gitwallet.local agraves.gitwallet.local app.gitwallet.local alpha.gitwallet.local
```

7. Launch the server:

```bash
pnpm dev
```

## Migrations

to run:

`$ pnpm prisma migrate deploy`

to make a new one:

1. edit your schema.prisma
1. `$ pnpm prisma migrate dev`
1. edit the affected file as needed

to skip a destructive migration

`$ pnpm prisma migrate resolve --applied 20240220203418_sync_migrations_with_schema`

## Backups

visit [vercel](https://vercel.com/lab0324/gitwallet-web/stores/postgres/store_3VM9LMSgYfiNtAI0/data) to get the DB_SERVER_URL, USERNAME and password

`$ pg_dump -h DB_SERVER_URL.us-east-1.aws.neon.tech -p 5432 -U USERNAME -d verceldb -W --no-owner --no-acl -F c > gitwallet_prod.dump`

to restore

```
$ createdb gitwallet_prod
$ pg_restore -d gitwallet_prod gitwallet_prod.dump
```