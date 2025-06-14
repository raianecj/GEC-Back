const express = require('express');
const app = express();
const rotaUsuarios = require('./routes/usuarios');
const rotaAdmin = require('./routes/usuariosAdmin');
const rotaEventos = require('./routes/eventos')
const rotaInscricoes = require('./routes/inscricoes');
const rotaPagamento = require('./routes/pagamento');
const cors = require('cors');


// Habilita o CORS para todas as origens
app.use(cors());

app.use(express.json());

app.use(express.json());

app.use('/uploads', express.static('uploads'));



// Rotas da API

app.use('/usuarios', rotaUsuarios);
app.use('/admin', rotaAdmin);
app.use('/eventos', rotaEventos);
app.use('/inscricoes', rotaInscricoes);
app.use('/pagamento', rotaPagamento);

// Porta
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta http://192.168.1.7:${PORTA}`));
