// Routes/eventos.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const EventoController = require('../controllers/eventos');

// Configuração do multer para salvar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Rota para criar novo evento com upload de arquivos
router.post(
  '/',
  upload.fields([
    { name: 'bannerPrincipal', maxCount: 1 },
    { name: 'bannerMiniatura', maxCount: 1 }
  ]),
  EventoController.criarEvento
);

// Listar todos os eventos 
router.get('/', EventoController.listarEventos);

// Buscar evento por ID 
router.get('/:id', EventoController.obterEvento);

// Atualizar evento 
router.put(
   '/:id',
   upload.fields([
     { name: 'bannerPrincipal', maxCount: 1 },
     { name: 'bannerMiniatura', maxCount: 1 }
   ]),
   EventoController.atualizarEvento
 );

// Excluir evento 
router.delete('/:id', EventoController.excluirEvento);

module.exports = router;
