-- Paid Moola purchases (Google Play Billing).
-- One row per Play purchase token, so a token is only ever credited once
-- (idempotency + replay protection). purchase_token is the primary key.

CREATE TABLE IF NOT EXISTS purchases (
  purchase_token TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id     TEXT NOT NULL,
  moola          INTEGER NOT NULL,
  order_id       TEXT,
  state          TEXT NOT NULL DEFAULT 'credited',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS purchases_user_idx ON purchases (user_id, created_at DESC);
