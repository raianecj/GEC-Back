const express = require('express');
const router = express.Router();
const { inscreverUsuario, listarInscricoes, verInscricao } = require('../controllers/inscricoes');
const { verificarToken } = require('../middlewares/auth');


router.post('/', verificarToken, inscreverUsuario);
router.get('/', verificarToken, listarInscricoes);
router.get('/:id', verificarToken, verInscricao);

module.exports = router;
