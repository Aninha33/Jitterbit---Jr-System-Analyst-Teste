# 📦 Order API – Desafio Técnico

![Node](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)

API REST para gerenciamento de pedidos desenvolvida em **Node.js** como parte de um **desafio técnico**.

O projeto demonstra conhecimentos em:

- desenvolvimento de **APIs REST**
- **Node.js** e **Express**
- **transformação de dados (mapping)**
- manipulação de **JSON**
- conceitos de **integração de sistemas**

A aplicação permite criar, consultar, atualizar e remover pedidos, além de realizar **transformação dos dados recebidos antes de salvá-los no banco de dados**.

---

# 🚀 Tecnologias Utilizadas

- Node.js  
- Express.js  
- JavaScript (ES6+)  
- Banco de dados (MongoDB / PostgreSQL / SQL)

---

# 📌 Endpoints da API

| Método | Endpoint | Descrição |
|------|------|------|
| POST | `/order` | Criar um novo pedido |
| GET | `/order/:orderId` | Buscar um pedido pelo ID |
| GET | `/order/list` | Listar todos os pedidos |
| PUT | `/order/:orderId` | Atualizar um pedido |
| DELETE | `/order/:orderId` | Remover um pedido |
