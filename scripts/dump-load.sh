#!/usr/bin/env bash

if [ "$VERCEL" == "1" ]; then
  echo "This script is intended for local development only. Exiting..."
  exit 0
fi

dropdb gitwallet_prod
createdb gitwallet_prod
pg_restore -d gitwallet_prod ../gitwallet_prod.dump
psql gitwallet_prod < scripts/dev-assign-ownership.sql