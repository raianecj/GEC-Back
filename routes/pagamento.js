const express = require('express');
const router = express.Router();
const { criarPreferenciaPagamento, webhookPagamento } = require('../controllers/pagamento');
const { verificarToken } = require('../middlewares/auth');

router.post('/criar-preferencia', verificarToken, criarPreferenciaPagamento);
router.post('/webhook', express.json(), webhookPagamento);

module.exports = router;