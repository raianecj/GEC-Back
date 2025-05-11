const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarios');

// Rota de registro
router.post('/registrar', UsuarioController.registrar);

// Rota de login
router.post('/login', UsuarioController.login);

// Rota de perfil do usuário
const { verificarToken } = require('../middlewares/auth');
router.get('/perfil', verificarToken, UsuarioController.perfil);

module.exports = router;
