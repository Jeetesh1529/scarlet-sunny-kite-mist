-- Mxit-style GPRS: tiny packets billed from airtime (~1–2c to the telco).
alter table profiles add column if not exists airtime_gprs boolean not null default false;
