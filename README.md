<p align="center" dir="auto">
    <img src="public/thumbnail.png" alt="market.dev logo" style="border-radius: 8px;">
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
    <a href="#setup">Setup</a>
</p>

## Introduction

market.dev is the open-source platform with everything developers need to sell and manage a professional services business. Perfect for open source maintainers, freelancers and consultants.

## Features

- **Create Tiers & Subscriptions**: Easily add & edit your service tiers. Set recurring subscriptions for your products.
- **Custom Domain**: Enhance branding and credibility with custom short links using your market.dev domain.
- **Beautiful Checkout Links**: Connect Stripe and instantly sell with professional, branded checkout links for all your offerings.
- **Customizable Landing Page**: Build a high-converting landing page with a full-screen code editor. Host images, embed dynamic tier/business info, and use ready-made sections.
- **Customizable Embeds**: Create embeddable widgets for your offerings to integrate them anywhere.
- **Contract Library**: Access a curated library of proven developer service agreements.
- **Prospect & Customer CRM**: Manage your entire sales pipeline, from leads and opportunities to existing customer interactions, all in one place.
- **Sales Analytics**: Get actionable insights into sales performance, customer behavior, and key revenue metrics.
- **Easily sell on explore.market.dev**: Optionally list and sell your services on the explore.market.dev marketplace.

## Roadmap

[See what's coming up](https://github.com/orgs/market-dot-dev/projects/1).

## Hosted Service

[Use our hosted service](https://market.dev/) to get a custom `market.dev` domain and use our tools without the maintenance.

## Contributing

Want to contribute?

[Read our guidelines](CONTRIBUTING.md) for submitting issues, making requests, and opening Pull Requests.

[Read the setup guide](#setup) to get started.

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

Run Migrations
```bash
pnpm prisma migrate dev
```

Overwite your local dev database with the contents of `prisma.schema`.
```bash
pnpm prisma db push
```

#### 5. Seed tables with sample data

```bash
pnpm db:seed
```

#### 8. Run the server

```bash
pnpm dev
```

This setup allows you to simulate the complete payment flow including Connect account events, subscription updates, and payment processing.
