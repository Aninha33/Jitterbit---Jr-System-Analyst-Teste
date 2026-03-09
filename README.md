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

# 🚀 Stack

- Node.js + Express
- PostgreSQL 16
- Docker + Docker Compose

---

## Estrutura das tabelas

**orders**
| orderId | value | creationDate |

**items**
| id | orderId | productId | quantity | price |

## Como rodar

```bash
docker-compose up --build
```

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | /order | Criar pedido |
| GET | /order/list | Listar todos |
| GET | /order/:numeroPedido | Buscar por número |
| PUT | /order/:numeroPedido | Atualizar |
| DELETE | /order/:numeroPedido | Deletar |


## Exemplos

### Criar pedido
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Buscar pedido
```bash
curl http://localhost:3000/order/v10089015vdb-01
```

### Listar todos
```bash
curl http://localhost:3000/order/list
```

### Atualizar pedido
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -d '{
    "valorTotal": 15000,
    "dataCriacao": "2023-07-20T10:00:00.000Z",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 7500
      }
    ]
  }'
```

### Deletar pedido
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01
```


| PUT | `/order/:orderId` | Atualizar um pedido |
| DELETE | `/order/:orderId` | Remover um pedido |
