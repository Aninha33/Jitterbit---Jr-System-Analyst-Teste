const { Router } = require('express');
const {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = Router();

// GET  /order/list           → listar todos (deve vir antes de /:numeroPedido)
router.get('/list', listOrders);

// POST /order                → criar pedido
router.post('/', createOrder);

// GET  /order/:numeroPedido  → buscar por número do pedido
router.get('/:numeroPedido', getOrder);

// PUT  /order/:numeroPedido  → atualizar pedido
router.put('/:numeroPedido', updateOrder);

// DELETE /order/:numeroPedido → deletar pedido
router.delete('/:numeroPedido', deleteOrder);

module.exports = router;
