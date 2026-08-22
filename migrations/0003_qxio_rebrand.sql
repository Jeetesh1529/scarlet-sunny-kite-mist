-- Rebrand user-facing copy from Mxit Legacy → QXio (existing databases).

update profiles
  set mood = 'Hey there! I''m on QXio.'
  where mood = 'Hey there! I''m on Mxit.';

update profiles
  set mxit_id = 'qxiohelp', display_name = 'QXio Help'
  where id = 'bot-help';

update profiles
  set mood = 'missing the old days <3'
  where id = 'bot-thandi' and mood ilike '%mxit%';

update polls set question = 'Best chat era?' where id = 'poll-era';
update polls set question = 'Your QXio city?' where id = 'poll-city';

update confessions
  set body = 'I still have my old Nokia with this chat saved in the contacts. I refuse to throw it away.'
  where id = 'conf-1';

update statuses
  set caption = 'missing 2007 chats like it was yesterday <3'
  where id = 'st-3';
