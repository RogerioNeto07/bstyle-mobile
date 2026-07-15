# Catalogo-CF-Style

## Descrição:
O sistema consiste em um catálogo virtual para a loja CF Style, localizada em Umarizal - RN. O sistema permitirá que as vencedoras cadastrem os produtos e que os clientes acessem a plataforma para ver os produtos disponíveis.

## Justificativa:
O projeto foi pensado para suprir duas necessidades da CF Style:
- Centralizar as informações de controle e armazenamento de produtos para trazer mais organização e agilidade.
- Entregar ao cliente um catálogo mais acessível e organizado complementando as redes sociais e tornando a apresentação dos produtos mais eficiente.


## Modelo Lógico:
<img width="1404" height="1109" alt="Modelo Lógico - CFStyle (1)" src="https://github.com/user-attachments/assets/b7c54762-9c9d-41ef-803c-232b2e53b4e2" />

## Endpoints:
API disponível em: http://localhost:8080

### Produtos:
| Método   | Endpoint                  | Descrição                                            |
| -------- | ------------------------- | ---------------------------------------------------- |
| `GET`    | `/produtos`               | Lista todos os produtos da vendedora                 |
| `GET`    | `/produtos/:id`           | Detalhes de um produto  |
| `POST`   | `/produtos`               | Cadastra um novo produto                             |
| `PUT`    | `/produtos/:id`           | Atualiza informações do produto                      |
| `DELETE` | `/produtos/:id`           | Remove (ou desativa) um produto                      |
| `GET`    | `/produtos/tipo/:tipo_id` | Lista produtos por tipo                              |
| `GET`    | `/produtos/tag/:tag_id`   | Lista produtos por tag                               |

### Vendas:
| Método | Endpoint                       | Descrição                            |
| ------ | ------------------------------ | ------------------------------------ |
| `GET`  | `/vendas`                      | Lista todas as vendas                |
| `GET`  | `/vendas/:id`                  | Detalhes da venda      |
| `POST` | `/vendas`                      | Cria uma venda com lista de produtos |
| `GET`  | `/faturamento?periodo=2025-11` | Faturamento total por período        |

### Busca/Exibição:
| Método | Endpoint                  | Descrição                                   |
| ------ | ------------------------- | ------------------------------------------- |
| `GET`  | `/produtos/tipo/:tipo_id` | Lista produtos de um tipo específico        |
| `GET`  | `/produtos/tag/:tag_id`   | Lista produtos de uma tag específica        |
| `GET`  | `/feed`                   | Lista produtos mais recentes (feed público) |

### Tags:
| Método   | Endpoint    | Descrição                   |
| -------- | ----------- | --------------------------- |
| `GET`    | `/tags`     | Lista todas as tags         |
| `GET`    | `/tags/:id` | Retorna detalhes de uma tag |
| `POST`   | `/tags`     | Cria uma nova tag           |
| `PUT`    | `/tags/:id` | Atualiza nome de uma tag    |
| `DELETE` | `/tags/:id` | Exclui uma tag              |

### Tipos:
| Método   | Endpoint     | Descrição                        |
| -------- | ------------ | -------------------------------- |
| `GET`    | `/tipos`     | Lista todos os tipos de produtos |
| `GET`    | `/tipos/:id` | Detalhes de um tipo              |
| `POST`   | `/tipos`     | Cria um tipo de produto          |
| `PUT`    | `/tipos/:id` | Atualiza nome do tipo            |
| `DELETE` | `/tipos/:id` | Exclui um tipo                   |

### Cores:
| Método   | Endpoint     | Descrição                        |
| -------- | ------------ | -------------------------------- |
| `GET`    | `/cores`     | Lista todos as cores |
| `GET`    | `/cores/:id` | Detalhes de uma cor              |
| `POST`   | `/cores`     | Cria uma cor          |
| `PUT`    | `/cores/:id` | Atualiza nome da cor            |
| `DELETE` | `/cores/:id` | Exclui uma cor                   |

### Vendas:
| Método   | Endpoint      | Descrição                                       |
| -------- | ------------- | ----------------------------------------------- |
| `GET`    | `/vendas`     | Lista todas as vendas realizadas                |
| `GET`    | `/vendas/:id` | Detalhes de uma venda   |
| `POST`   | `/vendas`     | Registra uma nova venda  |
| `PUT`    | `/vendas/:id` | Atualiza dados da venda          |
| `DELETE` | `/vendas/:id` | Cancela uma venda                     |

### Faturamento:
| Método | Endpoint                       | Descrição                                                                   |
| ------ | ------------------------------ | --------------------------------------------------------------------------- |
| `GET`  | `/faturamento`                 | Retorna faturamento total da vendedora           |
| `GET`  | `/faturamento?periodo=2025-11` | Retorna faturamento filtrado por mês/ano                                    |
| `GET`  | `/faturamento/detalhado`       | Faturamento diário ou por tipo de produto  |

## Executando com Docker
Certifique-se de ter Docker e Docker Compose instalados.
Para construir e subir a imagem do projeto rode o comando:
```sh
docker compose up -d --build
