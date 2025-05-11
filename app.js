// app.js
const express = require('express');
const app = express();
const rotaUsuarios = require('./routes/usuarios');
const rotaAdmin = require('./routes/usuariosAdmin');


app.use(express.json());

// Rotas da API

app.use('/usuarios', rotaUsuarios);
app.use('/admin', rotaAdmin);

// Porta
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta http://localhost:${PORTA}`));
