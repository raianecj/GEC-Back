const express = require('express');
const router = express.Router();
const { criarPreferenciaPagamento, webhookPagamento, listarPagamentos } = require('../controllers/pagamento');
const { verificarToken, verificarTokenAdmin } = require('../middlewares/auth');

router.post('/criar-preferencia', verificarToken, criarPreferenciaPagamento);
router.post('/webhook', express.json(), webhookPagamento);
router.get('/', verificarTokenAdmin, listarPagamentos);

module.exports = router;