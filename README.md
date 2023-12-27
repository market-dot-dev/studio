Gitwallet: A toolkit for maintainers to build, sell and manage support tiers. 

## Getting Started

- Clone this repo
- Run `pnpm install`
- Run `pnpm dev`
- Go To http://app.localhost:3000

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

5. Launch the server:

```bash
pnpm dev
```
