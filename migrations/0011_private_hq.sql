-- HQ is private. Nobody is an operator until the owner key / allowlist grants it.
update profiles set is_admin = false where is_admin = true;
