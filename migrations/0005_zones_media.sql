-- Zones, pinned favourites, media messages, typing, push pref, unique IDs.

alter table profiles add column if not exists zone text not null default 'ct';
alter table profiles add column if not exists notify_push boolean not null default true;

alter table contacts add column if not exists pinned boolean not null default false;

alter table messages add column if not exists kind text not null default 'text';
alter table messages add column if not exists media text;

create table if not exists typing (
  conversation_id text not null,
  user_id text not null,
  updated_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create unique index if not exists profiles_mxit_id_lower_uidx on profiles (lower(mxit_id));

update profiles set zone = 'ct' where id in ('bot-jade-ct', 'bot-joe-banker', 'bot-help');
update profiles set zone = 'jhb' where id = 'bot-sipho';
update profiles set zone = 'dbn' where id = 'bot-thandi';
update profiles set zone = 'pta' where id = 'bot-lurker';

update profiles set mood_code = ':)' where id = 'bot-help' and (mood_code is null or mood_code = '8-)');
update profiles set mood_code = ':|' where id = 'bot-lurker' and (mood_code is null or mood_code = '');
