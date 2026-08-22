-- QXio HQ: operator flag + lock. First human profile is the owner.

alter table profiles add column if not exists is_admin boolean not null default false;
alter table profiles add column if not exists banned_at timestamptz;

create index if not exists profiles_created_humans_idx
  on profiles (created_at desc)
  where coalesce(is_bot, false) = false;

update profiles
set is_admin = true
where id = (
  select id from profiles
  where coalesce(is_bot, false) = false
  order by created_at asc
  limit 1
)
and not exists (select 1 from profiles where is_admin = true);
