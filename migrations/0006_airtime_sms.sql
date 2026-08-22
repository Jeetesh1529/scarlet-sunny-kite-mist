-- Airtime SMS: text-only over GSM (reception + airtime, no data bundle).

alter table profiles add column if not exists phone text;
alter table profiles add column if not exists airtime_sms boolean not null default false;

alter table messages add column if not exists channel text not null default 'data';

create unique index if not exists profiles_phone_uidx
  on profiles (phone) where phone is not null and phone <> '';

create index if not exists messages_channel_idx on messages (channel);
