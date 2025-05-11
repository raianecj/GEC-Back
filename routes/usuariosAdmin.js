// routes/usuariosAdmin.js

const express = require('express');
const router = express.Router();
const UsuarioAdminController = require('../controllers/usuariosAdmin');

// Rota de login
router.post('/login-admin', UsuarioAdminController.loginAdmin);

// Rota de registro
router.post('/registrar-admin', UsuarioAdminController.registrarAdmin);

// Rota de perfil do usuário
const { verificarTokenAdmin } = require('../middlewares/auth');
router.get('/perfil-admin', verificarTokenAdmin, UsuarioAdminController.perfilAdmin);

module.exports = router;
