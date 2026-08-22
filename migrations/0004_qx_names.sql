-- Display names: QX Banker / QX Post / QX Mix
update profiles
  set display_name = 'QX Banker'
  where id = 'bot-joe-banker';

update messages
  set content = replace(content, 'Tradepost', 'QX Post')
  where sender_id = 'bot-joe-banker' and content like '%Tradepost%';
