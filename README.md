market.dev is a commerce platform for developers. 

## Getting Started

- Clone this repo
- Run `pnpm install`
- Run `pnpm dev`
- Go To http://store.local:3000 (See Hosts file instructions below)

## Deploying

1. merge to `main`
1. CD will automatically run migrations (even destructive ones! for now)

## Tests

To run the cypress integration tests:

NB: tests run in local dev and will reset your db

1. $ pnpm cypress open
1. choose "e2e" -> "chrome"
1. click the name of the test to run e.g. "smoke-test.cy.js"

Tests are located under `cypress/e2e/`.

## Preview branches

NB preview builds use their own db, so it does not affect prod

1. Push any build to a branch that builds successfully
1. CD will automatically deploy a [preview build](https://vercel.com/marketdotdev/store/deployments?environment=preview)

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
127.0.0.1 store.local
127.0.0.1 app.store.local
127.0.0.1 YOUR_GITHUB_USERNAME_OR_SUBDOMAIN.store.local
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

visit [vercel](https://vercel.com/marketdotdev/store/stores/postgres/store_3VM9LMSgYfiNtAI0/data) to get the DB_SERVER_URL, USERNAME and password

`$ pg_dump -h DB_SERVER_URL.us-east-1.aws.neon.tech -p 5432 -U USERNAME -d verceldb -W --no-owner --no-acl -F c > gitwallet_prod.dump`

to restore

```
$ createdb gitwallet_prod
$ pg_restore -d gitwallet_prod gitwallet_prod.dump
```

assign ownership of everything to the gitwallet postgres account:

```-- Change ownership of all tables in the public schema
alter database "gitwallet_prod" owner to gitwallet;
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' OWNER TO gitwallet';
    END LOOP;
END $$;

-- Change ownership of all sequences in the public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(r.sequence_name) || ' OWNER TO gitwallet';
    END LOOP;
END $$;

-- Change ownership of all views in the public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
        EXECUTE 'ALTER VIEW ' || quote_ident(r.table_name) || ' OWNER TO gitwallet';
    END LOOP;
END $$;

-- Grant all privileges on the database to gitwallet
GRANT ALL PRIVILEGES ON DATABASE "gitwallet_prod" TO gitwallet;

-- Alter default privileges in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO gitwallet;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO gitwallet;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO gitwallet;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TYPES TO gitwallet;
```