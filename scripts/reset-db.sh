#!/usr/bin/env bash

if [[ "$VERCEL_ENV" == "production" ]]; then
  echo "This script cannot be run on a Vercel production instance."
  exit 1
fi


pnpm prisma migrate reset --force --preview-feature
pnpm prisma migrate deploy --preview-feature
pnpm sync:services