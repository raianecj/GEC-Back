const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventos');

// Criar novo evento 
router.post('/eventos', EventoController.criarEvento);

// Listar todos os eventos 
router.get('/eventos', EventoController.listarEventos);

// Buscar evento por ID 
router.get('/eventos/:id', EventoController.obterEvento);

// Atualizar evento 
router.put('/eventos/:id', EventoController.atualizarEvento);

// Excluir evento 
router.delete('/eventos/:id', EventoController.excluirEvento);

module.exports = router;
