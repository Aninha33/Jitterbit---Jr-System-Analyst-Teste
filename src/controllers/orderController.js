const pool = require('../config/db');

/**
 * Mapeia o body recebido (PT) para o formato do banco (EN)
 * numeroPedido -> orderId
 * valorTotal   -> value
 * dataCriacao  -> creationDate
 * items[].idItem         -> productId
 * items[].quantidadeItem -> quantity
 * items[].valorItem      -> price
 */
const mapRequestToDb = (body) => ({
  orderId: body.numeroPedido,
  value: body.valorTotal,
  creationDate: new Date(body.dataCriacao).toISOString(),
  items: (body.items || []).map((item) => ({
    productId: parseInt(item.idItem),
    quantity: item.quantidadeItem,
    price: item.valorItem,
  })),
});

/**
 * Monta o objeto de resposta completo (order + items)
 */
const buildOrderResponse = (order, items) => ({
  orderId: order.orderId,
  value: parseFloat(order.value),
  creationDate: order.creationDate,
  items: items.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
    price: parseFloat(i.price),
  })),
});

// ──────────────────────────────────────────────
// POST /order  →  Criar pedido
// ──────────────────────────────────────────────
const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação dos campos obrigatórios
    if (!numeroPedido || valorTotal === undefined || !dataCriacao) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes: numeroPedido, valorTotal, dataCriacao',
      });
    }

    const mapped = mapRequestToDb(req.body);

    await client.query('BEGIN');

    // Insere o pedido na tabela orders
    await client.query(
      `INSERT INTO orders ("orderId", "value", "creationDate") VALUES ($1, $2, $3)`,
      [mapped.orderId, mapped.value, mapped.creationDate]
    );

    // Insere cada item na tabela items
    for (const item of mapped.items) {
      await client.query(
        `INSERT INTO items ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`,
        [mapped.orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json(buildOrderResponse(mapped, mapped.items));
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Pedido com esse numeroPedido já existe.' });
    }
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ──────────────────────────────────────────────
// GET /order/:numeroPedido  →  Buscar pedido
// ──────────────────────────────────────────────
const getOrder = async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE "orderId" = $1`,
      [numeroPedido]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const itemsResult = await pool.query(
      `SELECT * FROM items WHERE "orderId" = $1`,
      [numeroPedido]
    );

    return res.json(buildOrderResponse(orderResult.rows[0], itemsResult.rows));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────────
// GET /order/list  →  Listar todos os pedidos
// ──────────────────────────────────────────────
const listOrders = async (req, res) => {
  try {
    const ordersResult = await pool.query(`SELECT * FROM orders ORDER BY "creationDate" DESC`);
    const itemsResult = await pool.query(`SELECT * FROM items`);

    const orders = ordersResult.rows.map((order) => {
      const items = itemsResult.rows.filter((i) => i.orderId === order.orderId);
      return buildOrderResponse(order, items);
    });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────────
// PUT /order/:numeroPedido  →  Atualizar pedido
// ──────────────────────────────────────────────
const updateOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { numeroPedido } = req.params;

    // Verifica se o pedido existe
    const existing = await client.query(
      `SELECT * FROM orders WHERE "orderId" = $1`,
      [numeroPedido]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const mapped = mapRequestToDb({ numeroPedido, ...req.body });

    await client.query('BEGIN');

    // Atualiza os campos do pedido
    await client.query(
      `UPDATE orders SET "value" = $1, "creationDate" = $2 WHERE "orderId" = $3`,
      [mapped.value ?? existing.rows[0].value, mapped.creationDate ?? existing.rows[0].creationDate, numeroPedido]
    );

    // Substitui os itens se enviados
    if (req.body.items && req.body.items.length > 0) {
      await client.query(`DELETE FROM items WHERE "orderId" = $1`, [numeroPedido]);
      for (const item of mapped.items) {
        await client.query(
          `INSERT INTO items ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`,
          [numeroPedido, item.productId, item.quantity, item.price]
        );
      }
    }

    await client.query('COMMIT');

    const updatedOrder = await pool.query(`SELECT * FROM orders WHERE "orderId" = $1`, [numeroPedido]);
    const updatedItems = await pool.query(`SELECT * FROM items WHERE "orderId" = $1`, [numeroPedido]);

    return res.json(buildOrderResponse(updatedOrder.rows[0], updatedItems.rows));
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ──────────────────────────────────────────────
// DELETE /order/:numeroPedido  →  Deletar pedido
// ──────────────────────────────────────────────
const deleteOrder = async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    const result = await pool.query(
      `DELETE FROM orders WHERE "orderId" = $1 RETURNING *`,
      [numeroPedido]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    return res.json({ message: 'Pedido deletado com sucesso.', orderId: numeroPedido });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrder };
