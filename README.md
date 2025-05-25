Abrir o banco de dados pelo terminal
Se estiver no Windows e abrir o SQL Shell, ele vai te pedir:

Nome do servidor: pressione Enter para usar localhost

Database: nome do banco que você criou no Sequelize (por exemplo, gec_dev)

Port: pressione Enter (default é 5432)

Username: seu usuário do PostgreSQL (ex: postgres)

Password: a senha do PostgreSQL

Criar migração: npx sequelize-cli migration:generate --name create-inscricoes

Rodar migração: npx sequelize-cli db:migrate