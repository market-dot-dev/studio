ALTER DATABASE "gitwallet_prod" OWNER TO gitwallet;

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