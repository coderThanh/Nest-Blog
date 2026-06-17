-- This is an empty migration.
CREATE extension IF NOT EXISTS unaccent;

CREATE extension IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION immute_unaccent(var TEXT) RETURNS TEXT language SQL immutable AS $$
SELECT unaccent(var) $$;