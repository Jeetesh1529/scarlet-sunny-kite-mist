create table if not exists contact_blocks (
  blocker_id text not null,
  blocked_id text not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists reports (
  id text primary key,
  reporter_id text not null,
  target_id text not null,
  reason text not null default 'abuse',
  created_at timestamptz not null default now()
);

create index if not exists reports_target_idx on reports (target_id, created_at desc);
