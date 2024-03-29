#!/usr/bin/env bash

dropdb gitwallet_prod
createdb gitwallet_prod
pg_restore -d gitwallet_prod ../gitwallet_prod.dump
psql gitwallet_prod < scripts/dev-assign-ownership.sql