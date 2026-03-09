-- Tabela: orders
CREATE TABLE IF NOT EXISTS orders (
  "orderId"      VARCHAR(100) PRIMARY KEY,
  "value"        NUMERIC(15, 2) NOT NULL,
  "creationDate" TIMESTAMPTZ NOT NULL
);

-- Tabela: items
CREATE TABLE IF NOT EXISTS items (
  id          SERIAL PRIMARY KEY,
  "orderId"   VARCHAR(100) NOT NULL REFERENCES orders("orderId") ON DELETE CASCADE,
  "productId" INTEGER NOT NULL,
  "quantity"  INTEGER NOT NULL,
  "price"     NUMERIC(15, 2) NOT NULL
);
