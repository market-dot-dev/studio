<p align="center" dir="auto">
    <img src="public/market-dot-dev-logo-white-cover.png" alt="market.dev logo" style="max-width: 420px; border-radius: 8px;">
</p>

<h3 align="center" dir="auto">market.dev</h3>
<p align="center" dir="auto">
    The all-in-one open-source business toolkit for developers.
    <br>
    <a href="https://market.dev/" rel="nofollow">Learn more</a>
    <br>
    <br>
    <a href="#features">Features</a> ·
    <a href="#roadmap">Roadmap</a> ·
    <a href="#hosted-service">Hosted Service</a> ·
    <a href="#contributing">Contribute</a> ·
    <a href="#why-a-monorepo">Why a monorepo?</a> ·
    <a href="#setup">Setup</a>
</p>

## Introduction

market.dev is the open-source platform with everything developers need to sell, manage & grow their business.

## Features

- **Create Tiers & Subscriptions**: Easily add & edit your service tiers. Set recurring subscriptions for your products.
- **Custom Domain**: Enhance branding and credibility with custom short links using your market.dev domain.
- **Beautiful Checkout Links**: Connect Stripe and instantly sell with professional, branded checkout links for all your offerings.
- **Customizable Landing Page**: Build a high-converting landing page with a full-screen code editor. Host images, embed dynamic tier/business info, and use ready-made sections.
- **Customizable Embeds**: Create embeddable widgets for your offerings to integrate them anywhere.
- **Contract Library**: Access a curated library of proven developer service agreements.
- **Prospect & Customer CRM**: Manage your entire sales pipeline, from leads and opportunities to existing customer interactions, all in one place.
- **Sales Analytics**: Get actionable insights into sales performance, customer behavior, and key revenue metrics.
- **Developer-Focused Lead Research**: Discover potential customers by analyzing open-source project dependency data.
- **Easily sell on explore.market.dev**: Optionally list and sell your services on the explore.market.dev marketplace.

## Roadmap

[See what's coming up](https://github.com/orgs/market-dot-dev/projects/1).

## Hosted Service

[Use our hosted service](https://market.dev/) to get a custom `market.dev` domain and use our tools without the maintenance.

## Contributing

Want to contribute?

[Read our guidelines](CONTRIBUTING.md) for submitting issues, making requests, and opening Pull Requests.
[Read the setup guide](#setup) to get started.

## Why a monorepo?

---

# Setup

### Getting Started

- Clone this repo
- Run `pnpm install`
- Run `pnpm dev`
- Go To http://market.local:3000 (See Hosts file instructions below)

### Deploying

1. merge to `main`
1. CD will automatically run migrations (even destructive ones! for now)

### Preview branches

NB preview builds use their own db, so it does not affect prod

1. Push any build to a branch that builds successfully
1. CD will automatically deploy a [preview build](https://vercel.com/marketdotdev/store/deployments?environment=preview)

### Local Development

Local Development Setup for Prisma with PostgreSQL

#### 1. Create User and Database in PostgreSQL

Run the following commands in your PostgreSQL terminal to set up the user and database:

```bash
CREATE USER gitwallet WITH PASSWORD 'gitwallet_dev' CREATEDB;
CREATE DATABASE gitwallet_dev OWNER gitwallet;
```

#### 2. Set up Environment Variables

Create a .env file in your project root and add the following line:

```env
POSTGRES_PRISMA_URL="postgresql://gitwallet:gitwallet_dev@localhost:5432/gitwallet_dev?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://gitwallet:gitwallet_dev@localhost:5432/gitwallet_dev?schema=public"
```

#### 3. Install Dependencies

Run the following command to install necessary Node.js packages:

```bash
pnpm install
```

#### 4. Load the Schema

Overwite your local dev database with the contents of `prisma.schema`.

```bash
pnpm prisma db push
```

#### 5. Populate db tables (required)

```bash
pnpm sync:services
```

#### 6. Setup Nginx

We use a reverse proxy in production, which sends traffic from [market.dev](https://market.dev) to our [NextJS app](https://github.com/market-dot-dev/store), and for [explore.market.dev](https://explore.market.dev) to this app. We use a similar reverse proxy in development, pointing to [market.local](http://market.local) and [explore.market.local](http://explore.market.local). This is only required if you're running both apps locally (required for shared login). If not, you can skip and just run it on `localhost:4000`. The easiest way to get Nginx running (assuming you're on a Mac) is with Brew:

i. Install Nginx via Homebrew

```
brew install nginx
brew services start nginx
```

ii. Create a server config file at `/opt/homebrew/etc/nginx/servers/market.conf`, and add the following:

```
server {
    listen 80;
    server_name market.local YOUR_GITHUB_USERNAME.market.local app.market.local;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 80;
    server_name explore.market.local;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

iii. Verify things are running:

```
nginx -t
brew services list
sudo nginx -s reload
```

#### 7. Set up hosts

`/etc/hosts` on a mac.

```
127.0.0.1       market.local
127.0.0.1       app.market.local
127.0.0.1       YOUR_GITHUB_USERNAME_OR_SUBDOMAIN.market.local
127.0.0.1       explore.market.local
255.255.255.255 broadcasthost
::1             localhost
```

#### 8. Run the server

```bash
pnpm dev
```

### Migrations

to run:

`$ pnpm prisma migrate deploy`

to make a new one:

1. edit your schema.prisma
1. `$ pnpm prisma migrate dev`
1. edit the affected file as needed

to skip a destructive migration

`$ pnpm prisma migrate resolve --applied 20240220203418_sync_migrations_with_schema`

### Testing Stripe Webhooks

To test Stripe webhook functionality locally:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) (and login)
2. Forward webhook events to your local server:
   ```
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
3. Set up two Stripe sandbox accounts for testing:
   - Main account: For platform-level operations
   - Vendor account: For testing Stripe Connect functionality & webhook events

This setup allows you to simulate the complete payment flow including Connect account events, subscription updates, and payment processing.

### Backups

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
