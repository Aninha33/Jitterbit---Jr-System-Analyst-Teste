require('dotenv').config();
const express = require('express');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Rotas de pedidos
app.use('/order', orderRoutes);

// Rota não encontrada
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

module.exports = app;
