const multer = require('multer');
const path = require('path');

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Crie essa pasta na raiz do projeto
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .jpg, .jpeg e .png são permitidos!'));
    }
  }
});

module.exports = upload;
