SET statement_timeout = 0
SET lock_timeout = 0
SET idle_in_transaction_session_timeout = 0
SET client_encoding = 'UTF8'
SET standard_conforming_strings = on
SELECT pg_catalog.set_config('search_path', '', false)
SET check_function_bodies = false
SET xmloption = content
SET client_min_messages = warning
SET row_security = off
COMMENT ON SCHEMA "public" IS 'standard public schema'
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql"
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions"
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  invite_code text;
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON conflict (id) DO NOTHING;

  invite_code := lpad((floor(random()*1e9))::text, 9, '0');

  INSERT INTO public.rooms (owner_id, invite_code)
  VALUES (new.id, invite_code)
  ON conflict (owner_id) DO NOTHING;

  RETURN NEW;
END;$$
ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres"
SET default_tablespace = ''
SET default_table_access_method = "heap"
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text" NOT NULL,
    "avatar_url" "text"
)
ALTER TABLE "public"."profiles" OWNER TO "postgres"
CREATE TABLE IF NOT EXISTS "public"."rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "invite_code" "text" NOT NULL,
    "passcode_hash" "text",
    "is_active" boolean DEFAULT false NOT NULL
)
ALTER TABLE "public"."rooms" OWNER TO "postgres"
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_invite_code_key" UNIQUE ("invite_code")
ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_owner_id_key" UNIQUE ("owner_id")
ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres"
GRANT USAGE ON SCHEMA "public" TO "postgres"
GRANT USAGE ON SCHEMA "public" TO "anon"
GRANT USAGE ON SCHEMA "public" TO "authenticated"
GRANT USAGE ON SCHEMA "public" TO "service_role"
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon"
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated"
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role"
GRANT ALL ON TABLE "public"."profiles" TO "anon"
GRANT ALL ON TABLE "public"."profiles" TO "authenticated"
GRANT ALL ON TABLE "public"."profiles" TO "service_role"
GRANT ALL ON TABLE "public"."rooms" TO "anon"
GRANT ALL ON TABLE "public"."rooms" TO "authenticated"
GRANT ALL ON TABLE "public"."rooms" TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role"
RESET ALL
