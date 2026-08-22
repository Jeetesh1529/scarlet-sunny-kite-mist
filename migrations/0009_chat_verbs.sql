alter table messages add column if not exists reply_to text;
alter table messages add column if not exists reply_preview text;
alter table messages add column if not exists deleted boolean not null default false;

create table if not exists matches (
  id text primary key,
  game text not null,
  player_a text not null,
  player_b text not null,
  state text not null,
  turn text not null,
  winner text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists matches_players_idx on matches (player_a, player_b);

insert into room_members (room_id, user_id)
select r.id, p.id from chatrooms r
cross join profiles p
where p.is_bot = true
on conflict do nothing;
