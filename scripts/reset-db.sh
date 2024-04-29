#!/usr/bin/env bash

if [[ "$VERCEL_ENV" == "production" ]]; then
  echo "This script cannot be run on a Vercel production instance."
  exit 1
fi

echo "[db:reset] Resetting dev database..."
echo "[db:reset] * resetting schema"
pnpm prisma migrate reset --force --preview-feature
echo "[db:reset] * triggering migrations"
pnpm prisma migrate deploy --preview-feature
echo "[db:reset] * loading services"
pnpm sync:services
echo "[db:reset] done"