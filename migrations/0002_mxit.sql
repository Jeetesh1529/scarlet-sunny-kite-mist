-- QXio schema

create table if not exists profiles (
  id text primary key,
  mxit_id text not null unique,
  display_name text not null,
  mood text default 'Hey there! I''m on QXio.',
  mood_code text default ':)',
  avatar_seed text default 'pixel-0',
  avatar_url text,
  gender text,
  age int,
  moola int not null default 100,
  theme text not null default 'classic',
  display_mode text not null default 'normal',
  sound_enabled boolean not null default true,
  presence text not null default 'online',
  farewell text,
  hide_offline boolean not null default false,
  read_receipts boolean not null default true,
  is_bot boolean not null default false,
  last_seen timestamptz not null default now(),
  last_daily_claim date,
  streak_days int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists profiles_mxit_id_idx on profiles (mxit_id);

create table if not exists contacts (
  id text primary key,
  requester_id text not null,
  addressee_id text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id)
);
create index if not exists contacts_req_idx on contacts (requester_id);
create index if not exists contacts_add_idx on contacts (addressee_id);

create table if not exists conversations (
  id text primary key,
  user_a text not null,
  user_b text not null,
  last_message_at timestamptz not null default now(),
  unique (user_a, user_b)
);

create table if not exists messages (
  id text primary key,
  conversation_id text,
  room_id text,
  group_id text,
  sender_id text not null,
  content text not null,
  delivery text not null default 'sent',
  created_at timestamptz not null default now()
);
create index if not exists messages_conv_idx on messages (conversation_id, created_at);
create index if not exists messages_room_idx on messages (room_id, created_at);
create index if not exists messages_group_idx on messages (group_id, created_at);

create table if not exists chatrooms (
  id text primary key,
  name text not null unique,
  topic text,
  is_official boolean not null default true
);

create table if not exists room_members (
  room_id text not null,
  user_id text not null,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists multimx_groups (
  id text primary key,
  name text not null,
  owner_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists multimx_members (
  group_id text not null,
  user_id text not null,
  primary key (group_id, user_id)
);

create table if not exists statuses (
  id text primary key,
  author_id text not null,
  caption text,
  background text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists statuses_exp_idx on statuses (expires_at);

create table if not exists status_views (
  status_id text not null,
  viewer_id text not null,
  viewed_at timestamptz not null default now(),
  primary key (status_id, viewer_id)
);

create table if not exists moola_tx (
  id text primary key,
  user_id text not null,
  amount int not null,
  reason text not null,
  created_at timestamptz not null default now()
);
create index if not exists moola_tx_user_idx on moola_tx (user_id, created_at);

create table if not exists achievements (
  user_id text not null,
  code text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, code)
);

create table if not exists confessions (
  id text primary key,
  author_id text,
  body text not null,
  hearts int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists confession_hearts (
  confession_id text not null,
  user_id text not null,
  primary key (confession_id, user_id)
);

create table if not exists polls (
  id text primary key,
  question text not null,
  options text not null,
  created_at timestamptz not null default now()
);

create table if not exists poll_votes (
  poll_id text not null,
  user_id text not null,
  option_idx int not null,
  primary key (poll_id, user_id)
);

create table if not exists moonbase (
  user_id text primary key,
  base_name text not null default 'Alpha Base',
  oxygen int not null default 220,
  water int not null default 220,
  iron int not null default 480,
  helium int not null default 90,
  power int not null default 12,
  buildings text not null default '{"command_centre":1,"oxygen_plant":1,"water_extractor":1,"iron_mine":1}',
  units text not null default '{"moonbuggy":2}',
  last_tick timestamptz not null default now()
);

create table if not exists nicknames (
  owner_id text not null,
  contact_id text not null,
  nickname text not null,
  primary key (owner_id, contact_id)
);

-- Seed bots
insert into profiles (id, mxit_id, display_name, mood, mood_code, avatar_seed, presence, is_bot, moola)
values
  ('bot-joe-banker', 'joebanker', 'QX Banker', 'Need Moola? I got you :D', ':D', 'pixel-1', 'online', true, 9999),
  ('bot-jade-ct', 'jade_ct', 'JADE CT', 'heita from the mother city :)', ':)', 'pixel-2', 'online', true, 420),
  ('bot-sipho', 'sipho', 'Sipho', 'sharp sharp my bru', ':D', 'pixel-3', 'online', true, 180),
  ('bot-thandi', 'thandi', 'Thandi', 'missing the old days <3', '<3', 'pixel-4', 'away', true, 260),
  ('bot-lurker', 'lurker', 'Lurker', '…', ':|', 'pixel-5', 'offline', true, 40),
  ('bot-help', 'qxiohelp', 'QXio Help', 'Tap me if you get stuck', '8-)', 'pixel-6', 'online', true, 0)
on conflict (id) do nothing;

insert into chatrooms (id, name, topic, is_official) values
  ('room-cpt', 'Cape Town', 'Mother City hangout · howzit CT', true),
  ('room-jhb', 'Johannesburg', 'Jozi nights and highway lights', true),
  ('room-dbn', 'Durban', 'Durbs · beach, bunny chow, vibes', true),
  ('room-general', 'General', 'Anyone, anywhere, anytime', true),
  ('room-gaming', 'Gaming', 'Moonbase, TicTacToe, high scores', true),
  ('room-music', 'Music', 'Drop a track, drop a mood', true)
on conflict (id) do nothing;

insert into polls (id, question, options) values
  ('poll-era', 'Best chat era?', '["Feature phone 2005–2008","Chat rooms peak 2009","Mobi portal years","This revival"]'),
  ('poll-city', 'Your QXio city?', '["Cape Town","Johannesburg","Durban","Pretoria","Elsewhere"]'),
  ('poll-skin', 'Favourite skinz?', '["Classic Blue","Midnight black","Lime","Bubble pink"]')
on conflict (id) do nothing;

insert into messages (id, room_id, sender_id, content, created_at) values
  ('seed-r1', 'room-cpt', 'bot-jade-ct', 'heita CT :D who''s still on this thing??', now() - interval '40 minutes'),
  ('seed-r2', 'room-cpt', 'bot-sipho', 'always been on it my bru, loadshedding or not', now() - interval '32 minutes'),
  ('seed-r3', 'room-general', 'bot-thandi', 'remember when 1 Moola felt like gold <3', now() - interval '2 hours'),
  ('seed-r4', 'room-gaming', 'bot-joe-banker', 'Moonbase is live in QX Post. Don''t go broke on gunships.', now() - interval '90 minutes'),
  ('seed-r5', 'room-music', 'bot-jade-ct', ':music: dropping Freshlyground in the music room later', now() - interval '15 minutes')
on conflict (id) do nothing;

insert into confessions (id, author_id, body, hearts, created_at) values
  ('conf-1', 'bot-thandi', 'I still have my old Nokia with this chat saved in the contacts. I refuse to throw it away.', 12, now() - interval '1 day'),
  ('conf-2', 'bot-sipho', 'I met my wife in a Cape Town chatroom in 2008. We still say heita instead of hello.', 31, now() - interval '5 hours'),
  ('conf-3', 'bot-jade-ct', 'I spent my entire airtime on emoticards one December. Worth it.', 7, now() - interval '3 hours')
on conflict (id) do nothing;

insert into statuses (id, author_id, caption, background, created_at, expires_at) values
  ('st-1', 'bot-jade-ct', 'Table Mountain looking cinematic tonight :)', '#0A2A5E', now() - interval '20 minutes', now() + interval '23 hours'),
  ('st-2', 'bot-sipho', 'sharp sharp — weekend loading', '#1E78D6', now() - interval '1 hour', now() + interval '22 hours'),
  ('st-3', 'bot-thandi', 'missing 2007 chats like it was yesterday <3', '#E04B98', now() - interval '3 hours', now() + interval '20 hours')
on conflict (id) do nothing;
