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

// Rota de edição de perfil
router.put('/editar-perfil', verificarToken, UsuarioController.editarPerfil);

// Rota de exclusão de conta
router.delete('/excluir-perfil', verificarToken, UsuarioController.excluirPerfil);

module.exports = router;
