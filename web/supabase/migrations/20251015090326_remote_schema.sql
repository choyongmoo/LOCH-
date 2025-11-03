drop policy "conv_members_insert_self" on "public"."conversation_members";

drop policy "conv_members_select_self" on "public"."conversation_members";

drop policy "conv_select_members" on "public"."conversations";

drop policy "conversations insert participants" on "public"."conversations";

drop policy "conversations select participants" on "public"."conversations";

drop policy "fr_insert_self" on "public"."friend_requests";

drop policy "fr_select_self" on "public"."friend_requests";

drop policy "fr_update_self" on "public"."friend_requests";

drop policy "friend delete pair" on "public"."friend_requests";

drop policy "friend insert self" on "public"."friend_requests";

drop policy "friend select self" on "public"."friend_requests";

drop policy "dm read by email" on "public"."messages";

drop policy "messages insert self sender" on "public"."messages";

drop policy "messages insert self" on "public"."messages";

drop policy "messages select participants" on "public"."messages";

drop policy "msg_insert_members" on "public"."messages";

drop policy "msg_select_members" on "public"."messages";

drop policy "profile insert own" on "public"."profile";

drop policy "profile select self or friends" on "public"."profile";

drop policy "profile self rw" on "public"."profile";

drop policy "profile update own" on "public"."profile";

drop policy "profile upsert own" on "public"."profile";

drop policy "profile: insert own" on "public"."profile";

drop policy "profile: select own" on "public"."profile";

drop policy "profile: update own" on "public"."profile";

drop policy "profile_insert_owner" on "public"."profile";

drop policy "profile_insert_self" on "public"."profile";

drop policy "profile_owner_all" on "public"."profile";

drop policy "profile_select_owner" on "public"."profile";

drop policy "profile_update_owner" on "public"."profile";

drop policy "Users can insert server messages" on "public"."server_messages";

drop policy "server_messages_insert_policy" on "public"."server_messages";

drop policy "users insert own" on "public"."users";

drop policy "users select own" on "public"."users";

drop policy "users self delete" on "public"."users";

drop policy "users update own" on "public"."users";

drop policy "users: insert own" on "public"."users";

drop policy "users: select own" on "public"."users";

drop policy "users: update own" on "public"."users";

drop policy "users_insert_self" on "public"."users";

drop policy "users_search_minimal" on "public"."users";

drop policy "users_select_self" on "public"."users";

drop policy "users_update_self" on "public"."users";

drop policy "servers_delete_policy" on "public"."servers";

drop policy "servers_insert_policy" on "public"."servers";

drop policy "servers_select_policy" on "public"."servers";

drop policy "servers_update_policy" on "public"."servers";

revoke delete on table "public"."conversation_members" from "anon";

revoke insert on table "public"."conversation_members" from "anon";

revoke references on table "public"."conversation_members" from "anon";

revoke select on table "public"."conversation_members" from "anon";

revoke trigger on table "public"."conversation_members" from "anon";

revoke truncate on table "public"."conversation_members" from "anon";

revoke update on table "public"."conversation_members" from "anon";

revoke delete on table "public"."conversation_members" from "authenticated";

revoke insert on table "public"."conversation_members" from "authenticated";

revoke references on table "public"."conversation_members" from "authenticated";

revoke select on table "public"."conversation_members" from "authenticated";

revoke trigger on table "public"."conversation_members" from "authenticated";

revoke truncate on table "public"."conversation_members" from "authenticated";

revoke update on table "public"."conversation_members" from "authenticated";

revoke delete on table "public"."conversation_members" from "service_role";

revoke insert on table "public"."conversation_members" from "service_role";

revoke references on table "public"."conversation_members" from "service_role";

revoke select on table "public"."conversation_members" from "service_role";

revoke trigger on table "public"."conversation_members" from "service_role";

revoke truncate on table "public"."conversation_members" from "service_role";

revoke update on table "public"."conversation_members" from "service_role";

revoke delete on table "public"."conversations" from "anon";

revoke insert on table "public"."conversations" from "anon";

revoke references on table "public"."conversations" from "anon";

revoke select on table "public"."conversations" from "anon";

revoke trigger on table "public"."conversations" from "anon";

revoke truncate on table "public"."conversations" from "anon";

revoke update on table "public"."conversations" from "anon";

revoke delete on table "public"."conversations" from "authenticated";

revoke insert on table "public"."conversations" from "authenticated";

revoke references on table "public"."conversations" from "authenticated";

revoke select on table "public"."conversations" from "authenticated";

revoke trigger on table "public"."conversations" from "authenticated";

revoke truncate on table "public"."conversations" from "authenticated";

revoke update on table "public"."conversations" from "authenticated";

revoke delete on table "public"."conversations" from "service_role";

revoke insert on table "public"."conversations" from "service_role";

revoke references on table "public"."conversations" from "service_role";

revoke select on table "public"."conversations" from "service_role";

revoke trigger on table "public"."conversations" from "service_role";

revoke truncate on table "public"."conversations" from "service_role";

revoke update on table "public"."conversations" from "service_role";

revoke delete on table "public"."friend_requests" from "anon";

revoke insert on table "public"."friend_requests" from "anon";

revoke references on table "public"."friend_requests" from "anon";

revoke select on table "public"."friend_requests" from "anon";

revoke trigger on table "public"."friend_requests" from "anon";

revoke truncate on table "public"."friend_requests" from "anon";

revoke update on table "public"."friend_requests" from "anon";

revoke delete on table "public"."friend_requests" from "authenticated";

revoke insert on table "public"."friend_requests" from "authenticated";

revoke references on table "public"."friend_requests" from "authenticated";

revoke select on table "public"."friend_requests" from "authenticated";

revoke trigger on table "public"."friend_requests" from "authenticated";

revoke truncate on table "public"."friend_requests" from "authenticated";

revoke update on table "public"."friend_requests" from "authenticated";

revoke delete on table "public"."friend_requests" from "service_role";

revoke insert on table "public"."friend_requests" from "service_role";

revoke references on table "public"."friend_requests" from "service_role";

revoke select on table "public"."friend_requests" from "service_role";

revoke trigger on table "public"."friend_requests" from "service_role";

revoke truncate on table "public"."friend_requests" from "service_role";

revoke update on table "public"."friend_requests" from "service_role";

revoke delete on table "public"."meeting_logs" from "anon";

revoke insert on table "public"."meeting_logs" from "anon";

revoke references on table "public"."meeting_logs" from "anon";

revoke select on table "public"."meeting_logs" from "anon";

revoke trigger on table "public"."meeting_logs" from "anon";

revoke truncate on table "public"."meeting_logs" from "anon";

revoke update on table "public"."meeting_logs" from "anon";

revoke delete on table "public"."meeting_logs" from "authenticated";

revoke insert on table "public"."meeting_logs" from "authenticated";

revoke references on table "public"."meeting_logs" from "authenticated";

revoke select on table "public"."meeting_logs" from "authenticated";

revoke trigger on table "public"."meeting_logs" from "authenticated";

revoke truncate on table "public"."meeting_logs" from "authenticated";

revoke update on table "public"."meeting_logs" from "authenticated";

revoke delete on table "public"."meeting_logs" from "service_role";

revoke insert on table "public"."meeting_logs" from "service_role";

revoke references on table "public"."meeting_logs" from "service_role";

revoke select on table "public"."meeting_logs" from "service_role";

revoke trigger on table "public"."meeting_logs" from "service_role";

revoke truncate on table "public"."meeting_logs" from "service_role";

revoke update on table "public"."meeting_logs" from "service_role";

revoke delete on table "public"."messages" from "anon";

revoke insert on table "public"."messages" from "anon";

revoke references on table "public"."messages" from "anon";

revoke select on table "public"."messages" from "anon";

revoke trigger on table "public"."messages" from "anon";

revoke truncate on table "public"."messages" from "anon";

revoke update on table "public"."messages" from "anon";

revoke delete on table "public"."messages" from "authenticated";

revoke insert on table "public"."messages" from "authenticated";

revoke references on table "public"."messages" from "authenticated";

revoke select on table "public"."messages" from "authenticated";

revoke trigger on table "public"."messages" from "authenticated";

revoke truncate on table "public"."messages" from "authenticated";

revoke update on table "public"."messages" from "authenticated";

revoke delete on table "public"."messages" from "service_role";

revoke insert on table "public"."messages" from "service_role";

revoke references on table "public"."messages" from "service_role";

revoke select on table "public"."messages" from "service_role";

revoke trigger on table "public"."messages" from "service_role";

revoke truncate on table "public"."messages" from "service_role";

revoke update on table "public"."messages" from "service_role";

revoke delete on table "public"."profile" from "anon";

revoke insert on table "public"."profile" from "anon";

revoke references on table "public"."profile" from "anon";

revoke select on table "public"."profile" from "anon";

revoke trigger on table "public"."profile" from "anon";

revoke truncate on table "public"."profile" from "anon";

revoke update on table "public"."profile" from "anon";

revoke delete on table "public"."profile" from "authenticated";

revoke insert on table "public"."profile" from "authenticated";

revoke references on table "public"."profile" from "authenticated";

revoke select on table "public"."profile" from "authenticated";

revoke trigger on table "public"."profile" from "authenticated";

revoke truncate on table "public"."profile" from "authenticated";

revoke update on table "public"."profile" from "authenticated";

revoke delete on table "public"."profile" from "service_role";

revoke insert on table "public"."profile" from "service_role";

revoke references on table "public"."profile" from "service_role";

revoke select on table "public"."profile" from "service_role";

revoke trigger on table "public"."profile" from "service_role";

revoke truncate on table "public"."profile" from "service_role";

revoke update on table "public"."profile" from "service_role";

revoke delete on table "public"."rooms" from "anon";

revoke insert on table "public"."rooms" from "anon";

revoke references on table "public"."rooms" from "anon";

revoke select on table "public"."rooms" from "anon";

revoke trigger on table "public"."rooms" from "anon";

revoke truncate on table "public"."rooms" from "anon";

revoke update on table "public"."rooms" from "anon";

revoke delete on table "public"."rooms" from "authenticated";

revoke insert on table "public"."rooms" from "authenticated";

revoke references on table "public"."rooms" from "authenticated";

revoke select on table "public"."rooms" from "authenticated";

revoke trigger on table "public"."rooms" from "authenticated";

revoke truncate on table "public"."rooms" from "authenticated";

revoke update on table "public"."rooms" from "authenticated";

revoke delete on table "public"."rooms" from "service_role";

revoke insert on table "public"."rooms" from "service_role";

revoke references on table "public"."rooms" from "service_role";

revoke select on table "public"."rooms" from "service_role";

revoke trigger on table "public"."rooms" from "service_role";

revoke truncate on table "public"."rooms" from "service_role";

revoke update on table "public"."rooms" from "service_role";

revoke delete on table "public"."server_members" from "anon";

revoke insert on table "public"."server_members" from "anon";

revoke references on table "public"."server_members" from "anon";

revoke select on table "public"."server_members" from "anon";

revoke trigger on table "public"."server_members" from "anon";

revoke truncate on table "public"."server_members" from "anon";

revoke update on table "public"."server_members" from "anon";

revoke delete on table "public"."server_members" from "authenticated";

revoke insert on table "public"."server_members" from "authenticated";

revoke references on table "public"."server_members" from "authenticated";

revoke select on table "public"."server_members" from "authenticated";

revoke trigger on table "public"."server_members" from "authenticated";

revoke truncate on table "public"."server_members" from "authenticated";

revoke update on table "public"."server_members" from "authenticated";

revoke delete on table "public"."server_members" from "service_role";

revoke insert on table "public"."server_members" from "service_role";

revoke references on table "public"."server_members" from "service_role";

revoke select on table "public"."server_members" from "service_role";

revoke trigger on table "public"."server_members" from "service_role";

revoke truncate on table "public"."server_members" from "service_role";

revoke update on table "public"."server_members" from "service_role";

revoke delete on table "public"."server_messages" from "anon";

revoke insert on table "public"."server_messages" from "anon";

revoke references on table "public"."server_messages" from "anon";

revoke select on table "public"."server_messages" from "anon";

revoke trigger on table "public"."server_messages" from "anon";

revoke truncate on table "public"."server_messages" from "anon";

revoke update on table "public"."server_messages" from "anon";

revoke delete on table "public"."server_messages" from "authenticated";

revoke insert on table "public"."server_messages" from "authenticated";

revoke references on table "public"."server_messages" from "authenticated";

revoke select on table "public"."server_messages" from "authenticated";

revoke trigger on table "public"."server_messages" from "authenticated";

revoke truncate on table "public"."server_messages" from "authenticated";

revoke update on table "public"."server_messages" from "authenticated";

revoke delete on table "public"."server_messages" from "service_role";

revoke insert on table "public"."server_messages" from "service_role";

revoke references on table "public"."server_messages" from "service_role";

revoke select on table "public"."server_messages" from "service_role";

revoke trigger on table "public"."server_messages" from "service_role";

revoke truncate on table "public"."server_messages" from "service_role";

revoke update on table "public"."server_messages" from "service_role";

revoke delete on table "public"."servers" from "anon";

revoke insert on table "public"."servers" from "anon";

revoke references on table "public"."servers" from "anon";

revoke select on table "public"."servers" from "anon";

revoke trigger on table "public"."servers" from "anon";

revoke truncate on table "public"."servers" from "anon";

revoke update on table "public"."servers" from "anon";

revoke delete on table "public"."servers" from "authenticated";

revoke insert on table "public"."servers" from "authenticated";

revoke references on table "public"."servers" from "authenticated";

revoke select on table "public"."servers" from "authenticated";

revoke trigger on table "public"."servers" from "authenticated";

revoke truncate on table "public"."servers" from "authenticated";

revoke update on table "public"."servers" from "authenticated";

revoke delete on table "public"."servers" from "service_role";

revoke insert on table "public"."servers" from "service_role";

revoke references on table "public"."servers" from "service_role";

revoke select on table "public"."servers" from "service_role";

revoke trigger on table "public"."servers" from "service_role";

revoke truncate on table "public"."servers" from "service_role";

revoke update on table "public"."servers" from "service_role";

revoke delete on table "public"."users" from "anon";

revoke insert on table "public"."users" from "anon";

revoke references on table "public"."users" from "anon";

revoke select on table "public"."users" from "anon";

revoke trigger on table "public"."users" from "anon";

revoke truncate on table "public"."users" from "anon";

revoke update on table "public"."users" from "anon";

revoke delete on table "public"."users" from "authenticated";

revoke insert on table "public"."users" from "authenticated";

revoke references on table "public"."users" from "authenticated";

revoke select on table "public"."users" from "authenticated";

revoke trigger on table "public"."users" from "authenticated";

revoke truncate on table "public"."users" from "authenticated";

revoke update on table "public"."users" from "authenticated";

revoke delete on table "public"."users" from "service_role";

revoke insert on table "public"."users" from "service_role";

revoke references on table "public"."users" from "service_role";

revoke select on table "public"."users" from "service_role";

revoke trigger on table "public"."users" from "service_role";

revoke truncate on table "public"."users" from "service_role";

revoke update on table "public"."users" from "service_role";

alter table "public"."conversation_members" drop constraint "conversation_members_user_id_fkey";

alter table "public"."conversations" drop constraint "conversations_dm_user1_id_fkey";

alter table "public"."conversations" drop constraint "conversations_dm_user2_id_fkey";

alter table "public"."conversations" drop constraint "dm_pair_present";

alter table "public"."friend_requests" drop constraint "friend_no_self";

alter table "public"."messages" drop constraint "messages_sender_id_fkey";

alter table "public"."profile" drop constraint "profile_user_fk";

alter table "public"."server_messages" drop constraint "meeting_messages_receiver_id_fkey";

alter table "public"."server_messages" drop constraint "meeting_messages_sender_id_fkey";

alter table "public"."users" drop constraint "users_auth_fk";

alter table "public"."users" drop constraint "users_email_key";

alter table "public"."users" drop constraint "users_user_uuid_udx";

alter table "public"."conversation_members" drop constraint "conversation_members_conversation_id_fkey";

alter table "public"."friend_requests" drop constraint "friend_requests_addressee_id_fkey";

alter table "public"."friend_requests" drop constraint "friend_requests_requester_id_fkey";

alter table "public"."messages" drop constraint "messages_conversation_id_fkey";

alter table "public"."profile" drop constraint "profile_id_fkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."conversations_user_pair_idx";

drop index if exists "public"."dm_unique_pair";

drop index if exists "public"."friend_pair_unique";

drop index if exists "public"."users_auth_id_udx";

drop index if exists "public"."users_email_key";

drop index if exists "public"."users_email_unique";

drop index if exists "public"."users_pkey";

drop index if exists "public"."users_user_uuid_udx";

drop table "public"."users";

alter table "public"."conversation_members" alter column "conversation_id" set data type uuid using "conversation_id"::uuid;

alter table "public"."conversations" alter column "created_at" drop not null;

alter table "public"."conversations" alter column "id" set default gen_random_uuid();

alter table "public"."conversations" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."conversations" alter column "is_dm" drop default;

alter table "public"."conversations" alter column "user1_id" set not null;

alter table "public"."conversations" alter column "user1_id" set data type uuid using "user1_id"::uuid;

alter table "public"."conversations" alter column "user2_id" set not null;

alter table "public"."conversations" alter column "user2_id" set data type uuid using "user2_id"::uuid;

alter table "public"."conversations" disable row level security;

alter table "public"."friend_requests" alter column "addressee_id" drop not null;

alter table "public"."friend_requests" alter column "addressee_id" set data type uuid using "addressee_id"::uuid;

alter table "public"."friend_requests" alter column "requester_id" drop not null;

alter table "public"."friend_requests" alter column "requester_id" set data type uuid using "requester_id"::uuid;

alter table "public"."meeting_logs" alter column "summary" set default ''::text;

alter table "public"."meeting_logs" alter column "summary" drop not null;

alter table "public"."meeting_logs" alter column "transcript" drop not null;

alter table "public"."messages" add column "server_id" uuid;

alter table "public"."messages" add column "type" text default 'text'::text;

alter table "public"."messages" alter column "conversation_id" set data type uuid using "conversation_id"::uuid;

alter table "public"."messages" alter column "receiver_id" set data type uuid using "receiver_id"::uuid;

alter table "public"."messages" alter column "sender_id" set data type uuid using "sender_id"::uuid;

alter table "public"."profile" drop column "language";

alter table "public"."profile" drop column "mic_device_id";

alter table "public"."profile" drop column "mic_enabled";

alter table "public"."profile" add column "birth_day" integer;

alter table "public"."profile" add column "birth_month" integer;

alter table "public"."profile" add column "birth_year" integer;

alter table "public"."profile" add column "email" text;

alter table "public"."profile" add column "password" text;

alter table "public"."profile" alter column "id" drop identity;

alter table "public"."profile" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."servers" alter column "host" set data type uuid using "host"::uuid;

drop sequence if exists "public"."conversations_id_seq";

CREATE UNIQUE INDEX idx_unique_pending_accepted ON public.friend_requests USING btree (requester_id, addressee_id) WHERE (status = ANY (ARRAY['pending'::friend_request_status, 'accepted'::friend_request_status]));

alter table "public"."servers" add constraint "servers_host_fkey" FOREIGN KEY (host) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."servers" validate constraint "servers_host_fkey";

alter table "public"."conversation_members" add constraint "conversation_members_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) not valid;

alter table "public"."conversation_members" validate constraint "conversation_members_conversation_id_fkey";

alter table "public"."friend_requests" add constraint "friend_requests_addressee_id_fkey" FOREIGN KEY (addressee_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_addressee_id_fkey";

alter table "public"."friend_requests" add constraint "friend_requests_requester_id_fkey" FOREIGN KEY (requester_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_requester_id_fkey";

alter table "public"."messages" add constraint "messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) not valid;

alter table "public"."messages" validate constraint "messages_conversation_id_fkey";

alter table "public"."profile" add constraint "profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_server_creator_as_member()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO server_members (
    server_id,
    user_id,
    role,
    is_active,
    joined_at
  )
  VALUES (
    NEW.id,
    NEW.host::uuid,
    'host',
    TRUE,
    NOW()
  );
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_birth_date date;
begin
  if (new.raw_user_meta_data ? 'birthDate')
     and nullif(new.raw_user_meta_data->>'birthDate','') is not null then
    v_birth_date := to_date(new.raw_user_meta_data->>'birthDate', 'YYYY-MM-DD');
  else
    v_birth_date := null;
  end if;

  insert into public.profile (
    id, email, nickname, birth_year, birth_month, birth_day
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name',''),
    case when v_birth_date is null then null else extract(year from v_birth_date)::int end,
    case when v_birth_date is null then null else extract(month from v_birth_date)::int end,
    case when v_birth_date is null then null else extract(day from v_birth_date)::int end
  );
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.map_users_auth_id(p_old_id bigint)
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  SELECT u.id     -- ★ 주의: auth.users의 PK 컬럼 이름이 id(=uuid)
  FROM auth.users u
  WHERE u.id = (
    SELECT uu.auth_id FROM public.users uu WHERE uu.id = p_old_id
  )
$function$
;

CREATE OR REPLACE FUNCTION public.search_servers(search_text text)
 RETURNS TABLE(id uuid, room_name text, description text, host uuid, host_nickname text, max_participants integer, is_private boolean, password text, status text, created_at timestamp with time zone, server_members json)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT s.id,
           s.room_name,
           s.description,
           s.host,
           p.nickname AS host_nickname,
           s.max_participants,
           s.is_private,
           s.password,
           s.status,
           s.created_at,
           (
             SELECT json_agg(row_to_json(sm))
             FROM server_members sm
             WHERE sm.server_id = s.id
           ) AS server_members
    FROM servers s
    JOIN profile p ON s.host = p.id
    WHERE s.status = 'active'
      AND (s.room_name ILIKE '%' || search_text || '%'
           OR p.nickname ILIKE '%' || search_text || '%');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_server_room()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into rooms (server_id)
  values (new.id);
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.decrement_user_count(room_id uuid)
 RETURNS void
 LANGUAGE sql
AS $function$
  update rooms
  set user_count = greatest(user_count - 1, 0)
  where id = room_id;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_user_and_profile(target_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  user_id bigint;
begin
  select id into user_id from users where email = target_email limit 1;
  if user_id is not null then
    delete from friend_requests where requester_id = user_id or addressee_id = user_id;
    delete from profile where id = user_id;
    delete from users where id = user_id;
  end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_user_count(room_id uuid)
 RETURNS void
 LANGUAGE sql
AS $function$
  update rooms
  set user_count = user_count + 1
  where id = room_id;
$function$
;

create policy "Allow insert for DM"
on "public"."conversations"
as permissive
for insert
to public
with check (((auth.uid() = user1_id) OR (auth.uid() = user2_id)));


create policy "Allow select for DM"
on "public"."conversations"
as permissive
for select
to public
using (((auth.uid() = user1_id) OR (auth.uid() = user2_id)));


create policy "Allow update for DM"
on "public"."conversations"
as permissive
for update
to public
using (((auth.uid() = user1_id) OR (auth.uid() = user2_id)));


create policy "Allow creating own friend requests"
on "public"."friend_requests"
as permissive
for insert
to authenticated
with check ((requester_id = auth.uid()));


create policy "Allow update own friend requests"
on "public"."friend_requests"
as permissive
for update
to authenticated
using (((requester_id = auth.uid()) OR (addressee_id = auth.uid())));


create policy "Allow viewing own friend requests"
on "public"."friend_requests"
as permissive
for select
to authenticated
using (((requester_id = auth.uid()) OR (addressee_id = auth.uid())));


create policy "User can delete their own requests"
on "public"."friend_requests"
as permissive
for delete
to public
using (((requester_id = auth.uid()) OR (addressee_id = auth.uid())));


create policy "Allow insert message"
on "public"."messages"
as permissive
for insert
to public
with check ((auth.uid() = sender_id));


create policy "Allow select message"
on "public"."messages"
as permissive
for select
to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


create policy "Can insert messages"
on "public"."messages"
as permissive
for insert
to public
with check ((sender_id = auth.uid()));


create policy "Can read own messages"
on "public"."messages"
as permissive
for select
to public
using (((sender_id = auth.uid()) OR (receiver_id = auth.uid())));


create policy "Allow authenticated users to search other profiles"
on "public"."profile"
as permissive
for select
to authenticated
using ((auth.uid() IS NOT NULL));


create policy "Users can update their own profile"
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "insert_own"
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "profile_insert_own"
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "profile_select_own"
on "public"."profile"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "profile_update_own"
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "select_own"
on "public"."profile"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "servers_delete_policy"
on "public"."servers"
as permissive
for delete
to public
using ((auth.uid() = host));


create policy "servers_insert_policy"
on "public"."servers"
as permissive
for insert
to public
with check ((auth.uid() = host));


create policy "servers_select_policy"
on "public"."servers"
as permissive
for select
to public
using (true);


create policy "servers_update_policy"
on "public"."servers"
as permissive
for update
to public
using ((auth.uid() = host));


CREATE TRIGGER add_server_member_after_insert AFTER INSERT ON public.servers FOR EACH ROW EXECUTE FUNCTION add_server_creator_as_member();


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


